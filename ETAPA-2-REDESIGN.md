# Referência do redesign da interface

O ZIP atual já contém o projeto completo com este redesign. Este documento é
somente o registro das mudanças visuais; não é necessário ter nem recuperar a
pasta antiga. Os dados ainda são demonstrativos.

## O que foi alterado

- nova identidade visual inspirada no dashboard do projeto `LIBRARY`;
- mapa preto e dourado inspirado em mapas-múndi de raspar;
- cidades visitadas aparecem como áreas coloridas reveladas;
- cidades desejadas aparecem com contorno, sem preenchimento;
- aproximação animada ao passar o cursor ou focar uma cidade;
- botões de zoom manual e redefinição;
- seleção de cidade atualiza o painel lateral;
- nova rota `/` com a visão geral da comunidade;
- nova rota `/perfil` com o mapa e os gráficos pessoais;
- gráficos com barras, linhas, áreas, pizza, legendas e tooltips;
- dados de moradores separados das experiências de viajantes;
- bloco pessoal de gastos por categoria;
- indicação de noites efetivas, descontando deslocamentos da cidade-base.

## Como executar o pacote completo

1. Pare o servidor com `Ctrl + C`.
2. Extraia a pasta do ZIP em um local de sua escolha.
3. Abra a pasta extraída no VS Code.
4. Instale as dependências:

```bash
npm install
```

5. Inicie novamente:

```bash
npm run dev
```

6. Teste as duas páginas:

- `http://localhost:3000/`
- `http://localhost:3000/perfil`

## Primeiro commit da nova base

```bash
git init
git add .
git commit -m "feat: cria atlas visual com dashboards e mapa raspadinha"
```

## Validação antes de enviar ao GitHub

```bash
npm run lint
npm run build
git status
git push
```

Nas etapas seguintes, use os microcommits descritos em `ETAPAS-E-COMMITS.md` e
revise `git diff --staged` antes de confirmar cada commit.
