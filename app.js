"use strict";
(() => {
  document.documentElement.classList.add("enhanced");
  const sectionLinks = [...document.querySelectorAll(".nav-sections a")];
  if ("IntersectionObserver" in window) {
    const visibleSections = new Set();
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.add(entry.target.id);
        else visibleSections.delete(entry.target.id);
      });
      const active = sectionLinks.find(link => visibleSections.has(link.hash.slice(1)));
      sectionLinks.forEach(link => {
        if (link === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -40% 0px", threshold: 0 });
    document.querySelectorAll("main > section[id]").forEach(section => sectionObserver.observe(section));
  }
  const videos = [...document.querySelectorAll("video:not([data-background-video])")];
  document.addEventListener('gamepilot:focus-demo', event => {
    if (['section-navigation', 'revision', 'walkthrough'].includes(event.detail)) {
      videos.forEach(video => video.pause());
    }
  });
  videos.forEach(video => video.addEventListener("contextmenu", event => event.preventDefault()));
  const copyCitation = document.getElementById("copy-citation");
  const citation = document.getElementById("citation-bibtex");
  const citationStatus = document.getElementById("citation-status");
  copyCitation.addEventListener("click", async () => {
    copyCitation.disabled = true;
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      citationStatus.textContent = "Citation copied to clipboard.";
    } catch {
      citationStatus.textContent = "Copy unavailable. Select the BibTeX text and copy it manually.";
      citation.focus();
    } finally {
      copyCitation.disabled = false;
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      videos.forEach(video => video.pause());
    }
  });

  const methodDialog = document.getElementById("method-dialog");
  const imageDialog = document.getElementById("demo-image-dialog");
  document.querySelectorAll("[data-demo-image]").forEach(button => {
    button.addEventListener("click", () => {
      videos.forEach(video => video.pause());
      const expanded = document.getElementById("demo-image-expanded");
      expanded.src = button.dataset.demoImage;
      expanded.alt = button.querySelector("img").alt;
      document.getElementById("demo-image-dialog-title").textContent = button.dataset.demoTitle;
      imageDialog.showModal();
    });
  });
  document.getElementById("close-demo-image").addEventListener("click", () => imageDialog.close());
  imageDialog.addEventListener("click", event => {
    if (event.target === imageDialog) {
      const rect = imageDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
    }
  });
  document.getElementById("expand-method").addEventListener("click", () => {
    videos.forEach(video => video.pause());
    methodDialog.showModal();
  });
  document.getElementById("close-method").addEventListener("click", () => methodDialog.close());
  methodDialog.addEventListener("click", event => {
    if (event.target === methodDialog) {
      const rect = methodDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) methodDialog.close();
    }
  });

  const tabs = [...document.querySelectorAll("[data-result]")];
  const takeaways = {
    main: "GamePilot reaches 1.85–2.00× the progress of GV-Expert, the strongest baseline in these campaigns.",
    scope: "Revising the full harness yields 10.6–11.4 percentage points more progress than revising game knowledge alone.",
    ablation: "All five ablations reduce progress in every game. Freezing observation processing produces the largest drop in the mean across games."
  };
  function selectResult(tab) {
    const key = tab.dataset.result;
    const result = window.RESULTS[key];
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    const table = document.getElementById("results-table");
    table.querySelector("thead th").textContent = result.label;
    const body = document.createElement("tbody");
    result.rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      if (index === result.best) tr.className = "best";
      row.forEach((value, column) => {
        const cell = document.createElement(column === 0 ? "th" : "td");
        if (column === 0) cell.scope = "row";
        cell.textContent = typeof value === "number" ? value.toFixed(1) : value;
        tr.append(cell);
      });
      body.append(tr);
    });
    table.querySelector("tbody").replaceWith(body);
    document.getElementById("result-note").textContent = result.note;
    document.getElementById("result-takeaway").textContent = takeaways[key];
    document.getElementById("results-panel").setAttribute("aria-labelledby", tab.id);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectResult(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
        selectResult(tabs[next]);
      }
    });
  });
})();
