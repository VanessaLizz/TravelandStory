# Microetapa — Visitas avulsas

Esta mudança permite registrar um lugar visitado sem criar uma viagem, roteiro
ou período completo de férias.

Exemplo contemplado pelo protótipo:

- lugar: Taíba;
- município de referência: São Gonçalo do Amarante;
- quantidade: 2 visitas;
- tipo: passeio de um dia;
- noites: 0;
- viagem vinculada: nenhuma.

## Comportamento implementado

- o botão `Registrar lugar visitado` abre o formulário rápido;
- o usuário informa quantas vezes esteve no lugar;
- data ou período são opcionais;
- é possível marcar passeio de um dia, pernoite ou estadia/base;
- o registro recebe `tripId: null` e não aumenta o total de viagens;
- se o mesmo lugar e município forem cadastrados outra vez, as visitas são
  somadas em vez de gerar uma duplicidade;
- o botão `Somar 1 visita` registra rapidamente um retorno;
- a lista mostra separadamente lugares, visitas avulsas, noites e viagens
  criadas.

## Como aplicar os arquivos

1. Pare o servidor com `Ctrl + C`.
2. Copie o conteúdo da pasta de atualização para a raiz do seu projeto.
3. Mantenha as pastas `app`, `components`, `data` e `types` na raiz.
4. Confirme a substituição dos arquivos existentes.
5. Execute:

```powershell
npm run dev
```

Nenhuma dependência nova foi adicionada, portanto não é necessário executar
`npm install` novamente.

## Teste manual

1. Acesse `http://localhost:3000/perfil`.
2. Clique em `Registrar lugar visitado`.
3. Cadastre Taíba, São Gonçalo do Amarante, Ceará, Brasil.
4. Informe 2 visitas e selecione `Passeio de um dia`.
5. Salve e confirme que aparecem 2 visitas, 0 noites e nenhuma viagem criada.
6. Cadastre novamente o mesmo lugar com mais 1 visita.
7. Confirme que o registro existente passa para 3 visitas, sem duplicar Taíba.

Nesta etapa os dados são temporários e reiniciam quando a página é atualizada.
Isso será alterado quando conectarmos o banco de dados.

## Microcommit

Depois de testar:

```powershell
git status
npm run lint
npm run build
git add app/globals.css components/ProfileDashboard.tsx components/StandaloneVisitModal.tsx data/demo.ts types/travel.ts README.md ETAPAS-E-COMMITS.md MICROETAPA-VISITAS-AVULSAS.md
git diff --staged
git commit -m "feat: permite registrar visitas sem criar viagem"
```
