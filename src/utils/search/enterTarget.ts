export const normalizeSearchName = (value: string): string => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function exactEnterTarget<T extends { title: string }>(query:string, results:T[]):T | undefined {
 const name=normalizeSearchName(query);
 return name ? results.find(result=>normalizeSearchName(result.title)===name) : undefined;
}

/** Keep direct names ahead of recommendations, including the resurrection family intent. */
export function prioritizeDiscoveryResults<T extends { title: string }>(query: string, results: T[]): T[] {
 const name = normalizeSearchName(query);
 const resurrection = /\b(?:resurrection|ressurection|resurection|resurrecton|resurrecion|resurrect|ressurect|resurect)\b/.test(name);
 const priority = (tool: T) => {
  const title = normalizeSearchName(tool.title);
  if (title === name) return 3;
  if (resurrection && title === 'resurrection gpt') return 2;
  return 0;
 };
 return results.map((tool, order) => ({ tool, order, priority: priority(tool) }))
  .sort((a, b) => b.priority - a.priority || a.order - b.order).map(({ tool }) => tool);
}