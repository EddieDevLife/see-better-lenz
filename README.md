# Lenz — Acessibilidade Visual para a Web

> Perfis visuais para daltônicos e pessoas autistas. Sem coleta de dados. Sem servidor. Open source.

![Lenz preview](docs/preview.png)

---

## O que é

Lenz é uma extensão para Chrome/Edge/Brave que aplica perfis de acessibilidade visual em qualquer site. Diferente dos filtros genéricos, usa matrizes SVG baseadas em pesquisa clínica (Brettel 1997, Viénot 1999) e modos de baixa estimulação desenvolvidos com feedback de pessoas autistas.

## Perfis disponíveis

| Perfil | Grupo | Descrição |
|--------|-------|-----------|
| Deuteranopia | Daltonismo | Correção para deficiência de cones M (vermelho-verde) |
| Protanopia | Daltonismo | Compensação para baixa percepção de vermelho |
| Tritanopia | Daltonismo | Reforço do eixo azul-amarelo (cones S) |
| Baixa estimulação | Autismo | Reduz saturação, pausa animações, suaviza neons |
| Leitura calma | Autismo | Fundo creme, tipografia escura, sem distrações |
| Alto contraste | Contraste | Preto / branco / amarelo — útil para baixa visão |
| Cores invertidas | Contraste | Inversão inteligente que preserva fotos |
| Simulação (×3) | Designers | Simula como daltônicos enxergam — para design inclusivo |

## Por que não é só mais um filtro

**Matrizes corretas** — a maioria usa `hue-rotate()`, que distorce sem corrigir. Lenz usa matrizes SVG no espaço linearRGB.

**Memória por site** — configure alto contraste no Gmail e leitura calma na Wikipédia. O Lenz lembra, por domínio, sem login nem nuvem.

**Feito com a comunidade** — o modo "baixa estimulação" pausa autoplay, animações e reduz áreas de alto brilho que causam sobrecarga sensorial.

## Instalação (modo desenvolvedor)

1. Baixe e extraia o `.zip` deste repositório (ou clone)
2. Abra `chrome://extensions` no navegador
3. Ative **Modo do desenvolvedor** (toggle no canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta `lenz/` extraída
6. Clique no ícone do Lenz na barra e escolha um perfil

## Estrutura do projeto

```
lenz/
├── manifest.json       # Manifest V3
├── background.js       # Service worker — inicializa storage
├── content.js          # Injeta filtros e CSS em todas as páginas
├── filters.svg         # Matrizes SVG (Brettel/Viénot) para correção clínica
├── popup.html          # Interface do popup
├── popup.js            # Lógica do popup
├── popup.css           # Estilos do popup
├── icons/
│   └── icon.png
└── docs/
    └── index.html      # Landing page (GitHub Pages)
```

## Contribuindo

Sugestões e PRs são bem-vindos — especialmente:
- Feedback de pessoas autistas ou daltônicas sobre os perfis
- Novos modos de acessibilidade
- Suporte a Firefox (WebExtensions API é quase idêntica)
- Testes em sistemas de design específicos (Material, Fluent, etc.)

Abra uma issue antes de um PR grande para alinharmos a direção.

## Licença

MIT — use, modifique, distribua. Só não venda como produto fechado sem créditos.

---

Feito com ♥ por [@eddiedevlife](https://www.linkedin.com/in/eddiedevlife) · Sem fins lucrativos · Código aberto para sempre.
