const COLORS  = ['c1','c2','c3','c4','c5'];
const NUM_HEX = ['#cc9a52','#6d8e60','#8078bc','#cc6a48','#4a9aac'];

const folders = [
  { name: 'Manual',               docs: [] },
  { name: 'Portaria e Resolução', docs: [] },
  { name: 'Legislação',           docs: [] },
  { name: 'Procedimentos',        docs: [] },
  { name: 'Modelos de Documento', docs: [] },
];

const row = document.getElementById('foldersRow');
folders.forEach((f, i) => {
  const div = document.createElement('div');
  div.className = `folder ${COLORS[i]}`;
  div.id = `folder-${i}`;
  div.innerHTML = `
    <div class="f-paper2"></div>
    <div class="f-paper"></div>
    <div class="f-tab"></div>
    <div class="f-body"><div class="f-num">${i+1}</div></div>
    <div class="f-name">${f.name}</div>
  `;
  div.addEventListener('click', () => openModal(i));
  row.appendChild(div);
});

let isOpen = false;
const btn  = document.getElementById('openBtn');
const lid  = document.getElementById('lid');

btn.addEventListener('click', () => {
  if (isOpen) { resetCase(); return; }

  btn.disabled = true;

  lid.classList.add('opened');

  setTimeout(() => {
    folders.forEach((_, i) => {
      setTimeout(() => {
        document.getElementById(`folder-${i}`).classList.add('visible');
      }, i * 90);
    });
    isOpen = true;
    btn.disabled = false;
    btn.textContent = '↺ Fechar maleta';
  }, 820);
});

function resetCase() {
  folders.forEach((_, i) => {
    document.getElementById(`folder-${i}`).classList.remove('visible');
  });
  setTimeout(() => {
    lid.classList.remove('opened');
    btn.textContent = '▶ Abrir maleta';
    isOpen = false;
  }, 200);
  document.getElementById('modalOv').classList.remove('open');
}

function openModal(i) {
  const f = folders[i];
  document.getElementById('mNum').textContent = `Pasta ${i+1}`;
  document.getElementById('mNum').style.color = NUM_HEX[i];
  document.getElementById('mTitle').textContent = f.name;
  const cont = document.getElementById('mContent');
  cont.innerHTML = f.docs.length
    ? ''
    : '<div class="empty-msg">Nenhum documento disponível ainda.</div>';
  document.getElementById('modalOv').classList.add('open');
}

document.getElementById('mClose').addEventListener('click', () => {
  document.getElementById('modalOv').classList.remove('open');
});
document.getElementById('modalOv').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOv'))
    document.getElementById('modalOv').classList.remove('open');
});
