# Plano de Melhorias v2 — Maleta Digital da Fiscalização

## Contexto

Com todas as 10 melhorias da [primeira rodada](MELHORIAS.md) implementadas, o portal já oferece visualização direta de PDFs, busca, deep linking, acessibilidade eMAG, impressão e cache offline. Esta segunda rodada foca em três eixos que emergiram da análise do código atual:

- **Compartilhável e Instalável** — o app é compartilhado via WhatsApp/e-mail mas não gera preview de link, e o Service Worker existe sem manifest PWA.
- **Manutenível e Resiliente** — tokens de design hardcoded 80+ vezes no CSS, cache estático sem invalidação, zero testes automatizados.
- **Polimento de Fluxo** — pequenas fricções do uso diário (sem feedback visual, sem atalhos de teclado, print view incompleto, foco perdido ao fechar modal).

---

## TIER 1 — Alto Impacto, Baixo Esforço

### 1. ~~PWA Manifest + Prompt de Instalação~~ ✅

**Por quê**: O Service Worker (`sw.js`) já está registrado, mas sem `manifest.json` o site não pode ser instalado como app standalone. Fiscais em inspeções de campo se beneficiariam de tocar um ícone na tela inicial do celular para abrir a maleta offline, em vez de digitar uma URL.

**O quê**:
- Criar `manifest.json` com `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color: "#210e0b"`, `background_color: "#210e0b"` e ícones (gerar a partir do logo institucional em 192px e 512px)
- Adicionar `<link rel="manifest" href="manifest.json">` ao `index.html`
- Adicionar `<meta name="theme-color" content="#210e0b">` ao `index.html`
- Opcionalmente interceptar `beforeinstallprompt` em `script.js` para exibir um botão "Instalar app" sutil no footer (ghost button, Space Grotesk)

**Arquivos**: novo `manifest.json`, `index.html`, `script.js`, `style.css`

---

### 2. ~~Open Graph / Preview de Links no WhatsApp~~ ✅

**Por quê**: Quando fiscais compartilham um link via WhatsApp ou e-mail, o destinatário vê apenas uma URL nua sem título, descrição ou imagem. Adicionar meta tags OG faz o link aparecer como "Maleta Digital da Fiscalização — UFPI" com descrição e logo institucional. Isso é crítico para o fluxo de compartilhamento que é o principal canal de distribuição do portal.

**O quê**:
- Adicionar `<meta name="description">` com descrição do portal
- Adicionar `<meta property="og:title">`, `og:description`, `og:image` (apontando para o logo PNG), `og:type` e `og:url`
- Adicionar meta tags Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`)

**Arquivos**: `index.html`

---

### 3. ~~Toast Notifications para Feedback Visual~~ ✅

**Por quê**: Atualmente, ao clicar "🔗 Link" para copiar a URL de um documento, o texto do botão muda para "✓ Copiado" por 1,5s — fácil de perder, especialmente no mobile. Não há feedback para outras ações. Um toast sutil na parte inferior da tela oferece confirmação clara e acessível.

**O quê**:
- Criar container de toast (`<div id="toastContainer" aria-live="assertive">`) adicionado ao `body` via `script.js`
- Implementar `showToast(message, duration=2000)` que cria uma barra na parte inferior com a mensagem e auto-remove após a duração
- Estilizar como barra glass-morphism conforme DESIGN.md (semi-transparente com `backdrop-filter: blur(12px)`, Space Grotesk, sem bordas rígidas)
- Usar para: "Link copiado!", e futuramente para outros feedbacks

**Arquivos**: `script.js`, `style.css`

---

### 4. ~~Estado "Nenhum Resultado" na Busca~~ ✅

**Por quê**: Se o usuário digita uma busca sem correspondência, todas as pastas esmaem para 0.2 de opacidade sem nenhuma mensagem explícita. O usuário pode achar que a interface quebrou. Leitores de tela não recebem nenhum anúncio.

**O quê**:
- Após a filtragem, se `matchCount === 0` e a query não é vazia, exibir mensagem "Nenhum documento encontrado para '{query}'" abaixo da barra de busca (estilizado como `.empty-msg`)
- Anunciar via `announce()` ou o novo toast
- Esconder a mensagem quando o input é limpo ou há correspondências

**Arquivos**: `script.js`, `style.css`

---

## TIER 2 — Impacto Médio, Esforço Médio

### 5. ~~CSS Custom Properties para Design Tokens~~ ✅

**Por quê**: O DESIGN.md define tokens claros (`#210e0b`, `#e3c199`, `#2b1613`, etc.), mas estes estão hardcoded como valores hexadecimais literais 80+ vezes no `style.css`. Alterar uma cor exige find-and-replace em 1025 linhas. Extraí-los para custom properties no `:root` torna futura tematização, modo de alto contraste ou ajustes triviais, além de reduzir diretamente a fricção de manutenção.

**O quê**:
- Adicionar bloco `:root` no topo de `style.css` com todos os tokens do DESIGN.md §2:
  - `--surface`, `--surface-container-low`, `--surface-container`, `--surface-container-high`, `--primary`, `--primary-dark`, `--on-primary`, `--on-surface`, `--on-surface-variant`, `--ghost-border`, `--outline-variant`
- Substituir todas as ocorrências hardcoded por `var(--nome-do-token)`
- Refatoração puramente mecânica com zero alteração visual

**Arquivos**: `style.css`

---

### 6. ~~Print View Completo com Índice de Documentos~~ ✅

**Por quê**: O `@media print` atual esconde o modal e mostra apenas o grid de pastas com contagem. Porém, fiscais querem imprimir um **índice completo de todos os documentos** com títulos, descrições, datas e tamanhos para anexar a processos administrativos. A view de impressão atual não mostra detalhes dos documentos.

**O quê**:
- No evento `beforeprint` (ou via botão "Gerar índice para impressão"), renderizar dinamicamente um `#printIndex` listando cada pasta e seus documentos em formato tabular limpo
- Cada entrada mostra: nome da pasta, título do documento, data, tamanho e caminho do arquivo
- Estilizar com regras `@media print`: tipografia serifada limpa, `page-break-inside: avoid`, cabeçalho institucional com data de geração
- Adicionar botão "Imprimir índice" (ghost button, visível apenas com a maleta aberta)

**Arquivos**: `script.js`, `style.css`, possivelmente `index.html`

---

### 7. ~~Atalhos de Teclado~~ ✅

**Por quê**: Usuários frequentes (fiscais que acessam diariamente) se beneficiariam de atalhos de teclado. O suporte atual se limita a Tab/Enter/Escape. Atalhos adicionais tornam a interface mais profissional e aceleram a navegação.

**O quê**:
- `Ctrl+K` ou `/` (fora do input de busca): focar a barra de busca
- `Escape` (busca focada): limpar busca e retirar foco
- `1`–`5` (sem input focado): abrir a pasta correspondente diretamente
- `?` (sem input focado): exibir popover de ajuda com atalhos disponíveis (ghost button style)
- Respeitar `event.target` para não disparar atalhos ao digitar no input de busca

**Arquivos**: `script.js`, `style.css`

---

### 8. ~~Versionamento de Cache do Service Worker~~ ✅

**Por quê**: O `sw.js` usa `CACHE_NAME = 'maleta-v1'` estático. Quando o conteúdo é atualizado (novos PDFs, novos dados), não há mecanismo de invalidação. Usuários com cache antigo veem conteúdo desatualizado até limparem manualmente. Isso é especialmente problemático para fiscais offline em campo.

**O quê**:
- Vincular `CACHE_NAME` ao `LAST_UPDATED` (ex: `'maleta-2026-03-30'`)
- Como `sw.js` não importa `data.js` diretamente, a abordagem mais simples: atualizar manualmente a versão em `sw.js` quando atualizar `data.js` (com comentário de lembrete para sincronizar)
- A lógica de cleanup no `activate` já deleta caches antigos — basta a versão mudar
- Exibir toast "Nova versão disponível" quando o SW detecta conteúdo atualizado (via evento `controllerchange`)

**Arquivos**: `sw.js`, `script.js`

---

### 9. ~~Retorno de Foco ao Fechar Modal~~ ✅

**Por quê**: Quando o modal é fechado (Escape ou clique fora), o foco não retorna à pasta que foi clicada. Isso quebra o fluxo de navegação por teclado e é uma preocupação de acessibilidade WCAG 2.4.3 (Focus Order). Usuários de leitores de tela perdem sua posição na página.

**O quê**:
- Em `closeModal()`, após remover `.open`, retornar foco ao `document.getElementById('folder-' + currentModalFolder)`
- Armazenar referência da pasta antes de resetar o estado do modal

**Arquivos**: `script.js`

---

## TIER 3 — Melhorias Futuras

### 10. ~~Documentação de Headers de Segurança (CSP)~~ ✅

**Por quê**: Como site governamental, mesmo estático, headers de segurança importam. O site carrega Google Fonts via `@import` no CSS, o que significa que uma CSP que bloqueie estilos inline ou fontes externas quebraria o site. Documentar os headers recomendados ajuda quem for fazer deploy (servidor UFPI ou GitHub Pages).

**O quê**:
- Criar `DEPLOY.md` documentando headers HTTP recomendados:
  - `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- Incluir exemplo de `.htaccess` para Apache (comum na UFPI) e `_headers` para Netlify/Cloudflare Pages
- Opcionalmente adicionar `<meta http-equiv="Content-Security-Policy">` como fallback

**Arquivos**: novo `DEPLOY.md`, opcionalmente `index.html`

---

### 11. Testes End-to-End com Playwright

**Por quê**: Com 10+ melhorias implementadas e mais a caminho, o risco de regressão cresce. Os caminhos críticos (abrir maleta, clicar pasta, modal abre, deep link carrega, busca filtra, print renderiza) devem ter testes automatizados. O Playwright pode testar arquivo HTML estático sem servidor.

**O quê**:
- Criar diretório `tests/` com `maleta.spec.js`
- Testar caminhos críticos:
  1. Página carrega → clicar "Abrir maleta" → pastas visíveis
  2. Clicar pasta 1 → modal abre com título e contagem corretos
  3. Deep link `#pasta-2` → auto-abre maleta e modal da pasta 2
  4. Busca "IN 05" → pastas não correspondentes esmaem, correspondente abre
  5. Escape fecha o modal
  6. Print view: elementos ocultos e índice visível
- Adicionar `playwright.config.js` que serve os arquivos estáticos

**Arquivos**: novos `tests/maleta.spec.js`, `playwright.config.js`

---

### 12. Tags / Categorias de Documentos

**Por quê**: Conforme o acervo cresce (as duas pastas vazias serão populadas, nova legislação será adicionada), usuários podem querer filtrar por tipo (lei, portaria, resolução, manual, modelo). Tags habilitam isso sem alterar a estrutura de pastas.

**O quê**:
- Adicionar array opcional `tags` às entradas em `data.js` (ex: `tags: ['legislação', 'licitação']`)
- Estender a busca para corresponder contra tags além de título/descrição
- Opcionalmente renderizar tags como badges pequenos em cada documento no modal (stamped labels conforme DESIGN.md)
- Opcionalmente adicionar botões de filtro acima/abaixo da busca ("Todos", "Lei", "Portaria", etc.)

**Arquivos**: `data.js`, `script.js`, `style.css`

---

### 13. Indicador "Novidades" para Documentos Recentes

**Por quê**: Quando o `LAST_UPDATED` muda, usuários recorrentes não têm como saber quais documentos foram adicionados ou atualizados desde a última visita. Um badge sutil em documentos recém-adicionados ajuda fiscais a identificar conteúdo novo sem abrir cada pasta.

**O quê**:
- Armazenar `lastSeenUpdate` em `localStorage`
- No carregamento, comparar com `LAST_UPDATED`; se diferente, marcar documentos com `date` mais recente com badge "Novo" (estilo stamped, 2° de rotação, Space Grotesk)
- Após o usuário abrir a maleta, atualizar `lastSeenUpdate`
- Badge desaparece após a primeira sessão de visualização

**Arquivos**: `script.js`, `style.css`

---

### 14. ~~Carregamento Assíncrono de Google Fonts~~ ✅

**Por quê**: O `@import` de Google Fonts no topo do `style.css` é render-blocking. Em conexões lentas de rede institucional, isso pode adicionar 1-2 segundos ao first paint. Trocar por carregamento assíncrono melhora a performance percebida.

**O quê**:
- Substituir `@import` por `<link rel="preconnect" href="https://fonts.googleapis.com">` e `<link rel="stylesheet" href="..." media="print" onload="this.media='all'">` no `index.html`
- Verificar `font-display: swap` no CSS das fontes
- Definir fallbacks no CSS (`font-family: 'Noto Serif', Georgia, serif`, etc.) para texto visível imediatamente

**Arquivos**: `index.html`, `style.css`

---

### 15. Analytics Leve Não-Invasivo

**Por quê**: Saber quais documentos são mais acessados e quais pastas são abertas ajuda a equipe do DFC a priorizar a criação de conteúdo (especialmente para as duas pastas vazias). Porém, sendo site governamental com obrigações de privacidade (LGPD), nenhum tracker de terceiros.

**O quê**:
- Implementar logger de eventos mínimo que armazena eventos em `localStorage` (aberturas de pasta, cliques em documentos, buscas realizadas)
- Adicionar seção "Estatísticas de uso" visível apenas via parâmetro de URL (ex: `?admin=1`) mostrando contagens simples: documentos mais acessados, termos de busca, frequência de acesso por pasta
- Zero serviço externo, zero cookies, zero PII — dados ficam inteiramente no navegador do usuário
- Alternativamente, documentar como adicionar Matomo (ferramenta open-source usada por sites gov brasileiros)

**Arquivos**: `script.js`, `style.css`, opcionalmente `DEPLOY.md`

---

## Ordem de Implementação Recomendada

1. **#2** Open Graph / WhatsApp previews (muito rápido, valor imediato)
2. **#9** Retorno de foco ao fechar modal (muito rápido, correção de acessibilidade)
3. **#4** Estado "nenhum resultado" na busca (rápido, correção de UX)
4. **#3** Toast notifications (rápido, habilita feedback em todo o app)
5. **#1** PWA manifest + prompt de instalação (desbloqueia instalabilidade)
6. **#7** Atalhos de teclado (produtividade para power users)
7. **#5** CSS custom properties (redução de débito de manutenção)
8. **#8** Versionamento de cache do SW (confiabilidade offline)
9. **#6** Print view completo com índice de documentos (valor para processos administrativos)
10. **#10** Documentação de CSP headers (segurança no deploy)
11. **#14** Carregamento assíncrono de fontes (performance)
12. **#13** Badge "Novidades" (engajamento de usuários recorrentes)
13. **#12** Tags / categorias de documentos (preparação para crescimento)
14. **#15** Analytics leve (priorização baseada em dados)
15. **#11** Testes Playwright (rede de segurança contra regressões)

---

## Verificação

Após cada melhoria implementada:
- Testar fluxo completo: abrir maleta → clicar pasta → modal → botões → fechar → deep link
- Testar no mobile (DevTools responsive nos breakpoints 520px e 640px)
- Testar navegação por teclado (Tab, Enter, Escape, novos atalhos)
- Verificar `prefers-reduced-motion` em novas animações
- Para PWA: testar prompt de instalação no Chrome Android e Edge desktop
- Para print: Ctrl+P e verificar que o índice renderizado inclui todos os documentos
- Para OG tags: verificar preview em WhatsApp ou ferramenta de validação
- Rodar auditoria Lighthouse (PWA, Acessibilidade, Performance, SEO)
