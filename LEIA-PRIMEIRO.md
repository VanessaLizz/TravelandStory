# Leia primeiro

Este é o pacote completo do Atlas Social de Viagens. Ele não depende da pasta
anterior nem do ZIP de atualização.

## Começar no Windows e VS Code

1. Extraia o ZIP.
2. Abra a pasta `atlas-social-viagens-completo` no VS Code.
3. Abra um novo terminal do PowerShell nessa pasta.
4. Execute:

```powershell
npm install
npm run dev
```

5. Abra estas páginas:

- `http://localhost:3000/` — visão geral da comunidade;
- `http://localhost:3000/perfil` — dashboard pessoal.

## Conferir se a pasta foi aberta corretamente

No PowerShell, estes comandos devem retornar `True`:

```powershell
Test-Path .\components\GeneralDashboard.tsx
Test-Path .\components\ProfileDashboard.tsx
Test-Path .\data\demo.ts
Test-Path .\types\travel.ts
```

Se algum retornar `False`, o terminal está aberto na pasta errada ou o ZIP não
foi totalmente extraído.

## Criar o repositório local

Depois de conferir as duas telas:

```powershell
git init
git add .
git commit -m "feat: cria atlas visual com dashboards e mapa raspadinha"
```

A partir da próxima etapa, faremos alterações menores e você poderá criar um
microcommit ao final de cada uma. Consulte `ETAPAS-E-COMMITS.md`.
