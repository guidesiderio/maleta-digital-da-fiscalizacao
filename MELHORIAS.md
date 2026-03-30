# Plano de Melhorias — Maleta Digital da Fiscalização

## Contexto

O site é um portal estático institucional da UFPI para fiscais e gestores de contratos acessarem legislação, manuais, portarias e modelos. O público principal são servidores públicos que precisam localizar documentos normativos rapidamente no dia a dia da fiscalização contratual. As melhorias abaixo foram priorizadas pelo valor real que entregam a esse público específico.

---

## TIER 1 — Alto Impacto, Baixo Esforço

### 1. ~~Remover dependência do Google Docs Viewer~~ (IMPLEMENTADO)

**Por quê**: O botão "Visualizar" usa `docs.google.com/viewer`, que falha em redes institucionais que bloqueiam Google, adiciona latência desnecessária e é uma dependência externa em um site governamental. Todos os navegadores modernos já possuem visualizador de PDF nativo.

**O quê**: Trocar `getViewerUrl(doc.file)` por link direto ao arquivo PDF (`target="_blank"`). Remover a função `getViewerUrl()`.

**Arquivos**: `script.js`

---

### 2. ~~Tratar pastas vazias com contexto~~ (IMPLEMENTADO)

**Por quê**: "Procedimentos" e "Modelos de Documento" aparecem com "0 docs" e modal vazio, sem indicar se é intencional. "Modelos de Documento" é justamente o que fiscais mais precisam — mostrar vazio sem explicação frustra.

**O quê**:
- Adicionar campo opcional `placeholder` em `data.js` com mensagem contextualizada (ex: "Em elaboração pela equipe do DFC")
- Renderizar selo "Em breve" (Space Grotesk, estilo stamped metadata do DESIGN.md) na pasta
- Exibir a mensagem de placeholder no modal em vez do genérico
- Reduzir levemente a opacidade de pastas vazias (0.7)

**Arquivos**: `data.js`, `script.js`, `style.css`

---

### 3. ~~Corrigir data do footer e adicionar link da LAI~~ (IMPLEMENTADO)

**Por quê**: O footer mostra "Última atualização: {data de hoje}" via `new Date()`, o que é enganoso — sugere que o conteúdo foi atualizado hoje. A referência à LAI (Lei 12.527/2011) não é clicável, o que é uma falha funcional em um portal de transparência governamental.

**O quê**:
- Adicionar constante `LAST_UPDATED` em `data.js` com a data real da última atualização de conteúdo
- Tornar a menção à LAI um link para a legislação no planalto.gov.br ou para a página SIC da UFPI

**Arquivos**: `data.js`, `script.js`

---

### 4. Deep linking via URL hash

**Por quê**: Fiscais frequentemente precisam compartilhar documentos específicos por e-mail ou WhatsApp ("veja a Resolução CAD 186/2025"). Hoje, todo link leva à maleta fechada — o destinatário precisa abrir e navegar manualmente.

**O quê**:
- Ler `window.location.hash` no carregamento (ex: `#pasta-2`, `#pasta-2/doc-1`)
- Se hash presente, auto-abrir a maleta e o modal correspondente
- Atualizar o hash via `history.replaceState` ao abrir cada pasta
- Adicionar botão "Copiar link" (ícone de corrente, estilo ghost button) em cada documento no modal
- Escutar `hashchange` para back/forward do navegador

**Arquivos**: `script.js`

---

## TIER 2 — Impacto Médio, Esforço Médio

### 5. Metadados dos documentos

**Por quê**: Fiscais precisam saber se o documento que têm é a versão atual. Sem data de publicação ou tamanho do arquivo, não há como saber se é necessário baixar novamente.

**O quê**:
- Estender objetos em `data.js` com campos opcionais: `date` (data de inclusão/atualização), `size` (tamanho aproximado)
- Renderizar como "stamped metadata" (Space Grotesk, uppercase, rotação sutil de 2° conforme DESIGN.md §5) abaixo da descrição de cada documento
- `tags` pode ser adicionado já para uso futuro na busca

**Arquivos**: `data.js`, `script.js`, `style.css`

---

### 6. Busca / filtro rápido

**Por quê**: Com o crescimento do acervo (pastas vazias serão populadas, legislação acumula mais atos normativos), localizar "IN 05/2017" entre 15+ documentos exige abrir cada pasta. Quem sabe o que procura não deveria precisar lembrar em qual pasta está.

**O quê**:
- Campo de busca acima das pastas (visível com maleta aberta), estilizado conforme DESIGN.md §5 "Input Fields" (sem borda, apenas bottom border ghost)
- Filtro em tempo real via `includes()` em `doc.title` e `doc.description`, com normalização de acentos (`normalize('NFD').replace(...)`)
- Pastas sem match ficam esmaecidas; se apenas uma pasta tem match, abre o modal automaticamente com documentos correspondentes destacados
- Placeholder: "Buscar documento..." (Space Grotesk)

**Arquivos**: `index.html` ou `script.js` (criação dinâmica), `script.js`, `style.css`

---

### 7. Acessibilidade (eMAG compliance)

**Por quê**: Sites governamentais brasileiros devem seguir o eMAG (Modelo de Acessibilidade em Governo Eletrônico), baseado na WCAG 2.0 AA. Faltam: skip link, focus trap no modal, anúncios via `aria-live`.

**O quê**:
- Skip link no topo: `<a href="#base" class="skip-link">Ir para o conteúdo</a>` (visível apenas no focus)
- Focus trap no modal (Tab cicla entre botão fechar e links de documentos)
- `aria-live="polite"` para anunciar mudanças de estado ("Maleta aberta", "Pasta X: N documentos")
- `role="main"` no `.wrap`

**Arquivos**: `index.html`, `script.js`, `style.css`

---

## TIER 3 — Melhorias Futuras

### 8. Auto-abrir em visitas recorrentes

Salvar estado em `sessionStorage` para pular a animação de abertura em visitas subsequentes na mesma sessão. Baixo esforço (~10 linhas em `script.js`).

### 9. Visualização para impressão

`@media print` que esconde a UI da maleta e renderiza um índice limpo de todas as pastas e documentos — útil para anexar a processos administrativos físicos. Médio esforço (~60 linhas em `style.css`).

### 10. Service Worker para acesso offline

Cache dos PDFs para uso em locais com conectividade ruim (inspeções de campo). Alto esforço (novo arquivo `sw.js`, estratégia de invalidação de cache). Recomendado apenas após o acervo estar mais completo.

---

## Ordem de Implementação Recomendada

1. ~~**#1** Remover Google Docs Viewer~~ (FEITO)
2. ~~**#2** Pastas vazias com placeholder~~ (FEITO)
3. ~~**#3** Footer: data real + link LAI~~ (FEITO)
4. **#4** Deep linking via hash
5. **#5** Metadados dos documentos
6. **#8** Auto-abrir em revisitas
7. **#7** Acessibilidade eMAG
8. **#6** Busca/filtro
9. **#9** Print view
10. **#10** Service Worker

---

## Verificação

Após cada melhoria implementada:
- Abrir `index.html` no navegador e testar o fluxo completo (abrir maleta → clicar pasta → modal → botões)
- Testar no mobile (DevTools responsive ou dispositivo real) nos breakpoints 520px e 640px
- Testar navegação por teclado (Tab, Enter, Escape)
- Verificar `prefers-reduced-motion` nas animações afetadas
- Para deep linking: testar carregamento direto com hash na URL
