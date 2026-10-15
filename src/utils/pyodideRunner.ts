export interface PythonResult { output: string; images: string[]; error: boolean }

const PYODIDE_VERSION = "0.27.2";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodidePromise: Promise<any> | null = null;

function loadPyodideOnce() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const base = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
      const script = document.createElement("script");
      script.src = `${base}pyodide.js`;
      script.onload = () => (window as any).loadPyodide({ indexURL: base }).then(resolve, reject);
      script.onerror = () => reject(new Error("Python engine failed to load"));
      document.head.appendChild(script);
    }).catch((e) => { pyodidePromise = null; throw e; });
  }
  return pyodidePromise;
}

/** Runs Python in the visitor's browser (free, no server credits); captures prints and matplotlib charts. */
export async function runPythonOnDevice(code: string): Promise<PythonResult> {
  const py = await loadPyodideOnce();
  const lines: string[] = [];
  py.setStdout({ batched: (s: string) => lines.push(s) });
  py.setStderr({ batched: (s: string) => lines.push(s) });
  await py.loadPackagesFromImports(code);
  const usesPlot = /matplotlib|pyplot|plt\./.test(code);
  if (usesPlot) { await py.loadPackage("matplotlib"); await py.runPythonAsync("import matplotlib\nmatplotlib.use('Agg')"); }
  try {
    await py.runPythonAsync(code);
  } catch (e) {
    return { output: [...lines, String((e as Error).message || e)].join("\n").slice(-6000), images: [], error: true };
  }
  let images: string[] = [];
  if (usesPlot) {
    const json = await py.runPythonAsync(`import io, base64, json\nimport matplotlib.pyplot as _p\n_o=[]\nfor _n in _p.get_fignums():\n    _b=io.BytesIO(); _p.figure(_n).savefig(_b, format='png', dpi=110, bbox_inches='tight'); _o.append('data:image/png;base64,'+base64.b64encode(_b.getvalue()).decode())\n_p.close('all')\njson.dumps(_o)`);
    images = JSON.parse(json);
  }
  return { output: lines.join("\n").slice(-6000), images, error: false };
}
