import { createPortalSounds, createConfettiCelebration, playTimeWarpVoice } from './effects/audioEffects';
import { 
  createParticles, 
  createVortexRings, 
  createSpiralTunnel,
  createEnergyWaves, 
  createLightning, 
  createFlash,
  createBlackHole,
  createWarpStars,
  createMatrixCodeExplosion
} from './effects/visualEffects';
import { 
  createEffectsContainer, 
  applyTimeWarpFilter, 
  cleanupEffects, 
  openDestinationUrl 
} from './effects/domEffects';
import { trackToolVisit } from '@/hooks/useRecentlyVisitedTools';

const isConstrainedMobileClickSurface = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  const isTouchDevice = window.innerWidth < 768 || window.navigator.maxTouchPoints > 0;
  return isTouchDevice && /FBAN|FBAV|FBIOS|FB_IAB|Instagram|Line|TikTok|Twitter|Snapchat/i.test(ua);
};

// Enhanced tool name extraction that works with all tool types and categories
const extractToolName = (destinationUrl: string, providedToolName?: string): string => {
  console.log('🎯 Extracting tool name for URL:', destinationUrl);
  console.log('🎯 Provided tool name:', providedToolName);
  
  // If we have a provided tool name, use it directly
  if (providedToolName && providedToolName.trim().length > 0) {
    const cleanedName = providedToolName.trim()
      .replace(/\s+(GPT|AI|Tool|Platform|Studio|App|Software|Service|Pro|Plus|Premium)(\s|$)/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log('🎯 Using provided tool name:', cleanedName || providedToolName);
    return cleanedName || providedToolName;
  }
  
  const activeElement = document.activeElement as HTMLElement;
  
  if (activeElement) {
    // First, try to get tool name from the clicked element's context
    const buttonText = activeElement.textContent?.trim() || '';
    console.log('🔍 Button text:', buttonText);
    
    // Look for the tool card container
    const toolCard = activeElement.closest('[class*="card"], .tool-card, [data-tool], .group');
    console.log('🎯 Found tool card:', !!toolCard);
    
    if (toolCard) {
      // Try multiple strategies to find the tool title
      const titleSelectors = [
        'h1, h2, h3, h4, h5, h6',
        '[class*="title"]',
        '[class*="CardTitle"]',
        '[class*="tool-title"]',
        '.font-bold',
        '.font-semibold',
        '.text-lg',
        '.text-xl',
        '.text-2xl'
      ];
      
      for (const selector of titleSelectors) {
        const titleElement = toolCard.querySelector(selector);
        if (titleElement?.textContent) {
          const title = titleElement.textContent.trim();
          // Clean up the title - remove extra whitespace and common UI elements
          const cleanTitle = title
            .replace(/\s+/g, ' ')
            .replace(/^\s*[\d\.\-\*\+]\s*/, '') // Remove list markers
            .replace(/\s*(★|⭐|rating|votes?|reviews?)\s*.*$/i, '') // Remove ratings
            .replace(/\s*(USE IT NOW|View Details|Learn More|Get Started)\s*$/i, '') // Remove button text
            .replace(/\s*\|\s*.*$/, '') // Remove everything after pipe
            .replace(/\s*–\s*.*$/, '') // Remove everything after dash
            .replace(/\s*-\s*.*$/, '') // Remove everything after hyphen
            .trim();
          
          if (cleanTitle && cleanTitle.length > 2 && cleanTitle.length < 100) {
            console.log('🎯 Found tool title from selector', selector, ':', cleanTitle);
            return cleanTitle;
          }
        }
      }
      
      // Try to get from data attributes
      const dataTitle = toolCard.getAttribute('data-title') || 
                       toolCard.getAttribute('title') ||
                       toolCard.getAttribute('aria-label');
      if (dataTitle && dataTitle.trim().length > 2) {
        console.log('🎯 Found tool title from data attribute:', dataTitle.trim());
        return dataTitle.trim();
      }
      
      // Try to get from alt text of images
      const img = toolCard.querySelector('img');
      if (img?.alt && img.alt.trim().length > 2) {
        const altText = img.alt.trim().replace(/\s+(logo|icon|image)$/i, '');
        if (altText.length > 2) {
          console.log('🎯 Found tool title from image alt:', altText);
          return altText;
        }
      }
      
      // Look for any prominent text in the card
      const allText = toolCard.textContent || '';
      const lines = allText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 2 && line.length < 100)
        .filter(line => !line.match(/^\d+(\.\d+)?\s*★/)) // Remove ratings
        .filter(line => !line.toLowerCase().includes('use it now'))
        .filter(line => !line.toLowerCase().includes('view details'))
        .filter(line => !line.toLowerCase().includes('votes'))
        .filter(line => !line.toLowerCase().includes('rating'))
        .filter(line => !line.toLowerCase().includes('category'))
        .filter(line => !line.toLowerCase().includes('tag'));
      
      // Get the first substantial line that looks like a tool name
      const toolNameLine = lines.find(line => 
        line.length >= 3 && 
        line.length <= 80 &&
        !line.match(/^\d+$/) && // Not just numbers
        !line.match(/^[★⭐]+$/) && // Not just stars
        line.split(' ').length <= 10 // Not too many words
      );
      
      if (toolNameLine) {
        console.log('🎯 Found tool name from card text analysis:', toolNameLine);
        return toolNameLine;
      }
    }
    
    // If we have a "USE IT NOW" button, look in the surrounding context
    if (buttonText.toLowerCase().includes('use it now')) {
      const container = activeElement.closest('.group, [class*="card"], .tool-item') || 
                       activeElement.parentElement?.parentElement;
      
      if (container) {
        const containerText = container.textContent || '';
        const lines = containerText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 2 && line.length < 100)
          .filter(line => !line.toLowerCase().includes('use it now'))
          .filter(line => !line.toLowerCase().includes('view details'))
          .filter(line => !line.includes('★'))
          .filter(line => !line.toLowerCase().includes('rating'))
          .filter(line => !line.toLowerCase().includes('votes'));
        
        const toolName = lines[0]; // Usually the first line is the tool name
        if (toolName && toolName.length > 2) {
          console.log('🎯 Found tool name from USE IT NOW context:', toolName);
          return toolName;
        }
      }
    }
  }
  
  // Fallback: extract from URL
  if (destinationUrl) {
    try {
      const url = new URL(destinationUrl);
      const hostname = url.hostname.toLowerCase();
      
      // Handle specific domains
      if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) {
        if (url.pathname.includes('/g/')) {
          const pathParts = url.pathname.split('/');
          const gptIndex = pathParts.indexOf('g');
          if (gptIndex >= 0 && pathParts[gptIndex + 2]) {
            const gptName = pathParts[gptIndex + 2]
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            console.log('🎯 Found ChatGPT name from URL:', gptName);
            return gptName;
          }
        }
        return 'ChatGPT';
      }
      
      // Extract from domain name
      const domainParts = hostname.replace('www.', '').split('.');
      const mainDomain = domainParts[0];
      
      // Handle common domain patterns
      const domainBasedName = mainDomain
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
      
      if (domainBasedName && domainBasedName.length > 1) {
        console.log('🎯 Using domain-based tool name:', domainBasedName);
        return domainBasedName;
      }
      
      // Extract from pathname
      const pathParts = url.pathname.split('/').filter(part => part && part !== 'via=aiwebtools');
      if (pathParts.length > 0) {
        const pathBasedName = pathParts[pathParts.length - 1]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        if (pathBasedName && pathBasedName.length > 2) {
          console.log('🎯 Using path-based tool name:', pathBasedName);
          return pathBasedName;
        }
      }
    } catch (error) {
      console.log('Error parsing URL:', error);
    }
  }
  
  console.log('🎯 Using fallback tool name');
  return 'AI Tool';
};

export const createTimePortalEffect = (
  destinationUrl: string, 
  toolName?: string,
  options?: { skipScreenOverlay?: boolean; emoji?: string }
) => {
  console.log('🌀 TIME WARP ACTIVATED for URL:', destinationUrl);
  
  // Extract tool name for logging
  const finalToolName = extractToolName(destinationUrl, toolName);
  console.log('🎯 Tool name:', finalToolName);

  // Track this tool visit for "Recently Visited" feature
  const emoji = options?.emoji || '🔧';
  trackToolVisit(finalToolName, emoji, destinationUrl);

  // Special sentinel: trigger CSV download of the complete tool directory
  const isCsvDownload = destinationUrl?.startsWith('csv-download://');

  // CRITICAL: open normal external URLs before any DOM/audio effects so mobile
  // taps never wait on animation work. Effects are purely decorative.
  if (!isCsvDownload && destinationUrl && destinationUrl.trim()) {
    console.log('🚀 Opening URL first (sync, preserves user gesture):', destinationUrl);
    openDestinationUrl(destinationUrl);

    // Social in-app browsers need the tap path kept ultra-light; audio/flash
    // work after navigation can make the website feel frozen inside Facebook.
    if (isConstrainedMobileClickSurface()) {
      return;
    }
  }

  // Play voice immediately - MUST be called from click handler for autoplay
  console.log('🎤 Triggering voice...');
  playTimeWarpVoice();

  // Create ultra-brief green matrix flash
  console.log('✨ Creating visual flash...');
  const elements = options?.skipScreenOverlay ? [] : createInstantMatrixFlash();

  // CRITICAL: open the URL SYNCHRONOUSLY inside the click handler so the
  // browser preserves the user-gesture and never blocks the new tab.
  // Visual flash runs in parallel and is cleaned up shortly after.
  if (isCsvDownload) {
    console.log('📥 CSV download sentinel detected — exporting full directory');
    (async () => {
      try {
        const [{ directoryTools }, { downloadToolsCSV }, { createConfettiCelebration }] = await Promise.all([
          import('@/data/toolsData'),
          import('@/utils/csvExport'),
          import('@/utils/effects/audioEffects'),
        ]);
        createConfettiCelebration();
        downloadToolsCSV(directoryTools, `AIWebTools-Complete-Directory-${directoryTools.length}-Tools.csv`);
      } catch (err) {
        console.error('CSV download failed:', err);
      }
    })();
  }

  // Clean up the flash visuals after 250ms (decoupled from navigation)
  setTimeout(() => {
    elements.forEach(el => { try { el.remove(); } catch {} });
  }, 250);

  // SAFETY NET: hard-clear any leftover portal overlay shortly after, in
  // case a previous flash got orphaned (e.g. user double-clicked a tool
  // or the page navigated mid-flash and a node was never removed). Fixes
  // the rare "loading screen never disappears / timeout" complaint.
  setTimeout(() => {
    try {
      document.querySelectorAll('[data-time-portal-overlay], [data-time-portal-flash]').forEach((n) => n.remove());
    } catch {}
  }, 1200);
};

// Ultra-brief green matrix flash - returns elements for cleanup
const createInstantMatrixFlash = (): HTMLElement[] => {
  const elements: HTMLElement[] = [];

  // Green flash overlay
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at center, rgba(0,255,0,0.9) 0%, rgba(0,200,0,0.6) 30%, transparent 70%);
    z-index: 99999;
    pointer-events: none;
  `;
  document.body.appendChild(flash);
  elements.push(flash);

  // Binary explosion - 30 characters shooting out
  for (let i = 0; i < 30; i++) {
    const char = document.createElement('div');
    const binary = Math.random() > 0.5 ? '1' : '0';
    const angle = (i / 30) * 360;
    const distance = 100 + Math.random() * 200;
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    
    char.textContent = binary;
    char.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: bold;
      color: #00FF00;
      text-shadow: 0 0 10px #00FF00;
      z-index: 100000;
      pointer-events: none;
      transform: translate(-50%, -50%) translate(${x}px, ${y}px);
      opacity: 1;
    `;
    document.body.appendChild(char);
    elements.push(char);
  }

  return elements;
};
