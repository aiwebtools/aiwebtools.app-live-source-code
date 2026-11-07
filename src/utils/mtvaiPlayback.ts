/** Completion comes from the active iframe's ended event, not wall-clock estimates. */
export function createVideoCompletionGate() {
  let played = false;
  let completed = false;
  return {
    observe(state: number) {
      if (state === 1) played = true;
      if (state !== 0 || !played || completed) return false;
      completed = true;
      return true;
    },
  };
}