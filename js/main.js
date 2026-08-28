/* The Pink Shaker · concept build
   Vanilla JS only: nav state, mobile menu, ticker loop, reveal-on-scroll,
   gallery lightbox, and the demo inquiry form (client-side only, nothing
   is sent anywhere). */

(function () {
  "use strict";

  /* ---------- footer year ---------- */

  document.getElementById("year").textContent = String(new Date().getFullYear());

  /* ---------- nav: scrolled state ---------- */

  var nav = document.getElementById("siteNav");

  function onScroll() {
    if (window.scrollY > 24) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- nav: mobile toggle ---------- */

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- ticker: duplicate for seamless loop ---------- */

  var track = document.getElementById("tickerTrack");
  track.innerHTML += track.innerHTML;

  /* ---------- reveal on scroll ---------- */

  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- gallery lightbox ---------- */

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(img, caption) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      openLightbox(img, item.getAttribute("data-caption") || "");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---------- demo inquiry form ---------- */

  var form = document.getElementById("bookForm");
  var success = document.getElementById("bookSuccess");
  var resetBtn = document.getElementById("resetForm");
  var required = form.querySelectorAll("[required]");

  function labelFor(el) {
    var label = form.querySelector('label[for="' + el.id + '"]');
    return label ? label.textContent.toLowerCase() : "this field";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstInvalid = null;
    required.forEach(function (el) {
      var filled = el.value.trim() !== "";
      el.classList.toggle("invalid", !filled);
      if (!filled && !firstInvalid) firstInvalid = el;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var name = document.getElementById("f-name").value.trim().split(" ")[0];
    var type = document.getElementById("f-type").value;
    var date = document.getElementById("f-date").value;
    var pretty = "";
    if (date) {
      var d = new Date(date + "T12:00:00");
      pretty = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    var line = "Thanks, " + name + "! ";
    if (type && pretty) {
      line += "A " + type.toLowerCase() + " on " + pretty + " sounds like our kind of party. ";
    }
    document.getElementById("successBody").textContent =
      line + "This preview site doesn't deliver messages yet, but the finished site would land your details straight with Aubrí.";

    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    required.forEach(function (el) { el.classList.remove("invalid"); });
    success.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  required.forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); });
    el.addEventListener("change", function () { el.classList.remove("invalid"); });
  });
})();
