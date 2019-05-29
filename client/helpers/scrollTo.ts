export default function scrollTo(element: string = "main") {
  if (!document) {
    return;
  }
  document
    .querySelector(element)
    .scrollIntoView({ behavior: "smooth", block: "start" });
}
