const COLORS = ["c1", "c2", "c3", "c4", "c5"];
const NUM_HEX = ["#cc9a52", "#6d8e60", "#8078bc", "#cc6a48", "#4a9aac"];

function getViewerUrl(file) {
  const base = window.location.href.replace(/\/[^/]*$/, "/");
  const fileUrl = base + file;
  return "https://docs.google.com/viewer?url=" + encodeURIComponent(fileUrl);
}

const row = document.getElementById("foldersRow");
folders.forEach((f, i) => {
  const div = document.createElement("div");
  div.className = `folder ${COLORS[i]}`;
  div.id = `folder-${i}`;
  div.setAttribute("role", "button");
  div.setAttribute("tabindex", "-1");
  div.setAttribute("aria-label", `Abrir pasta: ${f.name}`);
  const docCount = f.docs.length;
  const countLabel = `${docCount} doc${docCount !== 1 ? "s" : ""}`;
  div.innerHTML = `
    <div class="f-paper2"></div>
    <div class="f-paper"></div>
    <div class="f-tab"></div>
    <div class="f-body">
      <div class="f-num">${i + 1}</div>
      <div class="f-count">${countLabel}</div>
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

let isOpen = false;
const btn = document.getElementById("openBtn");
const lid = document.getElementById("lid");

btn.addEventListener("click", () => {
  if (isOpen) {
    resetCase();
    return;
  }

  btn.disabled = true;

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
  }, 820);

  // Oculta o lid após a transição CSS (0.9s) para evitar sobreposição fantasma
  setTimeout(() => {
    lid.style.visibility = "hidden";
  }, 900);
});

function resetCase() {
  folders.forEach((_, i) => {
    const el = document.getElementById(`folder-${i}`);
    el.classList.remove("visible");
    el.setAttribute("tabindex", "-1");
  });
  // Restaura visibilidade antes da animação de fechamento
  lid.style.visibility = "visible";
  setTimeout(() => {
    lid.classList.remove("opened");
    btn.textContent = "▶ Abrir maleta";
    isOpen = false;
  }, 200);
  closeModal();
}

function openModal(i) {
  const f = folders[i];
  document.getElementById("mNum").textContent = `Pasta ${i + 1}`;
  document.getElementById("mNum").style.color = NUM_HEX[i];
  document.getElementById("mTitle").textContent = f.name;

  const cont = document.getElementById("mContent");
  if (f.docs.length === 0) {
    cont.innerHTML = '<div class="empty-msg">Nenhum documento disponível ainda.</div>';
  } else {
    cont.innerHTML = f.docs
      .map(
        (doc) => `
      <div class="doc-item">
        <a class="doc-title" href="${getViewerUrl(doc.file)}" target="_blank" rel="noopener noreferrer">${doc.title}</a>
        <p class="doc-desc">${doc.description}</p>
      </div>
    `
      )
      .join("");
  }

  const overlay = document.getElementById("modalOv");
  overlay.classList.add("open");
  document.getElementById("mClose").focus();
}

function closeModal() {
  document.getElementById("modalOv").classList.remove("open");
}

document.getElementById("mClose").addEventListener("click", closeModal);

document.getElementById("modalOv").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalOv")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

(function setFooter() {
  const footer = document.getElementById("pageFooter");
  if (!footer) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  footer.innerHTML = `
    <span>Última atualização: ${dateStr}</span>
    <span>Acesso regulado pela Lei nº 12.527/2011 – Lei de Acesso à Informação</span>
  `;
})();
