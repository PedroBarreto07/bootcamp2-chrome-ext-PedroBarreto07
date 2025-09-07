# Extensao_Google: 
# FocusFox — Pomodoro & Highlighter (MV3)
## Links importantes
- Repositório: https://github.com/PedroBarreto07/bootcamp2-chrome-ext-PedroBarreto07
- GitHub Pages: https://PedroBarreto07.github.io/bootcamp2-chrome-ext-PedroBarreto07/
- Release (.zip): https://github.com/PedroBarreto07/bootcamp2-chrome-ext-PedroBarreto07/releases/latest


Uma extensão **Manifest V3** minimalista para o Chrome: Pomodoro com badge no ícone e um content script opcional que destaca links em `developer.chrome.com`. O objetivo é praticar MV3 com **popup + background (service worker)**, **storage**, **alarms**, **opções**, **permissões mínimas** e **GitHub Pages** como landing page.

> Compatível com **Chrome 114+**. Não há dependências nativas/Node no runtime da extensão.

## 🎯 Objetivos do Projeto
- Entregar um **popup funcional** (UI simples) e um **service worker** com eventos (alarms, storage, runtime).
- Aplicar **princípio do menor privilégio** em `permissions`.
- Opcional: **content script** injetado em um domínio específico.
- Publicar **landing page** no GitHub Pages (versão web do popup).
- Preparar **.zip** (Release) e documentação clara.

## 🗂️ Estrutura
```
focusfox-chrome-extension/
├─ src/
│  ├─ popup/
│  │  ├─ popup.html
│  │  ├─ popup.js
│  │  └─ popup.css
│  ├─ content/
│  │  └─ content.js
│  ├─ background/
│  │  └─ service-worker.js
│  ├─ options/
│  │  ├─ options.html
│  │  └─ options.js
│  ├─ assets/
│  │  └─ logo.svg
│  └─ styles/
│     └─ global.css
├─ icons/
│  ├─ icon16.png
│  ├─ icon32.png
│  ├─ icon48.png
│  └─ icon128.png
├─ docs/                # GitHub Pages (Settings → Pages → /docs)
│  └─ index.html
├─ manifest.json
├─ README.md
└─ LICENSE
```

## 🔧 Instalação (local, modo desenvolvedor)
1. Baixe a Release `.zip` (ou use o botão **Code → Download ZIP**).
2. Acesse `chrome://extensions` e ative **Developer mode**.
3. Clique em **Load unpacked** e selecione a pasta descompactada.
4. Clique no ícone da extensão para abrir o popup.

## 🚦 Uso
- **Iniciar**: começa um ciclo de foco. O background arma um `alarm` para o fim do período e atualiza o **badge** por minuto.
- **Pausar**: pausa o ciclo atual (mantém o restante).
- **Resetar**: limpa estado e badge.
- **Opções**: ajuste **work/break** e ative/desative o content script.

> Nota técnica: em MV3 o service worker pode hibernar; por isso o badge é atualizado **por minuto** via `chrome.alarms` em vez de por segundo.

## 🔐 Permissões
- `storage`: salvar preferências e estado.
- `alarms`: disparo de eventos no fim do período e “tick” por minuto.
- _(sem `tabs` e sem `host_permissions`)_: o content script é carregado apenas via `content_scripts` no domínio especificado.

## 🧪 Testes rápidos
- Abra o popup e inicie um ciclo. Verifique o **badge** com contagem em minutos.
- Acesse `https://developer.chrome.com/` e veja os **links destacados** (se habilitado em Opções).
- Confira o log do service worker em `chrome://extensions → Service Worker (Inspect)`.

## 🌐 GitHub Pages
Publicação recomendada: **Settings → Pages → Branch: `main` | Folder: `/docs`**.  
A página `docs/index.html` contém uma **demo web** do popup + instruções e link para a Release.

## 🧱 Padrão do Repositório
- Nome sugerido: `bootcamp2-chrome-ext-<seu-usuario>`
- Branch principal: `main`
- `.gitignore`: inclua entradas comuns (ex.: `**/.DS_Store`)
- Crie uma **Release** com o `.zip` da pasta da extensão.

## 📜 Licença
[MIT](./LICENSE)
