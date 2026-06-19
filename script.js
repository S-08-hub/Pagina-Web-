const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("isvisible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

const counters = document.querySelectorAll("[data-counter]");
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target).toString();
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.35 });

  counters.forEach((item) => counterObserver.observe(item));
}

const tipTitle = document.querySelector("#tip-title");
const tipText = document.querySelector("#tip-text");
const tipButtons = document.querySelectorAll("[data-tip]");

const tips = [
  {
    title: "Escucha en la escuela",
    text: "Cuando escuchas bien, entiendes el problema real y puedes contestar con calma.",
  },
  {
    title: "Habla con respeto en casa",
    text: "Las correcciones sirven mas cuando se dicen con calma y sin insultos.",
  },
  {
    title: "No compartas burlas en redes",
    text: "Evitar reenviar agresiones digitales tambien es una forma de prevenir violencia escolar.",
  },
];

function setTip(index) {
  const tip = tips[index] || tips[0];
  if (tipTitle) tipTitle.textContent = tip.title;
  if (tipText) tipText.textContent = tip.text;
  tipButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.tip) === index);
  });
}

tipButtons.forEach((button) => {
  button.addEventListener("click", () => setTip(Number(button.dataset.tip)));
});

setTip(0);

const galleryGrid = document.querySelector("#gallery-grid");
const galleryItems = [
  {
    title: "Respeto",
    description: "Una ilustracion simple sobre trato digno y convivencia sana.",
    file: "assets/respeto.svg",
    alt: "Ilustracion de respeto",
  },
  {
    title: "Dialogo",
    description: "Dos voces que conversan de manera clara y sin agresion.",
    file: "assets/dialogo.svg",
    alt: "Ilustracion de dialogo",
  },
  {
    title: "Apoyo",
    description: "Una red de ayuda para pedir acompanamiento a tiempo.",
    file: "assets/apoyo.svg",
    alt: "Ilustracion de apoyo",
  },
  {
    title: "Prevencion",
    description: "Un escudo visual que representa seguridad y cuidado.",
    file: "assets/prevencion.svg",
    alt: "Ilustracion de prevencion",
  },
  {
    title: "Escuela segura",
    description: "Ambiente escolar con convivencia tranquila y ordenada.",
    file: "assets/escuela.svg",
    alt: "Ilustracion de escuela segura",
  },
];

if (galleryGrid) {
  galleryGrid.innerHTML = galleryItems
    .map(
      (item) => `
        <article class="gallery-card reveal">
          <img src="${item.file}" alt="${item.alt}" data-lightbox="${item.file}" data-alt="${item.alt}">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="gallery-actions">
            <button type="button" data-preview="${item.file}" data-alt="${item.alt}">Ver</button>
            <a href="${item.file}" download>Descargar</a>
          </div>
        </article>
      `
    )
    .join("");

  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("isvisible");
      galleryObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  galleryGrid.querySelectorAll(".reveal").forEach((item) => galleryObserver.observe(item));
}

let lightbox;

function ensureLightbox() {
  if (lightbox) return lightbox;

  lightbox = document.querySelector(".lightbox");
  if (!lightbox) return null;

  const close = lightbox.querySelector(".lightbox-close");
  const img = lightbox.querySelector("img");

  const hide = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  close?.addEventListener("click", hide);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hide();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) hide();
  });

  return lightbox;
}

function openLightbox(src, alt) {
  const modal = ensureLightbox();
  if (!modal) return;
  const img = modal.querySelector("img");
  if (!img) return;

  img.src = src;
  img.alt = alt || "";
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const preview = target.closest("[data-preview]");
  const trigger = target.closest("[data-lightbox]");

  if (preview) {
    openLightbox(preview.dataset.preview || "", preview.dataset.alt || "");
  } else if (trigger) {
    openLightbox(trigger.dataset.lightbox || "", trigger.dataset.alt || "");
  }
});
