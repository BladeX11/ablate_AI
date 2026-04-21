(function () {
  // Restoration: Using relative paths (./) to ensure navigation works perfectly 
  // under both the Next.js dev server AND direct file opening.
  var routeMap = {
    "Overview": "./overview_dashboard.html",
    "Unlearning Jobs": "./unlearning_jobs.html",
    "Models": "./model_management.html",
    "Vector DB": "./vector_database_rag.html",
    "Risk Monitor": "./risk_leakage_monitor.html",
    "Reports": "./reports_certificates.html",
    "Settings": "#",
    "New Job": "./new_unlearning_request.html",
    "New Unlearning Job": "./new_unlearning_request.html",
    "Home": "./overview_dashboard.html",
    "Logout": "./ablate_ai_landing_page.html"
  };

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function matchesLabel(text, label) {
    if (!text) return false;
    if (text === label) return true;
    if (text.toUpperCase() === label.toUpperCase()) return true;
    return text.endsWith(" " + label);
  }

  function bindRoute(el, route) {
    if (!el || !route || el.dataset.stitchNavBound === "1") return;

    if (el.tagName === "A") {
      el.setAttribute("href", route);
      el.dataset.stitchNavBound = "1";
      return;
    }

    el.style.cursor = "pointer";
    el.setAttribute("role", "link");
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "0");
    }

    el.addEventListener("click", function () {
        if (route === "#") {
            alert("This feature is currently being integrated into the MLOps pipeline.");
            return;
        }
      window.location.href = route;
    });

    el.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = route;
      }
    });

    el.dataset.stitchNavBound = "1";
  }

  function wireNavigation() {
    var elements = document.querySelectorAll("a, button, div, span, h1");

    elements.forEach(function (el) {
      if (!el.closest("nav, footer, header, aside")) return;

      var text = normalize(el.textContent);

      Object.keys(routeMap).forEach(function (label) {
        if (matchesLabel(text, label)) {
          bindRoute(el, routeMap[label]);
        }
      });
      
      // Special case for Logo
      if (text.includes("Ablate Enterprise") && el.tagName === "H1") {
          bindRoute(el, routeMap["Home"]);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireNavigation);
  } else {
    wireNavigation();
  }
})();
