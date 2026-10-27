(() => {
  const projects = window.PROJECTS;
  const list = document.getElementById("project-list");
  const detail = document.getElementById("detail");
  const detailBody = document.getElementById("detail-body");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocus = null;

  document.getElementById("year").textContent = new Date().getFullYear();

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const demoButton = (p, cls = "") =>
    p.demo
      ? `<a class="btn btn-solid ${cls}" href="${p.demo}" target="_blank" rel="noopener">Open demo ↗</a>`
      : `<span class="btn btn-disabled ${cls}" aria-disabled="true">Demo soon</span>`;

  const repoButton = (p, cls = "") =>
    `<a class="btn btn-ghost ${cls}" href="${p.repo}" target="_blank" rel="noopener">Open repo ↗</a>`;

  // Cover: a screenshot when the repo has one, otherwise a drawn pipeline panel.
  const cover = (p) =>
    p.cover
      ? `<img src="${p.cover}" alt="${esc(p.name)} screenshot" loading="lazy">`
      : `<div class="cover-pipeline mono">${p.architecture
          .slice(1, 6)
          .map((s, i) => `<span style="--i:${i}">${esc(s)}</span>`)
          .join("")}</div>`;

  // ---------- Cards ----------
  list.innerHTML = projects
    .map(
      (p, i) => `
      <article class="card" data-tilt>
        <div class="card-cover">${cover(p)}<span class="card-index mono">0${i + 1}</span></div>
        <div class="card-body">
          <p class="card-tag mono">${esc(p.tagline)}</p>
          <h3>${esc(p.name)}</h3>
          <p class="card-summary">${esc(p.summary)}</p>
          <ul class="chips">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <div class="card-actions">
            ${demoButton(p)}
            ${repoButton(p)}
            <a class="btn btn-line" href="#/project/${p.id}">View details →</a>
          </div>
        </div>
      </article>`
    )
    .join("");

  // 3D tilt following the pointer.
  if (!reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateZ(0)`;
        card.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }

  // ---------- Detail view ----------
  function renderDetail(p) {
    const i = projects.indexOf(p);
    const next = projects[(i + 1) % projects.length];
    detailBody.innerHTML = `
      <div class="detail-top">
        <a class="detail-close mono" href="#projects" aria-label="Close details">← all projects</a>
        <span class="mono muted">0${i + 1} / 0${projects.length}</span>
      </div>

      <header class="detail-hero">
        <p class="eyebrow mono">${esc(p.tagline)}</p>
        <h2 id="detail-title">${esc(p.name)}</h2>
        <p class="lede">${esc(p.summary)}</p>
        <div class="card-actions">${demoButton(p)}${repoButton(p)}</div>
      </header>

      <div class="detail-stats">
        ${p.stats.map(([v, l]) => `<div><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join("")}
      </div>

      ${p.cover ? `<figure class="detail-cover"><img src="${p.cover}" alt="${esc(p.name)} main screen"></figure>` : ""}

      <section class="detail-block">
        <h3><span class="mono accent">01</span> The problem</h3>
        <p class="problem">${esc(p.problem)}</p>
      </section>

      <section class="detail-block">
        <h3><span class="mono accent">02</span> What it does</h3>
        <div class="feature-grid">
          ${p.features.map(([t, d]) => `<div class="feature"><h4>${esc(t)}</h4><p>${esc(d)}</p></div>`).join("")}
        </div>
      </section>

      <section class="detail-block">
        <h3><span class="mono accent">03</span> Architecture</h3>
        <ol class="arch">
          ${p.architecture.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}
        </ol>
      </section>

      <section class="detail-block">
        <h3><span class="mono accent">04</span> Built with</h3>
        <ul class="chips big">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </section>

      ${
        p.gallery.length
          ? `<section class="detail-block">
              <h3><span class="mono accent">05</span> Screens</h3>
              <div class="gallery">
                ${p.gallery
                  .map(([src, cap]) => `<figure><a href="${src}" target="_blank" rel="noopener" title="Open full size"><img src="${src}" alt="${esc(cap)}" loading="lazy"></a><figcaption>${esc(cap)}</figcaption></figure>`)
                  .join("")}
              </div>
            </section>`
          : ""
      }

      <a class="next-project" href="#/project/${next.id}">
        <span class="mono muted">next project</span>
        <strong>${esc(next.name)} →</strong>
      </a>`;
  }

  function route() {
    const m = location.hash.match(/^#\/project\/([\w-]+)$/);
    const p = m && projects.find((x) => x.id === m[1]);
    if (p) {
      if (detail.hidden) lastFocus = document.activeElement;
      renderDetail(p);
      detail.hidden = false;
      detail.scrollTop = 0;
      document.body.classList.add("locked");
      requestAnimationFrame(() => detail.classList.add("open"));
      detail.querySelector(".detail-close").focus({ preventScroll: true });
    } else if (!detail.hidden) {
      detail.classList.remove("open");
      document.body.classList.remove("locked");
      setTimeout(() => (detail.hidden = true), reduceMotion ? 0 : 350);
      lastFocus?.focus({ preventScroll: true });
    }
  }

  addEventListener("hashchange", route);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !detail.hidden) location.hash = "#projects";
  });
  route();

  // Reveal sections on scroll.
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".card, .section-head, .stack-col, .contact").forEach((el) => io.observe(el));
})();
