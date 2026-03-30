const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("primary-menu");
const menuOverlay = document.querySelector(".menu-overlay");
const menuClose = document.querySelector(".menu-close");
const projectPreviewButtons = Array.from(document.querySelectorAll("[data-project-preview]"));
const projectLightbox = document.querySelector(".project-lightbox");
const projectLightboxImage = document.querySelector(".project-lightbox-image");
const projectLightboxBackdrop = document.querySelector(".project-lightbox-backdrop");
const projectLightboxClose = document.querySelector(".project-lightbox-close");
const sectionIds = navLinks
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => href.slice(1));

const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setMenuOpen(isOpen) {
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
}

function setProjectLightboxOpen(isOpen, src = "", alt = "") {
  document.body.classList.toggle("project-lightbox-open", isOpen);
  projectLightbox?.setAttribute("aria-hidden", String(!isOpen));

  if (projectLightboxImage && isOpen) {
    projectLightboxImage.src = src;
    projectLightboxImage.alt = alt;
  }

  if (projectLightboxImage && !isOpen) {
    projectLightboxImage.src = "";
    projectLightboxImage.alt = "";
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.slice(1);
    if (targetId) {
      setActiveLink(targetId);
    }

    setMenuOpen(false);
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

menuOverlay?.addEventListener("click", () => {
  setMenuOpen(false);
});

menuClose?.addEventListener("click", () => {
  setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
    setProjectLightboxOpen(false);
  }
});

projectPreviewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const src = button.dataset.projectPreview;
    const alt = button.dataset.projectAlt ?? "";

    if (!src) {
      return;
    }

    setProjectLightboxOpen(true, src, alt);
  });
});

projectLightboxBackdrop?.addEventListener("click", () => {
  setProjectLightboxOpen(false);
});

projectLightboxClose?.addEventListener("click", () => {
  setProjectLightboxOpen(false);
});

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visibleEntries.length > 0) {
      setActiveLink(visibleEntries[0].target.id);
    }
  },
  {
    rootMargin: "-18% 0px -62% 0px",
    threshold: [0.1, 0.2, 0.35, 0.5],
  }
);

sections.forEach((section) => observer.observe(section));

if (sections.length > 0) {
  setActiveLink(sections[0].id);
}

const serviceButtons = Array.from(document.querySelectorAll("[data-service]"));
const serviceCards = Array.from(document.querySelectorAll("[data-service-card]"));
const serviceTypeInput = document.getElementById("service-type");
const serviceDetailsInput = document.getElementById("service-details");
const serviceNameInput = document.getElementById("service-name");
const serviceEmailInput = document.getElementById("service-email");
const serviceForm = document.querySelector(".service-form");
const formNote = document.getElementById("form-note");

function setSelectedService(serviceName) {
  if (!serviceTypeInput) {
    return;
  }

  serviceTypeInput.value = serviceName;

  serviceCards.forEach((card) => {
    const button = card.querySelector("[data-service]");
    const isSelected = button?.dataset.service === serviceName;
    card.classList.toggle("is-selected", Boolean(isSelected));
  });

  if (formNote) {
    formNote.textContent = `${serviceName} selected. Complete the form below to prepare the inquiry message.`;
  }
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { service } = button.dataset;
    if (!service) {
      return;
    }

    setSelectedService(service);
    serviceTypeInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    serviceTypeInput?.focus();
  });
});

serviceTypeInput?.addEventListener("change", () => {
  setSelectedService(serviceTypeInput.value);
});

serviceForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = serviceNameInput?.value.trim() ?? "";
  const email = serviceEmailInput?.value.trim() ?? "";
  const service = serviceTypeInput?.value.trim() ?? "";
  const details = serviceDetailsInput?.value.trim() ?? "";

  if (!name || !email || !service || !details) {
    if (formNote) {
      formNote.textContent = "Complete all fields before sending the inquiry.";
    }
    return;
  }

  const subject = encodeURIComponent(`${service} Inquiry from ${name}`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${service}`,
      "",
      "Project details:",
      details,
    ].join("\n")
  );

  window.location.href = `mailto:hello@seandowell.design?subject=${subject}&body=${body}`;

  if (formNote) {
    formNote.textContent = "Your email app should now open with the inquiry drafted.";
  }
});
