export const normalizeSearchName = (value: string): string => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function exactEnterTarget<T extends { title: string }>(query:string, results:T[]):T | undefined {
 const name=normalizeSearchName(query);
 return name ? results.find(result=>normalizeSearchName(result.title)===name) : undefined;
}