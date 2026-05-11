const iconMap = {
  camera: "📷",
  wifi: "📶",
  shield: "🔒",
  headphones: "🎧"
};

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function scrollToSection(hash) {
  const target = document.querySelector(hash);
  if (!target) {
    return;
  }

  const header = document.querySelector(".site-header");
  const headerOffset = header ? header.offsetHeight + 28 : 120;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth"
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        event.preventDefault();
        history.replaceState(null, "", href);
        scrollToSection(href);
      }

      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || link.closest(".site-nav")) {
      return;
    }

    event.preventDefault();
    history.replaceState(null, "", href);
    scrollToSection(href);
  });
});

function createWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function renderServices(services) {
  const servicesGrid = document.getElementById("services-grid");
  const footerServices = document.getElementById("footer-services");

  if (servicesGrid) {
    servicesGrid.innerHTML = "";
  }
  if (footerServices) {
    footerServices.innerHTML = "";
  }
}

function renderServiceGallery(items) {
  const serviceGallery = document.getElementById("service-gallery");
  const dotsContainer = document.getElementById("service-gallery-dots");
  const prevButton = document.getElementById("service-gallery-prev");
  const nextButton = document.getElementById("service-gallery-next");
  if (!serviceGallery) {
    return;
  }

  serviceGallery.innerHTML = "";
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="gallery-card-body">
        <h3>${item.title}</h3>
        <p>${item.caption}</p>
      </div>
    `;
    serviceGallery.appendChild(card);
  });

  const slides = Array.from(serviceGallery.children);
  if (!slides.length) {
    if (prevButton) {
      prevButton.disabled = true;
    }
    if (nextButton) {
      nextButton.disabled = true;
    }
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
    }
    return;
  }

  let currentIndex = 0;

  function getVisibleCount() {
    if (window.innerWidth <= 640) {
      return 1;
    }
    if (window.innerWidth <= 1100) {
      return 2;
    }
    return 3;
  }

  function getMaxIndex() {
    return Math.max(slides.length - getVisibleCount(), 0);
  }

  function renderDots() {
    if (!dotsContainer) {
      return;
    }

    dotsContainer.innerHTML = "";
    const totalDots = getMaxIndex() + 1;

    for (let index = 0; index < totalDots; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `service-carousel-dot${index === currentIndex ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Ir al slide ${index + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateButtons() {
    const maxIndex = getMaxIndex();
    if (prevButton) {
      prevButton.disabled = currentIndex <= 0;
    }
    if (nextButton) {
      nextButton.disabled = currentIndex >= maxIndex;
    }
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);

    const firstSlide = slides[0];
    const slideStyles = window.getComputedStyle(serviceGallery);
    const gap = Number.parseFloat(slideStyles.columnGap || slideStyles.gap || "0");
    const offset = (firstSlide.offsetWidth + gap) * currentIndex;
    serviceGallery.style.transform = `translateX(-${offset}px)`;

    renderDots();
    updateButtons();
  }

  if (prevButton) {
    prevButton.onclick = () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      updateCarousel();
    };
  }

  if (nextButton) {
    nextButton.onclick = () => {
      currentIndex = Math.min(currentIndex + 1, getMaxIndex());
      updateCarousel();
    };
  }

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}

function renderCoverage(cities) {
  const coverageChips = document.getElementById("coverage-chips");
  coverageChips.innerHTML = "";

  cities.forEach((city) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = city;
    coverageChips.appendChild(chip);
  });
}

function renderClientWork(sectionConfig, photos) {
  const title = document.getElementById("client-work-title");
  const subtitle = document.getElementById("client-work-subtitle");
  const grid = document.getElementById("client-work-grid");
  const dots = document.getElementById("client-work-dots");

  if (!grid) {
    return;
  }

  if (title && sectionConfig?.title) {
    title.textContent = sectionConfig.title;
  }

  if (subtitle && sectionConfig?.subtitle) {
    subtitle.textContent = sectionConfig.subtitle;
  }

  grid.innerHTML = "";
  if (dots) {
    dots.innerHTML = "";
  }

  if (!photos || photos.length === 0) {
    for (let index = 0; index < 6; index += 1) {
      const placeholder = document.createElement("article");
      placeholder.className = "client-work-card client-work-placeholder";
      placeholder.innerHTML = `
        <div>
          <div class="client-work-placeholder-icon">📸</div>
          <h3>Espacio para foto real</h3>
          <p>${sectionConfig?.emptyMessage ?? "Aqui podras cargar fotos reales del servicio mas adelante."}</p>
        </div>
      `;
      grid.appendChild(placeholder);
    }
  } else {
    photos.forEach((photo) => {
      const card = document.createElement("article");
      card.className = "client-work-card";
      card.innerHTML = `
        <img src="${photo.image}" alt="${photo.title}" loading="lazy" />
        <div class="client-work-card-body">
          <h3>${photo.title}</h3>
          <p>${photo.caption ?? ""}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  const slides = Array.from(grid.children);
  if (!slides.length) {
    return;
  }

  let currentIndex = 0;
  let intervalId = null;

  function getVisibleCount() {
    if (window.innerWidth <= 640) {
      return 1;
    }
    if (window.innerWidth <= 1100) {
      return 2;
    }
    return 2;
  }

  function getMaxIndex() {
    return Math.max(slides.length - getVisibleCount(), 0);
  }

  function renderDots() {
    if (!dots) {
      return;
    }

    dots.innerHTML = "";
    const totalDots = getMaxIndex() + 1;

    for (let index = 0; index < totalDots; index += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `client-work-dot${index === currentIndex ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Ir al trabajo ${index + 1}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
        startAutoAdvance();
      });
      dots.appendChild(dot);
    }
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);

    const firstSlide = slides[0];
    const slideStyles = window.getComputedStyle(grid);
    const gap = Number.parseFloat(slideStyles.columnGap || slideStyles.gap || "0");
    const offset = (firstSlide.offsetWidth + gap) * currentIndex;
    grid.style.transform = `translateX(-${offset}px)`;
    renderDots();
  }

  function startAutoAdvance() {
    if (intervalId) {
      window.clearInterval(intervalId);
    }

    if (getMaxIndex() <= 0) {
      return;
    }

    intervalId = window.setInterval(() => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateCarousel();
    }, 2800);
  }

  window.addEventListener("resize", () => {
    updateCarousel();
    startAutoAdvance();
  });

  updateCarousel();
  startAutoAdvance();
}

async function loadSiteContent() {
  try {
    const response = await fetch("/api/site");
    if (!response.ok) {
      throw new Error("No se pudo cargar /api/site");
    }

    const data = await response.json();
    const whatsappUrl = createWhatsAppUrl(data.whatsappNumber, data.whatsappMessage);

    document.title = data.businessName.toUpperCase();
    document.getElementById("hero-title").textContent = data.heroTitle;
    document.getElementById("hero-subtitle").textContent = data.heroSubtitle;
    document.getElementById("contact-phone").textContent = data.whatsappNumber;
    document.getElementById("contact-domain").textContent = data.domain;
    document.getElementById("footer-domain").textContent = data.domain;
    document.getElementById("footer-whatsapp").textContent = data.whatsappNumber;

    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.setAttribute("href", whatsappUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    });

    renderServices(data.services);
    renderServiceGallery(data.serviceGallery ?? []);
    renderClientWork(data.clientWorkSection, data.clientWorkPhotos ?? []);
    renderCoverage(data.coverageCities);
  } catch (error) {
    console.error(error);
  }
}

loadSiteContent();
