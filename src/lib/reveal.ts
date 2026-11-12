/** Fades an element up as it scrolls into view. Without JS, or with reduced motion, it is simply visible. */
export function reveal(node: HTMLElement) {
  if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = node.getBoundingClientRect();
  if (r.top < innerHeight) return; // already on screen: never hide it
  node.classList.add("reveal", "pending");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { node.classList.remove("pending"); io.disconnect(); }
  }, { rootMargin: "0px 0px -10% 0px" });
  io.observe(node);
  return { destroy: () => io.disconnect() };
}
