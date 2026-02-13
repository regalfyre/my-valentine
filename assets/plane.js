import { fetchAllItems } from "./api.js";

const rand = (n) => Math.floor(Math.random() * n);

export async function bootPlane({ mount, statusEl }) {
  statusEl.textContent = "Loading…";

  const data = await fetchAllItems();

  // IMPORTANT: this expects your Worker to return item.url
  const urls = data.map(x => x.url).filter(Boolean);

  const W = 9000, H = 9000;
  mount.style.width = W + "px";
  mount.style.height = H + "px";

  const viewport = mount.parentElement;
  let scale = 1, tx = 0, ty = 0;

  const apply = () => {
    mount.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };

  let dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;

  viewport.addEventListener("mousedown", (e) => {
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    stx = tx; sty = ty;
    viewport.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    viewport.style.cursor = "grab";
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    tx = stx + (e.clientX - sx);
    ty = sty + (e.clientY - sy);
    apply();
  });

  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    scale = Math.min(2.5, Math.max(0.35, scale * (delta > 0 ? 0.92 : 1.08)));
    apply();
  }, { passive:false });

  for (const u of urls) {
    const img = document.createElement("img");
    img.src = u;
    img.loading = "lazy";
    img.className = "card";
    img.style.left = rand(W) + "px";
    img.style.top  = rand(H) + "px";
    mount.appendChild(img);
  }

  statusEl.textContent = `Loaded ${urls.length} cards`;
  apply();
}
