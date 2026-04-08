# Maleta Digital da Fiscalização

Acervo digital de documentos oficiais da **Pró-Reitoria de Administração** da Universidade Federal do Piauí (UFPI), voltado para fiscais e gestores de contratos.

> **Acesse em produção:** [maleta-digital-da-fiscalizacao.vercel.app](https://maleta-digital-da-fiscalizacao.vercel.app)

---

## Sobre o Projeto

A Maleta Digital da Fiscalização é um portal web que organiza legislação, manuais, portarias, resoluções e fluxos de procedimentos utilizados no dia a dia da fiscalização contratual da UFPI. A interface simula uma **maleta executiva 3D** — com tampa articulada, ferragens douradas e pastas coloridas — sobre um fundo azul-marinho institucional, oferecendo uma experiência visual intuitiva e profissional.

O público-alvo são servidores públicos que precisam localizar documentos normativos rapidamente.

## Funcionalidades

- **Maleta 3D interativa** — Interface skeuomórfica com animação de abertura de tampa, alça, dobradiças e fechadura
- **4 pastas temáticas** — Manual, Portaria e Resolução, Legislação, Procedimentos (15 documentos no total)
- **Visualização e download de PDFs** — Abertura direta no navegador com opção de download
- **Busca inteligente** — Filtro em tempo real insensível a acentos, com abertura automática ao encontrar resultado único
- **Deep linking** — Links diretos para pastas e documentos via URL hash (`#pasta-1`, `#pasta-2/doc-3`)
- **Atalhos de teclado** — `/` ou `Ctrl+K` para buscar, `1`–`4` para abrir pastas, `Esc` para fechar, `?` para ajuda
- **PWA instalável** — Funciona como app standalone no celular e desktop, com suporte offline via Service Worker
- **Impressão de índice** — Gera índice completo de todos os documentos para anexar a processos administrativos
- **Acessibilidade** — Conformidade com eMAG e WCAG 2.0 AA: skip link, navegação por teclado, ARIA, focus trap, `prefers-reduced-motion`
- **Responsivo** — Layout adaptado para desktop, tablet e mobile com scroll-snap horizontal para pastas

## Estrutura do Projeto

```
maleta-digital-da-fiscalizacao/
├── index.html                  # Página principal (única)
├── manifest.json               # Manifesto PWA
├── sw.js                       # Service Worker (cache offline)
├── vercel.json                 # Config Vercel (headers de segurança)
├── favicon.ico                 # Favicon principal
├── css/
│   └── style.css               # Estilos completos e design tokens (~1750 linhas)
├── js/
│   ├── data.js                 # Dados das pastas e documentos (fonte única)
│   └── script.js               # Toda a lógica da aplicação (~550 linhas)
├── assets/
│   ├── icons/                  # Favicons e ícones PWA
│   ├── img/
│   │   └── logo-ufpi.png       # Logo institucional
│   └── docs/                   # Documentos PDF do acervo
│       ├── Manual/             # 1 PDF
│       ├── Portaria e Resolução/  # 2 PDFs
│       ├── Legislação/         # 2 PDFs
│       └── Procedimentos/      # 10 PDFs (fluxos de processos)
├── docs/
│   ├── DEPLOY.md               # Guia de deploy e headers de segurança
│   ├── DESIGN.md               # Especificação do design system
│   ├── MELHORIAS.md            # Plano de melhorias v1
│   └── MELHORIAS-v2.md         # Plano de melhorias v2
├── CLAUDE.md                   # Guia para Claude Code
├── README.md                   # Este arquivo
└── .gitignore
```

## Como Rodar Localmente

Nenhum servidor, build ou dependência é necessário.

1. Clone o repositório:
   ```bash
   git clone https://github.com/guidesiderio/maleta-digital-da-fiscalizacao.git
   ```
2. Abra `index.html` diretamente no navegador

> **Nota:** Para testar funcionalidades de PWA (Service Worker, instalação), é necessário servir via HTTP. Exemplo rápido:
> ```bash
> npx serve .
> ```

## Como Adicionar Documentos

Todos os documentos são definidos em `js/data.js`. Para adicionar um novo:

1. Coloque o arquivo PDF na subpasta correspondente dentro de `assets/docs/` (ex: `assets/docs/Procedimentos/`)
2. Edite `js/data.js` e adicione uma entrada no array `docs` da pasta correspondente:
   ```javascript
   {
     title: "Título do Documento",
     file: "assets/docs/Pasta/nome-do-arquivo.pdf",
     description: "Descrição breve do conteúdo.",
     date: "AAAA-MM-DD",
     size: "1,2 MB"
   }
   ```
3. Atualize a constante `LAST_UPDATED` em `js/data.js` com a data atual (formato: `"AAAA-MM-DD"`)
4. Atualize o `CACHE_NAME` em `sw.js` para corresponder (formato: `'maleta-AAAA-MM-DD'`)

Para criar uma nova pasta, adicione um novo objeto ao array `folders` em `js/data.js` com `name` e `docs`.

## Deploy

### Vercel (produção)

O projeto está hospedado na **Vercel** (plano Hobby) com deploy automático a cada push na branch `main`.

- URL de produção: [maleta-digital-da-fiscalizacao.vercel.app](https://maleta-digital-da-fiscalizacao.vercel.app)
- Headers de segurança (CSP, X-Frame-Options, etc.) configurados via `vercel.json`
- Detalhes completos em [docs/DEPLOY.md](docs/DEPLOY.md)

### GitHub Pages

Por ser um projeto estático sem build, também funciona diretamente no GitHub Pages:

1. Vá em **Settings > Pages** do repositório
2. Selecione a branch `main` e a pasta `/ (root)`
3. Salve e aguarde o deploy

### Cache

O cache está configurado para que alterações sejam refletidas automaticamente após cada deploy, sem necessidade de Ctrl+Shift+R:

- **HTML, JS, CSS, SW e manifest** — `Cache-Control: no-cache, no-store, must-revalidate` via `vercel.json`, garantindo que o navegador sempre busque a versão mais recente
- **Imagens e ícones** — cache longo (1 ano, `immutable`) pois raramente mudam
- **PDFs** — cache de 30 dias
- **Service Worker** — usa estratégia **network-first** para HTML/JS/CSS (busca na rede primeiro, usa cache apenas como fallback offline) e cache-first apenas para imagens/ícones

Quando uma nova versão do Service Worker é ativada, um toast "Nova versão disponível!" é exibido automaticamente.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica com ARIA |
| CSS3 | Design system com custom properties, transforms 3D, animações, `@media print` |
| JavaScript (vanilla) | Lógica de interação, busca, deep linking, PWA |
| Service Worker | Cache offline (network-first para shell, cache-first para imagens) |
| PWA Manifest | Instalação como app standalone |
| Google Fonts | Noto Serif, Work Sans, Space Grotesk |
| Vercel | Hospedagem com deploy automático e headers de segurança |

**Sem framework, sem bundler, sem dependências externas.**

## Paleta de Cores

| Token | Cor | Uso |
|---|---|---|
| `--surface` | `#0a1e30` | Fundo base (azul-marinho escuro) |
| `--surface-container-low` | `#112F4E` | Fundo institucional (azul-marinho) |
| `--surface-container` | `#3a1f1a` | Maleta — madeira escura |
| `--surface-container-high` | `#472f2b` | Maleta — madeira clara |
| `--primary` | `#e3c199` | Ferragens e acentos (dourado/bege) |
| `--primary-dark` | `#c49642` | Ferragens — tom mais forte |

## Acessibilidade

O portal segue as diretrizes do **eMAG** (Modelo de Acessibilidade em Governo Eletrônico) e **WCAG 2.0 nível AA**:

- Skip link para navegação por teclado
- Papéis ARIA em elementos interativos
- Focus trap no modal com retorno de foco ao fechar
- Anúncios via `aria-live` para mudanças de estado
- Suporte a `prefers-reduced-motion` para animações
- Contraste adequado entre texto e fundo

## Licença

Projeto institucional da **Universidade Federal do Piauí — UFPI**.
Pró-Reitoria de Administração.
