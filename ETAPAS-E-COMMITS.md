# Etapas e microcommits

Você executará os commits. As mensagens abaixo são sugestões e podem ser alteradas.

## Etapa 1 — Protótipo visual

O pacote recebido já representa esta etapa completa. Para iniciar o repositório:

```bash
git init
git add .
git commit -m "feat: cria prototipo visual do atlas de viagens"
```

## Microetapa atual — Visitas sem viagem

O front permite registrar lugares antigos e bate-voltas sem criar viagem:

1. formulário de registro avulso;
2. quantidade de vezes que o lugar foi visitado;
3. separação entre passeio de um dia, pernoite e estadia;
4. soma de visitas repetidas sem duplicar o lugar;
5. contagem independente que não altera o total de viagens.

Microcommit sugerido:

```bash
git commit -m "feat: permite registrar visitas sem criar viagem"
```

## Próxima etapa — Pesquisa geográfica real

1. `feat: cria contrato do servico de cidades`
2. `feat: adiciona busca de cidades com dados simulados`
3. `feat: conecta busca a api geografica`
4. `fix: normaliza cidades e evita duplicidades`

## Etapa 4 — Banco e autenticação

1. `chore: configura variaveis do banco`
2. `feat: adiciona autenticacao de usuario`
3. `feat: persiste cidades visitadas e desejadas`
4. `feat: registra multiplas visitas por cidade`
5. `feat: calcula noites efetivas entre cidades base e deslocamentos`

## Etapa 5 — Diário e gastos

1. `feat: cria registro opcional de diario`
2. `feat: adiciona categorias de gastos`
3. `feat: calcula medias pessoais de viagem`
4. `feat: prepara agregados anonimos da comunidade`

## Fluxo para as próximas alterações

Ao final de cada microetapa:

```bash
git status
git diff
npm run lint
npm run build
git add <arquivos-da-microetapa>
git commit -m "mensagem do microcommit"
git push
```

Não use `git add .` nos próximos microcommits. Adicione somente os arquivos relacionados à mudança revisada.
