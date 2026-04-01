# Guia de Deploy — Maleta Digital da Fiscalização

Este documento descreve os **headers HTTP de segurança** recomendados para o deploy em produção, seguindo boas práticas para sites governamentais brasileiros.

---

## Headers de Segurança Recomendados

### Content-Security-Policy (CSP)

A CSP restringe quais recursos (scripts, estilos, fontes, imagens) o navegador pode carregar, mitigando ataques XSS e injeção de conteúdo.

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

**Detalhamento das diretivas:**

| Diretiva | Valor | Motivo |
|---|---|---|
| `default-src` | `'self'` | Bloqueia recursos de origens externas por padrão |
| `script-src` | `'self'` | Apenas scripts locais (nenhum CDN externo) |
| `style-src` | `'self' https://fonts.googleapis.com` | CSS local + Google Fonts (carregado via `<link>` assíncrono) |
| `font-src` | `'self' https://fonts.gstatic.com` | Arquivos de fonte servidos pelo Google Fonts |
| `img-src` | `'self' data:` | Imagens locais + data URIs (favicons inline) |
| `connect-src` | `'self'` | Apenas requisições à própria origem (Service Worker) |
| `frame-ancestors` | `'none'` | Impede que o site seja embutido em iframes (clickjacking) |
| `base-uri` | `'self'` | Previne manipulação do elemento `<base>` |
| `form-action` | `'self'` | Formulários só podem enviar para a própria origem |

> **Nota:** As fontes Google são carregadas via `<link>` assíncrono no `index.html` (melhoria #14), eliminando a necessidade de `'unsafe-inline'` no `style-src`.

### Outros Headers

| Header | Valor | Finalidade |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Impede MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Proteção contra clickjacking (fallback para navegadores antigos) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limita informações do Referer em requisições cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Desabilita APIs de hardware não utilizadas |
| `X-XSS-Protection` | `0` | Desativa filtro XSS do navegador (depreciado; CSP é suficiente) |

---

## Configuração por Plataforma

### Apache (`.htaccess`)

Comum em servidores da UFPI e outros órgãos públicos.

```apacheconf
# ─── Headers de Segurança ───────────────────────────────────────────────────
<IfModule mod_headers.c>
    Header set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    Header set X-XSS-Protection "0"
</IfModule>

# ─── Cache para assets estáticos ────────────────────────────────────────────
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 week"
    ExpiresByType application/json "access plus 1 day"
</IfModule>

# ─── Compressão ─────────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

### Netlify (`_headers`)

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-XSS-Protection: 0
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### Cloudflare Pages (`_headers`)

O formato é idêntico ao do Netlify — utilize o mesmo arquivo `_headers` acima.

### GitHub Pages

GitHub Pages não suporta headers HTTP customizados. Utilize a meta tag CSP como fallback:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">
```

> **Limitação:** A meta tag CSP não suporta `frame-ancestors` e `report-uri`. Para proteção completa, prefira plataformas que permitam headers HTTP.

---

## Verificação

Após o deploy, valide os headers utilizando:

1. **DevTools do navegador** — aba Network → clique na requisição do `index.html` → Response Headers
2. **SecurityHeaders.com** — analisa e pontua os headers de segurança do site
3. **Lighthouse** — auditoria integrada do Chrome (aba Security e Best Practices)

### Checklist de Validação

- [ ] `Content-Security-Policy` presente e Google Fonts funcionando
- [ ] `X-Content-Type-Options: nosniff` presente
- [ ] `X-Frame-Options: DENY` presente
- [ ] `Referrer-Policy` presente
- [ ] Site não carrega dentro de iframe externo
- [ ] Service Worker registra e funciona normalmente com a CSP
- [ ] PDFs abrem corretamente (não bloqueados pela CSP)
