// Keep both local root hosting and GitHub project Pages navigation working.
export const siteBase = import.meta.env.BASE_URL.replace(/\/$/, "");
export function sitePath(path: string) {
  return `${siteBase}/${path.replace(/^\//, "")}`;
}
