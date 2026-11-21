// No site-imposed daily cap; upstream provider credit and rate limits still apply.
export const DAILY_FREE_RUNS: number | null = null;
export const freeAllowanceReached = (used: number) => DAILY_FREE_RUNS !== null && used >= DAILY_FREE_RUNS;