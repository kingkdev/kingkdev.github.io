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

const serviceButtons = Array.from(document.querySelectorAll("[data-service]"));
const serviceCards = Array.from(document.querySelectorAll("[data-service-card]"));
const serviceTypeInput = document.getElementById("service-type");
const serviceDetailsInput = document.getElementById("service-details");
const serviceNameInput = document.getElementById("service-name");
const serviceEmailInput = document.getElementById("service-email");
const serviceForm = document.querySelector(".service-form");
const formNote = document.getElementById("form-note");

const hero = document.querySelector(".hero-section");
const heroTitle = document.getElementById("hero-title");
const heroKicker = document.getElementById("hero-kicker");
const heroBodyPrimary = document.getElementById("hero-body-primary");
const heroBodySecondary = document.getElementById("hero-body-secondary");
const heroPrimaryAction = document.getElementById("hero-primary-action");
const heroSecondaryAction = document.getElementById("hero-secondary-action");
const heroStatePill = document.getElementById("hero-state-pill");
const heroMetadata = document.getElementById("hero-metadata");
const heroAsideTitle = document.getElementById("hero-aside-title");
const heroAsideCopy = document.getElementById("hero-aside-copy");
const heroAsidePoints = document.getElementById("hero-aside-points");

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

/* =========================================
   Behavior-Driven Adaptive Interface Hero
========================================= */

const heroStates = {
  active: {
    pill: "Active",
    mode: "default",
    kicker: "Behavior-Driven Adaptive Interface / premium digital direction",
    title: [
      "Adaptive",
      "Interface",
      { accent: "Behavior", tail: "First" },
    ],
    primary: "I design landing pages, portfolios, and visual systems that respond with intention. The experience shifts with behavior, guiding attention, reinforcing confidence, and making each first impression feel more intelligent.",
    secondary: "This hero watches for signals like movement, scroll, hesitation, and intent, then changes tone, emphasis, and energy in real time. <span>Design should not only look premium. It should behave like it knows the user is there.</span>",
    actionLabel: "View Projects",
    actionHref: "#project",
    secondaryLabel: "Explore Services",
    secondaryHref: "#services",
    metadata: ["Adaptive UX", "Portfolio Design", "Behavior Signals"],
    asideTitle: "The system is in active presentation mode.",
    asideCopy:
      "When engagement is high, the hero presents the strongest message first. When curiosity, hesitation, or browsing intent appears, the experience shifts its tone, emphasis, and call-to-action without breaking visual consistency.",
    asidePoints: [
      "Attention-aware presentation",
      "Intent-responsive messaging",
      "Luxury tone with interaction logic",
    ],
  },
  idle: {
    pill: "Idle",
    mode: "default",
    kicker: "Adaptive quiet mode / hesitation-aware presentation",
    title: [
      "Still",
      "Exploring",
      { accent: "Start", tail: "Here" },
    ],
    primary: "When attention pauses, the interface softens its tone and reduces visual pressure. The goal is to keep the experience calm, readable, and inviting instead of pushing too hard.",
    secondary: "A behavior-driven interface should know when to slow down. <span>Less friction can be more persuasive than more noise.</span>",
    actionLabel: "See How I Work",
    actionHref: "#about",
    secondaryLabel: "Browse Services",
    secondaryHref: "#services",
    metadata: ["Calm UI", "Low-pressure CTA", "Hesitation-aware"],
    asideTitle: "The system detected reduced engagement.",
    asideCopy:
      "This state lowers the intensity of the presentation while preserving hierarchy. It keeps the message clear for users who are reading, hesitating, or deciding what to do next.",
    asidePoints: [
      "Softer visual energy",
      "Lower-pressure messaging",
      "Readability over urgency",
    ],
  },
  explore: {
    pill: "Explore",
    mode: "projects",
    kicker: "Scroll activity detected / exploration mode engaged",
    title: [
      "Mood,",
      "Structure,",
      { accent: "Direction", tail: "Live" },
    ],
    primary: "Scroll behavior suggests curiosity, so the interface shifts toward discovery. The messaging leans into range, atmosphere, and visual direction instead of only the introduction.",
    secondary: "This is where the hero stops acting like a static banner and starts acting like a guide. <span>Exploration should feel rewarded immediately.</span>",
    actionLabel: "Open Projects",
    actionHref: "#project",
    secondaryLabel: "See Services",
    secondaryHref: "#services",
    metadata: ["Scroll Signals", "Project Discovery", "Adaptive Messaging"],
    asideTitle: "The system is prioritizing discovery.",
    asideCopy:
      "Once browsing intent appears, the interface brings project exploration and visual evidence closer to the surface. The copy becomes more directional and less introductory.",
    asidePoints: [
      "Exploration-first hierarchy",
      "Project-forward framing",
      "Responsive conversion path",
    ],
  },
  intent: {
    pill: "Intent",
    mode: "contact",
    kicker: "High-intent interaction / conversion emphasis increased",
    title: [
      "Ready",
      "To Build",
      { accent: "Something", tail: "Sharp" },
    ],
    primary: "When the user moves toward action, the interface sharpens the offer. Stronger emphasis, clearer direction, and brighter conversion cues make the next step feel immediate and intentional.",
    secondary: "This state is designed for commitment. <span>The interface should meet interest with confidence.</span>",
    actionLabel: "Start a Project",
    actionHref: "#contact",
    secondaryLabel: "Review Services",
    secondaryHref: "#services",
    metadata: ["Intent Detected", "Conversion Focus", "High-Trust CTA"],
    asideTitle: "The system is responding to commitment signals.",
    asideCopy:
      "CTA hover, focused attention, and directional movement suggest the user may be ready to act. The interface responds by clarifying the offer and increasing conversion emphasis.",
    asidePoints: [
      "Confidence-forward messaging",
      "Focused CTA treatment",
      "Action-ready state",
    ],
  },
  services: {
    pill: "Service Focus",
    mode: "services",
    kicker: "Service interest detected / offer alignment in progress",
    title: [
      "Design",
      "Support",
      { accent: "Matched", tail: "To Need" },
    ],
    primary: "Interest around services shifts the hero toward practical value. The copy becomes more specific, helping the user connect the right offer to the stage of their project.",
    secondary: "The interface should respond when someone starts evaluating fit. <span>Clarity becomes the premium experience.</span>",
    actionLabel: "Choose a Service",
    actionHref: "#services",
    secondaryLabel: "Start Inquiry",
    secondaryHref: "#contact",
    metadata: ["Offer Clarity", "Service Match", "Practical UX"],
    asideTitle: "The system is aligning to service evaluation.",
    asideCopy:
      "This mode supports users comparing options, thinking about project scope, or deciding what kind of design help they need most.",
    asidePoints: [
      "Offer-specific framing",
      "Decision-support messaging",
      "Reduced ambiguity",
    ],
  },
};

let heroCurrentState = "active";
let lastPointerMoveTime = Date.now();
let idleActivated = false;
let heroIntentTimeoutId = null;
let heroExploreTimeoutId = null;
let lastKnownMode = "active";
let pointerTrackingEnabled = window.matchMedia("(min-width: 981px)").matches;

function buildHeroTitle(titleParts) {
  const [lineOne, lineTwo, accentPart] = titleParts;
  return `
    <span>${lineOne}</span>
    <span>${lineTwo}</span>
    <span class="hero-title-accent">${accentPart.accent}<span class="hero-title-tail">${accentPart.tail}</span></span>
  `;
}

function buildMetadata(items) {
  return items.map((item) => `<span>${item}</span>`).join("");
}

function buildAsidePoints(items) {
  return items.map((item) => `<span>${item}</span>`).join("");
}

function applyHeroState(stateKey) {
  const state = heroStates[stateKey];
  if (!hero || !state) {
    return;
  }

  hero.dataset.state = stateKey;
  hero.dataset.mode = state.mode;
  heroCurrentState = stateKey;

  if (heroStatePill) {
    heroStatePill.textContent = state.pill;
  }

  if (heroKicker) {
    heroKicker.textContent = state.kicker;
  }

  if (heroTitle) {
    heroTitle.innerHTML = buildHeroTitle(state.title);
  }

  if (heroBodyPrimary) {
    heroBodyPrimary.textContent = state.primary;
  }

  if (heroBodySecondary) {
    heroBodySecondary.innerHTML = state.secondary;
  }

  if (heroPrimaryAction) {
    heroPrimaryAction.setAttribute("href", state.actionHref);
    heroPrimaryAction.innerHTML = `${state.actionLabel}<span aria-hidden="true"></span>`;
  }

  if (heroSecondaryAction) {
    heroSecondaryAction.textContent = state.secondaryLabel;
    heroSecondaryAction.setAttribute("href", state.secondaryHref);
  }

  if (heroMetadata) {
    heroMetadata.innerHTML = buildMetadata(state.metadata);
  }

  if (heroAsideTitle) {
    heroAsideTitle.textContent = state.asideTitle;
  }

  if (heroAsideCopy) {
    heroAsideCopy.textContent = state.asideCopy;
  }

  if (heroAsidePoints) {
    heroAsidePoints.innerHTML = buildAsidePoints(state.asidePoints);
  }
}

function setHeroState(stateKey, options = {}) {
  const { persistMode = false } = options;
  applyHeroState(stateKey);

  if (persistMode) {
    lastKnownMode = stateKey;
  }
}

function resetHeroToLastKnownMode() {
  if (idleActivated) {
    setHeroState("idle");
    return;
  }

  setHeroState(lastKnownMode || "active");
}

function updateHeroFromScroll() {
  const scrollY = window.scrollY;
  const servicesSection = document.getElementById("services");
  const projectSection = document.getElementById("project");
  const contactSection = document.getElementById("contact");

  const servicesTop = servicesSection?.getBoundingClientRect().top ?? Infinity;
  const projectTop = projectSection?.getBoundingClientRect().top ?? Infinity;
  const contactTop = contactSection?.getBoundingClientRect().top ?? Infinity;

  if (contactTop < window.innerHeight * 0.6) {
    lastKnownMode = "intent";
    if (!idleActivated && heroCurrentState !== "intent") {
      setHeroState("intent");
    }
    return;
  }

  if (servicesTop < window.innerHeight * 0.7 && servicesTop > -window.innerHeight * 0.4) {
    lastKnownMode = "services";
    if (!idleActivated && heroCurrentState !== "services") {
      setHeroState("services");
    }
    return;
  }

  if (scrollY > 120 || projectTop < window.innerHeight * 0.72) {
    lastKnownMode = "explore";
    if (!idleActivated && heroCurrentState !== "explore") {
      setHeroState("explore");
    }

    window.clearTimeout(heroExploreTimeoutId);
    heroExploreTimeoutId = window.setTimeout(() => {
      if (!idleActivated && lastKnownMode === "explore") {
        setHeroState("explore");
      }
    }, 200);

    return;
  }

  lastKnownMode = "active";
  if (!idleActivated && heroCurrentState !== "active") {
    setHeroState("active");
  }
}

function updateHeroPointerMotion(event) {
  if (!hero || !pointerTrackingEnabled) {
    return;
  }

  const rect = hero.getBoundingClientRect();
  const withinHero =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!withinHero) {
    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
    hero.style.setProperty("--hero-tilt-x", "0deg");
    hero.style.setProperty("--hero-tilt-y", "0deg");
    hero.style.setProperty("--hero-scale", "1");
    return;
  }

  const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
  const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

  const shiftX = `${xRatio * 10}px`;
  const shiftY = `${yRatio * 10}px`;
  const tiltX = `${yRatio * -3}deg`;
  const tiltY = `${xRatio * 4}deg`;
  const scale = "1.003";

  hero.style.setProperty("--hero-shift-x", shiftX);
  hero.style.setProperty("--hero-shift-y", shiftY);
  hero.style.setProperty("--hero-tilt-x", tiltX);
  hero.style.setProperty("--hero-tilt-y", tiltY);
  hero.style.setProperty("--hero-scale", scale);
}

function markUserActive() {
  lastPointerMoveTime = Date.now();

  if (idleActivated) {
    idleActivated = false;
    resetHeroToLastKnownMode();
  }
}

document.addEventListener("mousemove", (event) => {
  markUserActive();
  updateHeroPointerMotion(event);
});

document.addEventListener("pointerdown", () => {
  markUserActive();
});

document.addEventListener("keydown", () => {
  markUserActive();
});

document.addEventListener("scroll", () => {
  markUserActive();
  updateHeroFromScroll();
}, { passive: true });

window.addEventListener("resize", () => {
  pointerTrackingEnabled = window.matchMedia("(min-width: 981px)").matches;

  if (!pointerTrackingEnabled && hero) {
    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
    hero.style.setProperty("--hero-tilt-x", "0deg");
    hero.style.setProperty("--hero-tilt-y", "0deg");
    hero.style.setProperty("--hero-scale", "1");
  }

  updateHeroFromScroll();
});

heroPrimaryAction?.addEventListener("mouseenter", () => {
  idleActivated = false;
  lastKnownMode = "intent";
  setHeroState("intent");
});

heroPrimaryAction?.addEventListener("focus", () => {
  idleActivated = false;
  lastKnownMode = "intent";
  setHeroState("intent");
});

heroPrimaryAction?.addEventListener("mouseleave", () => {
  window.clearTimeout(heroIntentTimeoutId);
  heroIntentTimeoutId = window.setTimeout(() => {
    resetHeroToLastKnownMode();
  }, 180);
});

heroPrimaryAction?.addEventListener("blur", () => {
  window.clearTimeout(heroIntentTimeoutId);
  heroIntentTimeoutId = window.setTimeout(() => {
    resetHeroToLastKnownMode();
  }, 180);
});

heroSecondaryAction?.addEventListener("mouseenter", () => {
  idleActivated = false;
  lastKnownMode = "services";
  setHeroState("services");
});

heroSecondaryAction?.addEventListener("focus", () => {
  idleActivated = false;
  lastKnownMode = "services";
  setHeroState("services");
});

heroSecondaryAction?.addEventListener("mouseleave", () => {
  window.clearTimeout(heroIntentTimeoutId);
  heroIntentTimeoutId = window.setTimeout(() => {
    resetHeroToLastKnownMode();
  }, 180);
});

heroSecondaryAction?.addEventListener("blur", () => {
  window.clearTimeout(heroIntentTimeoutId);
  heroIntentTimeoutId = window.setTimeout(() => {
    resetHeroToLastKnownMode();
  }, 180);
});

const idleInterval = window.setInterval(() => {
  const idleTime = Date.now() - lastPointerMoveTime;

  if (idleTime > 4500 && !idleActivated) {
    idleActivated = true;
    setHeroState("idle");
  }
}, 900);

updateHeroFromScroll();
applyHeroState("active");