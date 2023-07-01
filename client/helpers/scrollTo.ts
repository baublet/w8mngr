export function scrollTo(element: string = "main"): void {
  if (!document) {
    return;
  }
  document
    .querySelector(element)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
