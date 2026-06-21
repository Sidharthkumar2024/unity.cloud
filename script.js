const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const revealItems = document.querySelectorAll(".reveal");
const currentTime = document.querySelector("[data-current-time]");
const scoreTabs = document.querySelectorAll("[data-score-tab]");
const scoreRows = document.querySelectorAll("[data-score-row]");
const scoreNote = document.querySelector("[data-score-note]");
const liveMetrics = document.querySelectorAll("[data-live-metric]");
const activityBars = document.querySelectorAll("[data-activity-bar]");

const scoreData = {
  quality: {
    note: "Production quality view across output normalization and fallback routing.",
    rows: [
      ["Unified output", 95],
      ["Policy matches", 91],
      ["Fallback recovery", 88],
      ["Cost routing", 84],
    ],
  },
  speed: {
    note: "Speed view for request routing, provider selection, and response delivery.",
    rows: [
      ["Fastest route", 98],
      ["Median latency", 94],
      ["Queue recovery", 90],
      ["Cache hit speed", 87],
    ],
  },
  accuracy: {
    note: "Accuracy view for matched outputs, safety policy checks, and model fit.",
    rows: [
      ["Answer match rate", 96],
      ["Tool call precision", 92],
      ["Context retention", 89],
      ["Model fit score", 86],
    ],
  },
};

const setHeaderState = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuButton && mobileMenu && header) {
  menuButton.addEventListener("click", () => {
    const nextState = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(nextState));
    mobileMenu.classList.toggle("is-open", nextState);
    header.classList.toggle("menu-visible", nextState);
    document.body.classList.toggle("menu-open", nextState);
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      header.classList.remove("menu-visible");
      document.body.classList.remove("menu-open");
    }
  });
}

if (scoreTabs.length && scoreRows.length) {
  const renderScores = (view) => {
    const selected = scoreData[view] || scoreData.quality;

    scoreTabs.forEach((tab) => {
      const isActive = tab.dataset.scoreTab === view;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    scoreRows.forEach((row, index) => {
      const rowData = selected.rows[index];
      if (!rowData) return;

      const [label, value] = rowData;
      row.querySelector("[data-score-label]").textContent = label;
      row.querySelector("[data-score-value]").textContent = value;
      row.querySelector("[data-score-bar]").style.setProperty("--bar", `${value}%`);
    });

    if (scoreNote) {
      scoreNote.textContent = selected.note;
    }
  };

  scoreTabs.forEach((tab) => {
    tab.addEventListener("click", () => renderScores(tab.dataset.scoreTab));
  });
}

if (liveMetrics.length) {
  const numberFormatter = new Intl.NumberFormat("en-IN");
  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const metricState = {
    uptime: 99.97,
    providers: 3,
    models: 5,
    totalRequests: randomBetween(1420, 2600),
    todayRequests: randomBetween(80, 180),
    allTimeRequests: randomBetween(1420, 2600),
    inputTokens: randomBetween(42000, 96000),
    outputTokens: randomBetween(16000, 52000),
  };

  metricState.allTimeRequests = metricState.totalRequests;

  const formatMetric = (key, value) => {
    if (key === "uptime") return `${value.toFixed(2)}%`;
    return numberFormatter.format(value);
  };

  const renderLiveStatus = () => {
    const requestDelta = randomBetween(2, 18);
    metricState.uptime = 99.95 + Math.random() * 0.04;
    metricState.providers = randomBetween(3, 4);
    metricState.models = randomBetween(5, 8);
    metricState.todayRequests += requestDelta;
    metricState.totalRequests += requestDelta + randomBetween(0, 9);
    metricState.allTimeRequests = metricState.totalRequests;
    metricState.inputTokens += randomBetween(1200, 6200);
    metricState.outputTokens += randomBetween(500, 2900);

    liveMetrics.forEach((metric) => {
      const key = metric.dataset.liveMetric;
      if (!(key in metricState)) return;
      metric.textContent = formatMetric(key, metricState[key]);
    });

    activityBars.forEach((bar) => {
      bar.style.setProperty("--height", `${randomBetween(62, 99)}%`);
    });
  };

  renderLiveStatus();
  window.setInterval(renderLiveStatus, 5000);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (currentTime) {
  const updateStatusTime = () => {
    const formatted = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
    currentTime.textContent = `Last updated: ${formatted}`;
  };

  updateStatusTime();
  window.setInterval(updateStatusTime, 1000);
}
