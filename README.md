# Maleta Digital da Fiscalização

Acervo digital de documentos oficiais do **Departamento de Fiscalização de Contratos** da Universidade Federal do Piauí (UFPI).

## Sobre

A Maleta Digital da Fiscalização é um portal web que organiza legislação, manuais, portarias, resoluções e modelos de documentos utilizados por fiscais e gestores de contratos da UFPI. A interface simula uma maleta executiva 3D com pastas coloridas, oferecendo uma experiência visual intuitiva e profissional.

O público-alvo são servidores públicos que precisam localizar documentos normativos rapidamente no dia a dia da fiscalização contratual.

## Funcionalidades

- **Maleta 3D interativa** — Interface skeuomórfica com animação de abertura de tampa e pastas com cores distintas
- **Visualização e download de PDFs** — Abertura direta no navegador com opção de download
- **Busca inteligente** — Filtro em tempo real insensível a acentos, com abertura automática ao encontrar resultado único
- **Deep linking** — Compartilhamento de links diretos para pastas e documentos via URL hash (`#pasta-1`, `#pasta-1/doc-1`)
- **Atalhos de teclado** — `/` ou `Ctrl+K` para buscar, `1`–`5` para abrir pastas, `?` para ajuda
- **PWA instalável** — Funciona como app standalone no celular e desktop, com suporte offline via Service Worker
- **Impressão de índice** — Gera índice completo de todos os documentos para anexar a processos administrativos
- **Acessibilidade** — Conformidade com eMAG e WCAG 2.0 AA: skip link, navegação por teclado, ARIA, focus trap, `prefers-reduced-motion`
- **Responsivo** — Layout adaptado para desktop, tablet e mobile com scroll-snap horizontal para pastas

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica com ARIA |
| CSS3 | Design system com custom properties, transforms 3D, animações, `@media print` |
| JavaScript (vanilla) | Lógica de interação, busca, deep linking, PWA |
| Service Worker | Cache offline (cache-first para app shell, network-first para PDFs) |
| PWA Manifest | Instalação como app standalone |
| Google Fonts | Noto Serif, Work Sans, Space Grotesk |

| Vercel | Hospedagem com deploy automático e headers de segurança |

Sem framework, sem bundler, sem dependências externas.

## Estrutura do Projeto

```
maleta-digital-da-fiscalizacao/
├── index.html              # Página principal
├── manifest.json           # Manifesto PWA
├── vercel.json             # Configuração Vercel (headers de segurança)
├── favicon.ico             # Favicon principal
├── sw.js                   # Service Worker (cache offline)
├── css/
│   └── style.css           # Estilos e design system
├── js/
│   ├── data.js             # Dados das pastas e documentos
│   └── script.js           # Lógica da aplicação
├── assets/
│   ├── icons/              # Favicons e ícones PWA
│   ├── img/
│   │   └── logo-ufpi.png   # Logo institucional
│   └── docs/
│       └── *.pdf           # Documentos do acervo
├── docs/
│   ├── DEPLOY.md           # Guia de deploy e headers de segurança
│   ├── DESIGN.md           # Especificação do design system
│   ├── MELHORIAS.md        # Plano de melhorias v1
│   └── MELHORIAS-v2.md     # Plano de melhorias v2
├── README.md               # Este arquivo
├── CLAUDE.md               # Guia para Claude Code
└── .gitignore              # Arquivos ignorados pelo Git
```

## Como Usar

### Acesso online

Acesse a versão em produção: **[maleta-digital-da-fiscalizacao.vercel.app](https://maleta-digital-da-fiscalizacao.vercel.app)**

### Acesso local

Abra o arquivo `index.html` diretamente no navegador. Nenhum servidor é necessário para as funcionalidades básicas.

### Navegação

1. Clique em **"Abrir maleta"** para revelar as pastas
2. Clique em uma pasta para ver seus documentos
3. Use **"Visualizar"** para abrir o PDF ou **"Baixar"** para salvar
4. Use **"Link"** para copiar o link direto de um documento

### Instalação como App

Em navegadores compatíveis (Chrome, Edge), o botão **"Instalar app"** aparece no rodapé, permitindo acesso offline como aplicativo standalone.

## Como Adicionar Documentos

1. Coloque o arquivo PDF na pasta `assets/docs/`
2. Edite `js/data.js` e adicione uma entrada no array `docs` da pasta correspondente:
   ```javascript
   {
     title: 'Título do Documento',
     file: 'assets/docs/nome-do-arquivo.pdf',
     description: 'Descrição breve do conteúdo.',
     date: 'AAAA-MM-DD',
     size: '1,2 MB',
   }
   ```
3. Atualize a constante `LAST_UPDATED` em `js/data.js` com a data atual
4. Atualize o `CACHE_NAME` em `sw.js` para corresponder (formato: `'maleta-AAAA-MM-DD'`)

Para criar uma nova pasta, adicione um novo objeto ao array `folders` em `js/data.js`. Pastas sem documentos podem incluir um campo `placeholder` com mensagem explicativa.

## Design System

O projeto segue o design system **"The Digital Dossier"**, documentado em [DESIGN.md](docs/DESIGN.md). Princípios principais:

- Paleta orgânica baseada em tons de couro e madeira (marrom profundo `#210e0b` como base)
- Tipografia editorial: Noto Serif (títulos), Work Sans (corpo), Space Grotesk (rótulos)
- Profundidade via camadas de superfícies, não sombras rígidas
- Sem bordas sólidas de 1px — separação por variações tonais
- Detalhes skeuomórficos: texturas de couro, papel recortado, metadados "carimbados"

## Acessibilidade

O portal segue as diretrizes do **eMAG** (Modelo de Acessibilidade em Governo Eletrônico) e **WCAG 2.0 nível AA**:

- Skip link para navegação por teclado
- Papéis ARIA em elementos interativos
- Focus trap no modal com retorno de foco ao fechar
- Anúncios via `aria-live` para mudanças de estado
- Suporte a `prefers-reduced-motion` para animações
- Contraste adequado entre texto e fundo

## Deploy

Hospedado na **Vercel** (plano Hobby) com deploy automático a cada push na branch `main`. Headers de segurança (CSP, X-Frame-Options, etc.) configurados via `vercel.json`. Detalhes completos em [DEPLOY.md](docs/DEPLOY.md).

## Licença

Projeto institucional da Universidade Federal do Piauí — UFPI.  
Departamento de Fiscalização de Contratos.
