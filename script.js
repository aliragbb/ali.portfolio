const works = [
  {
    title: "Fire House — Cinematic",
    src: "pics/fire-house.jpg",
    tags: ["cinematic", "editorial"]
  },
  {
    title: "Green Duo — Street",
    src: "pics/green duo.jpg",
    tags: ["street", "editorial"]
  },
  {
    title: "Metro Duo — Editorial",
    src: "pics/metro duo.jpg",
    tags: ["editorial", "street"]
  },
  {
    title: "Night Duo — Street",
    src: "pics/night duo.jpg",
    tags: ["street"]
  },
  {
    title: "NY Man — Street Portrait",
    src: "pics/ny man.jpg",
    tags: ["street", "editorial"]
  },
  {
    title: "Ski — Sports",
    src: "pics/ski.jpg",
    tags: ["sports", "cinematic"]
  },
  {
    title: "Street Duo — Streetwear",
    src: "pics/street duo.jpg",
    tags: ["street"]
  },
  {
    title: "Dog Owner — Grit Portrait",
    src: "pics/dog owner.jpg",
    tags: ["street", "cinematic"]
  },
  {
    title: "Duo Fashion — Studio",
    src: "pics/duo-fashion.jpg",
    tags: ["editorial"]
  }
];

// Elements
const yearEl = document.getElementById("year");
const gridEl = document.getElementById("workGrid");
const pills = Array.from(document.querySelectorAll(".pill"));

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxTags = document.getElementById("lightboxTags");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = Array.from(document.querySelectorAll(".mobileLink"));

let currentFilter = "all";
let currentIndex = 0;

// Init
yearEl.textContent = new Date().getFullYear();
renderGrid();

// Mobile menu
menuBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
});
mobileLinks.forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}));

// Filters
pills.forEach(btn => {
  btn.addEventListener("click", () => {
    pills.forEach(p => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    currentFilter = btn.dataset.filter;
    renderGrid();
  });
});

function getFilteredWorks() {
  if (currentFilter === "all") return works;
  return works.filter(w => w.tags.includes(currentFilter));
}

function renderGrid() {
  const list = getFilteredWorks();

  gridEl.innerHTML = list.map((w, idx) => {
    const tagHtml = w.tags.map(t => `<span class="workTag">${cap(t)}</span>`).join("");
    return `
      <article class="workCard" role="button" tabindex="0" data-idx="${idx}">
        <img class="workThumb" src="${w.src}" alt="${escapeHtml(w.title)}" loading="lazy" />
        <div class="workMeta">
          <p class="workTitle">${escapeHtml(w.title)}</p>
          <div class="workTags">${tagHtml}</div>
        </div>
      </article>
    `;
  }).join("");

  // Card click handlers
  Array.from(gridEl.querySelectorAll(".workCard")).forEach(card => {
    card.addEventListener("click", () => openLightbox(Number(card.dataset.idx)));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(Number(card.dataset.idx));
    });
  });
}

// Lightbox
function openLightbox(filteredIndex) {
  const list = getFilteredWorks();
  currentIndex = clamp(filteredIndex, 0, list.length - 1);

  const item = list[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;

  lightboxTitle.textContent = item.title;
  lightboxTags.innerHTML = item.tags.map(t => `<span class="workTag">${cap(t)}</span>`).join("");

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function navLightbox(dir) {
  const list = getFilteredWorks();
  if (!list.length) return;
  currentIndex = (currentIndex + dir + list.length) % list.length;
  const item = list[currentIndex];

  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;
  lightboxTitle.textContent = item.title;
  lightboxTags.innerHTML = item.tags.map(t => `<span class="workTag">${cap(t)}</span>`).join("");
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => navLightbox(-1));
lightboxNext.addEventListener("click", () => navLightbox(1));

// Close when clicking outside image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support
window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navLightbox(-1);
  if (e.key === "ArrowRight") navLightbox(1);
});

// Contact form (mailto)
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const name = fd.get("name");
  const email = fd.get("email");
  const message = fd.get("message");

  const subject = encodeURIComponent("AI Photoshoot Booking");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
  );

  // Change this to your real email:
  window.location.href = `mailto:yourname@email.com?subject=${subject}&body=${body}`;
});

// Helpers
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

