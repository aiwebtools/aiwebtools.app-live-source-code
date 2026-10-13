import { analyzeDataText } from "./botAttachments";

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    const file = event.data;
    self.postMessage({ attachment: analyzeDataText(file.name, file.size, await file.text()) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "The file could not be read." });
  }
};