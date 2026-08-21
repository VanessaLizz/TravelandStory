# Atlas Social de Viagens

Protótipo visual do front-end de uma rede social de viagens centrada em um atlas pessoal por cidade.

Nesta etapa, todos os dados são simulados. Ainda não existem autenticação, banco de dados nem chamadas a APIs externas.

## Requisitos

- Node.js 22.13 ou superior
- npm
- Git

## Como executar no VS Code

Este pacote é completo e independente. Não copie os arquivos sobre uma versão
anterior: basta extrair o ZIP e usar a pasta criada.

1. Extraia a pasta `atlas-social-viagens-completo` do ZIP.
2. Abra essa pasta no VS Code.
3. Abra o terminal integrado.
4. Instale as dependências:

```bash
npm install
```

5. Inicie o ambiente local:

```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000).

## Verificações antes de cada commit

```bash
npm run lint
npm run build
```

## Estrutura inicial

```text
atlas-social-viagens-completo/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── perfil/
│       └── page.tsx
├── components/
│   ├── AppHeader.tsx
│   ├── GeneralDashboard.tsx
│   ├── ProfileDashboard.tsx
│   └── ScratchWorldMap.tsx
├── data/
│   └── demo.ts
├── public/
│   ├── favicon.svg
│   └── og.png
├── scripts/
│   └── dev.mjs
├── types/
│   └── travel.ts
├── .env.example
├── .gitignore
├── LEIA-PRIMEIRO.md
├── ETAPAS-E-COMMITS.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Situação atual

- visão geral da comunidade em `/`;
- dashboard pessoal em `/perfil`;
- mapa raspadinha preto e dourado com cidades simuladas;
- zoom animado por cursor, foco e controles manuais;
- camadas de visitados, lista de desejos e comunidade;
- registro de lugares visitados sem criar viagem ou roteiro;
- quantidade de visitas avulsas, incluindo bate-voltas sem pernoite;
- soma automática quando o mesmo lugar é registrado novamente;
- intensidade pessoal por vínculo, número de visitas ou noites efetivas;
- painel contextual que muda conforme a cidade selecionada;
- gráficos de barras, linhas, áreas e pizza com tooltips;
- comparações entre visitas, desejos, retornos e recomendações locais;
- visão opcional de gastos pessoais por categoria;
- layout adaptado para telas menores.

Os registros criados pelo formulário ainda ficam apenas no estado do front-end e
são reiniciados ao atualizar a página. A persistência será adicionada na etapa
de banco de dados.

Consulte `LEIA-PRIMEIRO.md` para iniciar a nova pasta e
`ETAPAS-E-COMMITS.md` para o fluxo dos próximos microcommits.
