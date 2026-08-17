/* ============================================
   ShalomDigital — main.js
   Navbar, scroll reveal, counters, filters,
   pricing toggle, FAQ, contact form
   ============================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Navbar ---------- */
  var navbar = document.querySelector(".navbar");
  var topbar = document.querySelector(".topbar");
  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");

  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (navbar) navbar.classList.toggle("scrolled", scrolled);
    if (topbar) topbar.classList.toggle("hide", scrolled);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (hamburger && navLinks) {
    function closeMenu() {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    hamburger.addEventListener("click", function () {
      var isOpen = navLinks.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add("open");
        navLinks.classList.add("open");
        hamburger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Active nav link ---------- */
  var pathSeg = window.location.pathname.replace(/\/+$/, "").split("/");
  var current = pathSeg.pop().replace(/\.html$/, "") || "";
  if (current === "ShalomDigital") current = "";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/\.html$/, "").replace(/\/$/, "");
    if (href === "./") href = "";
    if (href === current) link.classList.add("active");
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-decimals") || "0");
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Portfolio filters ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var caseCards = document.querySelectorAll(".case-card");
  var filterEmpty = document.getElementById("filter-empty");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      var visible = 0;
      caseCards.forEach(function (card) {
        var cat = card.getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        card.style.display = show ? "" : "none";
        if (show) {
          visible++;
          card.classList.remove("reveal");
          card.classList.add("reveal", "visible");
        }
      });
      if (filterEmpty) filterEmpty.style.display = visible === 0 ? "" : "none";
    });
  });

  /* ---------- Pricing toggle ---------- */
  var toggle = document.querySelector(".pricing-toggle .toggle");
  var prices = document.querySelectorAll("[data-monthly]");
  if (toggle && prices.length) {
    toggle.addEventListener("click", function () {
      var annual = toggle.classList.toggle("active");
      prices.forEach(function (el) {
        el.textContent = annual ? el.getAttribute("data-annual") : el.getAttribute("data-monthly");
      });
      var notes = document.querySelectorAll("[data-note]");
      notes.forEach(function (n) {
        n.textContent = annual ? n.getAttribute("data-note-annual") : n.getAttribute("data-note");
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqQs = document.querySelectorAll(".faq-q");
  faqQs.forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.parentElement;
      var answer = item.querySelector(".faq-a");
      var isOpen = item.classList.contains("open");
      faqQs.forEach(function (otherQ) {
        var otherItem = otherQ.parentElement;
        otherItem.classList.remove("open");
        otherItem.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value !== "") { e.preventDefault(); return; }
      var valid = true;
      form.querySelectorAll("[data-error]").forEach(function (input) {
        var err = document.getElementById(input.getAttribute("data-error"));
        var value = input.value.trim();
        var ok = value.length > 0;
        if (input.type === "email" && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (input.id === "service" && value === "") ok = false;
        if (!ok) {
          input.style.borderColor = "#dc2626";
          err.classList.add("show");
          valid = false;
        } else {
          input.style.borderColor = "";
          err.classList.remove("show");
        }
      });
      if (!valid) e.preventDefault();
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.style.borderColor = "";
        var err = document.getElementById(input.getAttribute("data-error"));
        if (err) err.classList.remove("show");
      });
    });
  }

  /* ---------- Hero card tilt ---------- */
  var heroCard = document.getElementById("hero-card");
  var finePointer = window.matchMedia("(hover: hover)").matches;
  var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroCard && finePointer && !noMotion) {
    var tiltRect = null;
    heroCard.addEventListener("mouseenter", function () {
      tiltRect = heroCard.getBoundingClientRect();
    });
    heroCard.addEventListener("mousemove", function (e) {
      if (!tiltRect) tiltRect = heroCard.getBoundingClientRect();
      var x = (e.clientX - tiltRect.left) / tiltRect.width - 0.5;
      var y = (e.clientY - tiltRect.top) / tiltRect.height - 0.5;
      heroCard.style.transform =
        "perspective(900px) rotateY(" + x * 7 + "deg) rotateX(" + -y * 7 + "deg) translateY(-4px)";
    });
    heroCard.addEventListener("mouseleave", function () {
      tiltRect = null;
      heroCard.style.transform = "";
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Floating WhatsApp button ---------- */
  var waBtn = document.createElement("a");
  waBtn.className = "whatsapp-float";
  waBtn.href = "https://wa.me/916360406946?text=Hi%20ShalomDigital!%20I%27d%20like%20to%20know%20more%20about%20your%20services.";
  waBtn.target = "_blank";
  waBtn.rel = "noopener";
  waBtn.setAttribute("aria-label", "Chat with us on WhatsApp");
  waBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z"/>' +
    "</svg>";
  document.body.appendChild(waBtn);
})();
