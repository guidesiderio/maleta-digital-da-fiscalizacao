const COLORS = ["c1", "c2", "c3", "c4", "c5"];
const NUM_HEX = ["#cc9a52", "#6d8e60", "#8078bc", "#cc6a48", "#4a9aac"];

/* ─── Toast Notifications (#3) ──────────────────────────────────────────── */
const toastContainer = document.createElement("div");
toastContainer.id = "toastContainer";
toastContainer.setAttribute("aria-live", "assertive");
document.body.appendChild(toastContainer);

function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--visible"));
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ─── PWA Install Prompt (#1) ───────────────────────────────────────────── */
let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const installBtn = document.getElementById("installBtn");
  if (installBtn) installBtn.style.display = "inline-flex";
});

function handleInstallClick() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then((choice) => {
    if (choice.outcome === "accepted") {
      showToast("App instalado com sucesso!");
    }
    deferredInstallPrompt = null;
    const installBtn = document.getElementById("installBtn");
    if (installBtn) installBtn.style.display = "none";
  });
}

/* ─── Accessibility announcer ────────────────────────────────────────────── */
function announce(msg) {
  const el = document.getElementById("a11yAnnouncer");
  if (el) { el.textContent = ""; requestAnimationFrame(() => { el.textContent = msg; }); }
}

/* ─── Search bar (created dynamically above folders) ─────────────────────── */
const searchWrap = document.createElement("div");
searchWrap.className = "search-wrap";
searchWrap.innerHTML = `<input type="text" id="searchInput" class="search-input" placeholder="Buscar documento..." aria-label="Buscar documento">`;
const base = document.getElementById("base");
base.insertBefore(searchWrap, base.firstChild);
const searchInput = document.getElementById("searchInput");

/* ─── Normalize for accent-insensitive search ────────────────────────────── */
function normalize(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/* ─── Render folders ─────────────────────────────────────────────────────── */
const row = document.getElementById("foldersRow");
folders.forEach((f, i) => {
  const div = document.createElement("div");
  const isEmpty = f.docs.length === 0;
  div.className = `folder ${COLORS[i]}${isEmpty ? " folder--empty" : ""}`;
  div.id = `folder-${i}`;
  div.setAttribute("role", "button");
  div.setAttribute("tabindex", "-1");
  div.setAttribute("aria-label", `Abrir pasta: ${f.name}`);
  const docCount = f.docs.length;
  const countLabel = isEmpty ? "em breve" : `${docCount} doc${docCount !== 1 ? "s" : ""}`;
  div.innerHTML = `
    <div class="f-paper2"></div>
    <div class="f-paper"></div>
    <div class="f-tab"></div>
    <div class="f-body">
      <div class="f-num">${i + 1}</div>
      <div class="f-count">${isEmpty ? '<span class="f-badge-soon">em breve</span>' : countLabel}</div>
    </div>
    <div class="f-name">${f.name}</div>
  `;
  div.addEventListener("click", () => {
    if (!isOpen) return;
    openModal(i);
  });
  div.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(i);
    }
  });
  row.appendChild(div);
});

/* ─── "No results" message element (#4) ─────────────────────────────────── */
const noResultsMsg = document.createElement("div");
noResultsMsg.className = "search-no-results";
noResultsMsg.setAttribute("role", "status");
noResultsMsg.style.display = "none";
searchWrap.appendChild(noResultsMsg);

/* ─── Search / filter logic ──────────────────────────────────────────────── */
searchInput.addEventListener("input", () => {
  const q = normalize(searchInput.value.trim());
  if (!q) {
    folders.forEach((_, i) => {
      document.getElementById(`folder-${i}`).classList.remove("folder--dimmed");
    });
    noResultsMsg.style.display = "none";
    return;
  }
  let matchCount = 0;
  let lastMatchIdx = -1;
  folders.forEach((f, i) => {
    const el = document.getElementById(`folder-${i}`);
    const hasMatch = f.docs.some(
      (doc) => normalize(doc.title).includes(q) || normalize(doc.description).includes(q)
    );
    el.classList.toggle("folder--dimmed", !hasMatch);
    if (hasMatch) { matchCount++; lastMatchIdx = i; }
  });
  if (matchCount === 0) {
    noResultsMsg.textContent = `Nenhum documento encontrado para "${searchInput.value.trim()}"`;
    noResultsMsg.style.display = "block";
    announce(`Nenhum documento encontrado para ${searchInput.value.trim()}`);
  } else {
    noResultsMsg.style.display = "none";
  }
  if (matchCount === 1 && lastMatchIdx >= 0) {
    openModal(lastMatchIdx, q);
  }
});

/* ─── Briefcase open / close ─────────────────────────────────────────────── */
let isOpen = false;
const btn = document.getElementById("openBtn");
const lid = document.getElementById("lid");

function openCase(skipAnimation) {
  if (isOpen) return;

  btn.disabled = true;

  if (skipAnimation) {
    lid.style.transition = "none";
    lid.classList.add("opened");
    lid.style.visibility = "hidden";
    folders.forEach((_, i) => {
      const el = document.getElementById(`folder-${i}`);
      el.style.transition = "none";
      el.classList.add("visible");
      el.setAttribute("tabindex", "0");
    });
    isOpen = true;
    btn.disabled = false;
    btn.textContent = "↺ Fechar maleta";
    searchWrap.classList.add("visible");
    announce("Maleta aberta");
    // Restore transitions after a frame
    requestAnimationFrame(() => {
      lid.style.transition = "";
      folders.forEach((_, i) => {
        document.getElementById(`folder-${i}`).style.transition = "";
      });
    });
    return;
  }

  lid.classList.add("opened");

  setTimeout(() => {
    folders.forEach((_, i) => {
      const el = document.getElementById(`folder-${i}`);
      setTimeout(() => {
        el.classList.add("visible");
        el.setAttribute("tabindex", "0");
      }, i * 90);
    });
    isOpen = true;
    btn.disabled = false;
    btn.textContent = "↺ Fechar maleta";
    searchWrap.classList.add("visible");
    announce("Maleta aberta");
  }, 820);

  setTimeout(() => {
    lid.style.visibility = "hidden";
  }, 900);
}

btn.addEventListener("click", () => {
  if (isOpen) {
    resetCase();
    return;
  }
  openCase(false);
});

function resetCase() {
  folders.forEach((_, i) => {
    const el = document.getElementById(`folder-${i}`);
    el.classList.remove("visible");
    el.setAttribute("tabindex", "-1");
  });
  searchWrap.classList.remove("visible");
  searchInput.value = "";
  // Remove dimmed state
  folders.forEach((_, i) => {
    document.getElementById(`folder-${i}`).classList.remove("folder--dimmed");
  });
  lid.style.visibility = "visible";
  setTimeout(() => {
    lid.classList.remove("opened");
    btn.textContent = "▶ Abrir maleta";
    isOpen = false;
    history.replaceState(null, "", window.location.pathname);
    announce("Maleta fechada");
  }, 200);
  closeModal();
}

/* ─── Format date helper ─────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
let currentModalFolder = -1;

function openModal(i, highlightQuery) {
  const f = folders[i];
  currentModalFolder = i;
  document.getElementById("mNum").textContent = `Pasta ${i + 1}`;
  document.getElementById("mNum").style.color = NUM_HEX[i];
  document.getElementById("mTitle").textContent = f.name;
  document.querySelector(".modal-box").style.setProperty("--folder-accent", NUM_HEX[i]);

  const cont = document.getElementById("mContent");
  if (f.docs.length === 0) {
    const placeholderText = f.placeholder || "Nenhum documento disponível ainda.";
    cont.innerHTML = `<div class="empty-msg">${placeholderText}</div>`;
  } else {
    const q = highlightQuery ? normalize(highlightQuery) : "";
    cont.innerHTML = f.docs
      .map(
        (doc, di) => {
          const isMatch = q && (normalize(doc.title).includes(q) || normalize(doc.description).includes(q));
          const matchClass = q && !isMatch ? " doc-item--dimmed" : "";
          const meta = [];
          if (doc.date) meta.push(formatDate(doc.date));
          if (doc.size) meta.push(doc.size);
          const metaHtml = meta.length
            ? `<div class="doc-meta">${meta.join(" · ")}</div>`
            : "";
          const docHash = `#pasta-${i + 1}/doc-${di + 1}`;
          return `
      <div class="doc-item${matchClass}">
        <span class="doc-title">${doc.title}</span>
        ${metaHtml}
        <p class="doc-desc">${doc.description}</p>
        <div class="doc-actions">
          <a class="doc-btn doc-btn--view" href="${doc.file}" target="_blank" rel="noopener noreferrer">Visualizar</a>
          <a class="doc-btn doc-btn--download" href="${doc.file}" download>Baixar</a>
          <button class="doc-btn doc-btn--link" data-hash="${docHash}" aria-label="Copiar link do documento" title="Copiar link">🔗 Link</button>
        </div>
      </div>
    `;
        }
      )
      .join("");

    // Attach copy-link handlers
    cont.querySelectorAll(".doc-btn--link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const hash = e.currentTarget.dataset.hash;
        const url = window.location.origin + window.location.pathname + hash;
        navigator.clipboard.writeText(url).then(() => {
          showToast("Link copiado!");
        }).catch(() => {
          // Fallback: update hash so user can copy from address bar
          history.replaceState(null, "", hash);
        });
      });
    });
  }

  const overlay = document.getElementById("modalOv");
  overlay.classList.add("open");

  // Focus trap setup
  const closeBtn = document.getElementById("mClose");
  closeBtn.focus();
  setupFocusTrap(overlay);

  // Update URL hash
  history.replaceState(null, "", `#pasta-${i + 1}`);
  announce(`Pasta ${f.name}: ${f.docs.length} documento${f.docs.length !== 1 ? "s" : ""}`);
}

function closeModal() {
  const overlay = document.getElementById("modalOv");
  overlay.classList.remove("open");
  currentModalFolder = -1;
  removeFocusTrap();
  if (isOpen) {
    history.replaceState(null, "", window.location.pathname);
  }
}

document.getElementById("mClose").addEventListener("click", closeModal);

document.getElementById("modalOv").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalOv")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ─── Focus trap for modal (eMAG / WCAG) ─────────────────────────────────── */
let focusTrapHandler = null;

function setupFocusTrap(container) {
  removeFocusTrap();
  focusTrapHandler = (e) => {
    if (e.key !== "Tab") return;
    const focusable = container.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", focusTrapHandler);
}

function removeFocusTrap() {
  if (focusTrapHandler) {
    document.removeEventListener("keydown", focusTrapHandler);
    focusTrapHandler = null;
  }
}

/* ─── Deep linking via URL hash ──────────────────────────────────────────── */
function handleHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const pastaMatch = hash.match(/^#pasta-(\d+)/);
  if (!pastaMatch) return;

  const folderIdx = parseInt(pastaMatch[1], 10) - 1;
  if (folderIdx < 0 || folderIdx >= folders.length) return;

  if (!isOpen) {
    openCase(true);
  }

  // Small delay to ensure DOM is ready
  requestAnimationFrame(() => {
    openModal(folderIdx);
  });
}

window.addEventListener("hashchange", handleHash);

/* ─── Auto-open on recurring visits (#8) ─────────────────────────────────── */
(function autoOpen() {
  const hasHash = window.location.hash && window.location.hash.match(/^#pasta-/);
  if (hasHash) {
    // Deep link takes priority
    handleHash();
    sessionStorage.setItem("maletaVisited", "1");
    return;
  }
  if (sessionStorage.getItem("maletaVisited")) {
    openCase(true);
  }
})();

// Mark visited after first manual open
const origOpenCase = openCase;
btn.addEventListener("click", () => {
  sessionStorage.setItem("maletaVisited", "1");
});

/* ─── Footer ─────────────────────────────────────────────────────────────── */
(function setFooter() {
  const footer = document.getElementById("pageFooter");
  if (!footer) return;
  const [y, m, d] = LAST_UPDATED.split("-");
  const dateStr = `${d}/${m}/${y}`;
  footer.innerHTML = `
    <span>Última atualização: ${dateStr}</span>
    <span>Acesso regulado pela <a class="footer-link" href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" target="_blank" rel="noopener noreferrer">Lei nº 12.527/2011 – Lei de Acesso à Informação</a></span>
    <button class="install-btn" id="installBtn" style="display:none" aria-label="Instalar aplicativo">Instalar app</button>
  `;
  const installBtn = document.getElementById("installBtn");
  if (installBtn) installBtn.addEventListener("click", handleInstallClick);
})();
