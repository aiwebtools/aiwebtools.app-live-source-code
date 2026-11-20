"""Public entry regression: run with python3 scripts/test-direct-entry.py.

Checks fresh visitors, reloads and in-app navigation without accepting consent.
Screenshots stay outside the source checkout.
"""
import asyncio
from pathlib import Path
from urllib.parse import urlsplit
from playwright.async_api import async_playwright

ORIGIN = "http://localhost:8080"
ROUTES = [
    "/", "/blog", "/features", "/privacy-policy", "/favorites",
    "/time-machine-gpt", "/tool/time-machine-gpt",
    "/category/AI%20Agents", "/main-category/ALL%20AI%20TOOLS",
    "/categories/ALL%20AI%20TOOLS", "/music-stream",
]
SCREENSHOTS = Path("/tmp/browser/direct-entry/screenshots")


async def assert_direct(page, route):
    await page.wait_for_function(
        "document.body.getAttribute('data-aiwt-route-ready') === 'true'",
        timeout=90000,
    )
    expected = route.replace("/categories/", "/main-category/").replace("/tool/time-machine-gpt", "/time-machine-gpt")
    assert urlsplit(page.url).path == expected, (route, page.url)
    assert await page.get_by_role("textbox", name="Access code").count() == 0
    assert await page.get_by_role("dialog", name="MTVAI opening", exact=True).count() == 0
    assert await page.locator("[inert]").count() == 0
    assert await page.locator("#aiwt-loader-overlay").count() == 0
    assert await page.evaluate(
        "!localStorage.getItem('aitools-consent-v3') && "
        "!sessionStorage.getItem('aitools-consent-v3') && "
        "window.__AIT_CONSENT_ACCEPTED__ !== true"
    ), "Direct entry must not record false consent"
    print("direct page:", route, flush=True)


async def main():
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        for viewport in [{"width": 1280, "height": 1800}, {"width": 390, "height": 844}]:
            errors = []
            # New context per route: no cookies, acceptance or prior gate unlock.
            for index, route in enumerate(ROUTES):
                context = await browser.new_context(viewport=viewport)
                page = await context.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                await page.goto(ORIGIN + route, wait_until="domcontentloaded")
                await assert_direct(page, route)
                await page.screenshot(path=str(SCREENSHOTS / f"{viewport['width']}-{index}.png"))
                await page.reload(wait_until="domcontentloaded")
                await assert_direct(page, route)
                if route == "/":
                    # Existing first-party router event, not a document navigation.
                    await page.evaluate("window.__aiwtRouteReady = false; document.body.removeAttribute('data-aiwt-route-ready')")
                    await page.evaluate("window.dispatchEvent(new CustomEvent('aiwt:in-app-navigate', { detail: { to: '/blog' } }))")
                    await page.wait_for_url(ORIGIN + "/blog")
                    await assert_direct(page, "/blog")
                await context.close()
            assert not errors, errors
            print("passed viewport:", viewport, flush=True)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())