# PokéCards

Projeto React Native do 1º bimestre da disciplina de Desenvolvimento Mobile (DSM, Fatec Franca "Dr. Thomaz Novelino").

**Aluno:** Mateus Gabriel Reis (projeto individual)

O PokéCards é um aplicativo em que o usuário se cadastra, faz login e monta uma coleção de cards de Pokémon com dados consumidos da [PokéAPI](https://pokeapi.co/). Cada card mostra imagem, nome, número, tipos e status, e pode ser aberto em uma tela de detalhes completa.

## Telas e funcionalidades

### 1. Login
* Campos **Usuário** (e-mail cadastrado) e **Senha**, com botão para mostrar ou ocultar a senha.
* **ENTRAR**: confere as credenciais salvas no aparelho e leva para a tela de cards.
* **CADASTRAR USUÁRIO**: abre a tela de cadastro.
* Se já existir uma sessão ativa (válida por 8 horas), o app abre direto na tela de cards.
* Após 5 tentativas erradas, o login fica bloqueado por 60 segundos.

### 2. Cadastrar usuário
* Campos **Nome, Telefone, CPF, E-mail, Curso**, além de **Senha** e **Confirmar senha** (necessárias para o login funcionar).
* Máscaras automáticas de telefone `(16) 99999-9999` e CPF `000.000.000-00`.
* Validações: nome completo, telefone com DDD, CPF com dígitos verificadores válidos, e-mail válido, senha de 8 a 64 caracteres, e-mail e CPF sem duplicidade.
* **SALVAR** grava o usuário localmente com AsyncStorage (no navegador, ele usa o `localStorage`) e volta para o Login.

### 3. Cards
* Campo para digitar o **nome ou número** do Pokémon (ex.: `pikachu`, `25`, `#006`).
* **ADD**: busca o Pokémon na PokéAPI e adiciona um card novo no topo da lista.
* Botão com **dado**: adiciona um Pokémon aleatório (entre os 1025 existentes) que ainda não está na coleção.
* Cada card exibe imagem oficial, número, nome, tipos (com a cor de cada tipo), HP, Ataque, Defesa, altura e peso.
* **VER MAIS DETALHES**: abre a tela de detalhes do card.
* **EXCLUIR**: remove o card após confirmação.
* Os cards ficam salvos por usuário, então cada pessoa cadastrada tem a sua própria coleção.
* Ícone de **sair** no cabeçalho encerra a sessão.

### 4. Mais detalhes do card
* Imagem grande, com botão para alternar entre a versão normal e a **shiny**.
* Categoria, descrição da Pokédex, altura, peso, experiência base, taxa de captura, habitat, geração, raridade (comum, lendário ou mítico) e total de status.
* Barras com os 6 status base (HP, Ataque, Defesa, Ataque especial, Defesa especial e Velocidade).
* Habilidades (as ocultas aparecem com um ícone de olho cortado).
* **Linha evolutiva** com imagens. Tocar em uma evolução abre os detalhes dela.
* Alguns golpes que o Pokémon aprende.

## API utilizada: PokéAPI

API pública, gratuita e sem chave de acesso. URL base: `https://pokeapi.co/api/v2`

| Endpoint | Onde é usado | Dados aproveitados |
| --- | --- | --- |
| `GET /pokemon/{nome ou id}` | Botão ADD e tela de detalhes | id, nome, imagens, tipos, status, altura, peso, habilidades, golpes, experiência base |
| `GET /pokemon-species/{id}` | Tela de detalhes | categoria, descrição, habitat, geração, lendário/mítico, taxa de captura, link da cadeia evolutiva |
| `GET /evolution-chain/{id}` | Tela de detalhes | linha evolutiva |

As imagens vêm do repositório oficial de sprites da PokéAPI (`official-artwork`). A descrição e a categoria são exibidas em português quando a PokéAPI tiver o texto nesse idioma; caso contrário, aparecem em inglês.

Observação: a SpaceX API (`api.spacexdata.com`), que também está na lista sugerida, foi testada e está fora do ar (erro 525 em todas as rotas, repositório oficial arquivado desde 2024). Por isso a escolha foi a PokéAPI.

## Tecnologias

* [Expo](https://expo.dev/) SDK 57 com React Native 0.86 e React 19
* React Navigation (Stack) para a navegação entre as telas
* AsyncStorage para persistir usuários, sessão e cards
* Axios para consumir a PokéAPI
* styled-components para os estilos
* @expo/vector-icons (MaterialIcons e MaterialCommunityIcons)
* bcryptjs com expo-crypto para guardar a senha como hash

## Como executar

Pré-requisitos: [Node.js](https://nodejs.org/) 20 ou superior e o aplicativo **Expo Go** instalado no celular (Android ou iOS).

```bash
git clone https://github.com/magreisz/pokecards-react-native.git
cd pokecards-react-native
npm install
npx expo start
```

1. O terminal vai mostrar um **QR Code**.
2. No Android, abra o **Expo Go** e toque em "Scan QR code". No iPhone, use a câmera.
3. O celular e o computador precisam estar na **mesma rede Wi-Fi**. Se a rede bloquear a conexão (comum em redes de faculdade), rode `npx expo start --tunnel`.

Também é possível rodar no navegador com `npx expo start --web` ou pressionando `w` no terminal do Expo.

### Roteiro rápido para testar

1. Na tela de Login, toque em **CADASTRAR USUÁRIO** e preencha os dados.
2. Toque em **SALVAR**. O app volta para o Login.
3. Entre com o e-mail e a senha cadastrados.
4. Digite `pikachu` e toque em **ADD**, ou use o dado para sortear.
5. Toque em **VER MAIS DETALHES** para ver a tela completa ou em **EXCLUIR** para remover o card.

## Estrutura do projeto

```
pokecards/
├── App.js                   NavigationContainer e providers
├── index.js                 registro do componente raiz
├── app.json                 configuração do Expo
├── metro.config.js          ajuste do bundler para o bcryptjs
└── src/
    ├── routes.js            pilha de telas e estilo do cabeçalho
    ├── theme.js             cores, tipos traduzidos e formatações
    ├── components/
    │   ├── Botao.js         botão com variantes e estado de carregamento
    │   ├── Campo.js         campo com rótulo, ícone, erro e mostrar senha
    │   └── TipoBadge.js     selo colorido do tipo do Pokémon
    ├── pages/
    │   ├── Login.js
    │   ├── Cadastro.js
    │   ├── Cards.js
    │   └── Detalhes.js
    ├── services/
    │   ├── api.js           cliente Axios e funções da PokéAPI
    │   ├── storage.js       leitura e gravação no AsyncStorage
    │   └── senha.js         hash e conferência de senha
    └── utils/
        ├── validacao.js     máscaras e validação do cadastro
        └── mensagens.js     alertas e confirmações (celular e web)
```

## Como o código funciona

* **Navegação** (`src/routes.js`): quatro telas em uma Stack (`login`, `cadastro`, `cards`, `detalhes`). Login e Cards não mostram botão de voltar; ao entrar ou sair, a pilha é reiniciada com `navigation.reset` para o usuário não voltar para uma tela protegida.
* **Armazenamento** (`src/services/storage.js`): as chaves usam o prefixo `@pokecards:`. `usuarios` guarda a lista de cadastros, `sessao` guarda o e-mail logado e o horário de entrada, `tentativas` controla o bloqueio do login e `cards:<email>` guarda a coleção de cada usuário.
* **Senha** (`src/services/senha.js`): a senha nunca é salva em texto puro. O cadastro gera um hash bcrypt (custo 10) e o login compara a senha digitada com esse hash. O `metro.config.js` resolve o módulo `crypto` como vazio porque o bcryptjs tenta importar o `crypto` do Node, que não existe no celular; no lugar dele, os bytes aleatórios vêm do `expo-crypto`.
* **PokéAPI** (`src/services/api.js`): `buscarPokemon` aceita nome ou número e devolve só os campos usados no card. `buscarDetalhes` faz as chamadas de Pokémon, espécie e cadeia evolutiva e monta um objeto pronto para a tela de detalhes.
* **Tratamento de erros**: Pokémon inexistente mostra "Não encontrado", falha de rede mostra aviso de conexão e a tela de detalhes tem botão "Tentar novamente". Os botões ficam desabilitados com indicador de carregamento enquanto a requisição está em andamento, evitando cards duplicados por clique repetido.

## Privacidade

Os dados do cadastro (incluindo CPF e telefone) ficam apenas no armazenamento local do aparelho e não são enviados para nenhum servidor. A única comunicação externa do app é com a PokéAPI, e ela recebe somente o nome ou número do Pokémon pesquisado.
