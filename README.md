# Product Dashboard React

Aplicacao web em React para autenticacao, listagem, busca, filtragem e visualizacao de detalhes de produtos consumindo a API publica DummyJSON.

O projeto foi desenvolvido com foco nos criterios do teste tecnico: estrutura escalavel, consumo de API, gerenciamento de estado local e remoto, separacao de responsabilidades, legibilidade e boa experiencia de uso em desktop e mobile.

## Stack

- React + Vite
- TypeScript
- React Router DOM
- TanStack Query (React Query)
- Context API
- React Hook Form
- Zod
- Axios

## Como Executar

Instale as dependencias:

```bash
npm install
```

Execute em desenvolvimento:

```bash
npm run dev
```

Por padrao, a aplicacao usa a API publica da DummyJSON:

```txt
https://dummyjson.com
```

Para alterar a URL base da API, crie um arquivo `.env` seguindo o `.env.example`:

```env
VITE_API_BASE_URL=https://dummyjson.com
```

## Scripts

- `npm run dev`: inicia o projeto em modo desenvolvimento.
- `npm run build`: valida TypeScript e gera o build de producao.
- `npm run preview`: executa uma previa local do build.
- `npm run start`: serve o build gerado em `dist/`, respeitando a porta `PORT`.
- `npm run lint`: executa a analise estatica com ESLint.

## Deploy no Railway

O projeto esta preparado para deploy no Railway com Nixpacks.

Arquivos relevantes:

- `railway.json`: define os comandos de build e start.
- `scripts/serve.mjs`: servidor estatico em Node para servir o build de producao.

Comandos usados no Railway:

```bash
npm run build
npm run start
```

O servidor usa automaticamente a porta dinamica fornecida pelo Railway:

```txt
process.env.PORT
```

Se `PORT` nao estiver definido localmente, o fallback e `4173`.

## Login de Teste

A autenticacao consome os endpoints de autenticacao da DummyJSON.

```txt
usuario: emilys
senha: emilyspass
```

## Funcionalidades Implementadas

### Login (`/`)

- Formulario de login com usuario e senha.
- Validacao de formulario com React Hook Form e Zod.
- Integracao com o endpoint `/auth/login` da DummyJSON.
- Controle de sessao com token salvo no client.
- Persistencia de sessao no `localStorage`.
- Rota protegida para paginas autenticadas.
- Refresh token encapsulado no `authService` e exposto pelo `AuthProvider`.
- Token enviado automaticamente nas requisicoes via interceptor do Axios.
- Redirecionamento apos login para a rota originalmente solicitada, quando aplicavel.

### Home (`/home`)

- Listagem de produtos em grid responsivo.
- Cards com imagem, categoria, avaliacao, preco e link para detalhes.
- Hover com zoom suave apenas na imagem do produto.
- Filtro por nome do produto.
- Filtro por categoria.
- Filtro por faixa de preco.
- Busca com debounce.
- Sugestoes de produtos em combobox com imagem, nome, categoria e avaliacao.
- Busca no header em desktop.
- Busca reposicionada acima dos filtros em mobile.
- Produtos filtrados automaticamente enquanto o usuario digita.
- Painel de categorias retratil com animacao.
- Botao para limpar filtros.
- Paginacao com `limit` e `skip`.
- Paginacao responsiva com pagina ativa, setas e reticencias.
- Loading com skeleton.
- Estado de erro com acao para tentar novamente.
- Estado de sem resultados com ilustracao e botao para limpar filtros.
- Header compartilhado em `components/layout`.
- Header mobile fixo no topo.
- Menu de usuario com avatar generico e opcao de sair.
- Footer compartilhado.

### Detalhes do Produto (`/products/:id`)

- Requisicao do produto especifico seguindo o endpoint `/products/:id` da DummyJSON.
- Exibicao completa das informacoes relevantes do produto:
  - imagens;
  - titulo;
  - marca;
  - SKU;
  - preco;
  - desconto;
  - avaliacao;
  - estoque;
  - descricao;
  - garantia;
  - envio;
  - politica de devolucao;
  - pedido minimo;
  - peso;
  - dimensoes;
  - categoria;
  - tags;
  - codigo de barras;
  - avaliacoes dos usuarios.
- Galeria de imagens com miniaturas.
- Botao de compartilhar produto usando Web Share API quando disponivel e fallback copiando o link.
- Breadcrumb da pagina.
- Estado de loading.
- Estado de erro com acao para tentar novamente.
- Estado de produto nao encontrado.
- Error boundary especifico para evitar tela branca em erro de renderizacao.

### Not Found

- Pagina 404 para rotas inexistentes dentro da area autenticada.
- Layout consistente com a loja, usando header, busca e footer compartilhados.
- Acao para voltar ao catalogo.
- Produto inexistente tambem recebe tratamento de "produto nao encontrado" na tela de detalhes.

## Estados de Tela

### Home

- **Loading**: skeleton cards com `aria-busy` e `role="status"`.
- **Erro**: card visual com mensagem e botao `Tentar novamente`.
- **Sem resultados**: estado centralizado com ilustracao de produto/caixa e botao `Limpar filtros`.

### Detalhes do Produto

- **Loading**: skeleton da area de detalhes.
- **Erro**: mensagem dedicada com botao `Tentar novamente`.
- **Produto nao encontrado**: mensagem dedicada com acao para voltar ao catalogo.

### Rotas Inexistentes

- **404**: pagina dedicada para rota nao encontrada.

## Estrutura do Projeto

```txt
src/
|-- api/                 # Configuracao do cliente HTTP Axios
|-- assets/              # Assets estaticos, como o icone da marca
|-- components/          # Componentes reutilizaveis por dominio visual
|   |-- auth/            # Componentes da autenticacao
|   |-- home/            # Componentes especificos da Home
|   |-- layout/          # Layout compartilhado, header, footer e layout da loja
|   |-- product/         # Componentes reutilizaveis de produto
|   `-- product-details/ # Componentes da pagina de detalhes
|-- hooks/               # Hooks customizados
|-- pages/               # Paginas da aplicacao
|-- providers/           # Providers globais de auth e query
|-- routes/              # Rotas e paths centralizados
|-- schemas/             # Validacoes com Zod
|-- services/            # Chamadas organizadas por dominio
|-- styles/              # Estilos globais
|-- types/               # Tipagens compartilhadas
`-- utils/               # Funcoes utilitarias e formatadores
```

## Decisoes Tecnicas

### React Query para estado remoto

As chamadas de produtos e categorias ficam em hooks baseados em React Query. Isso centraliza cache, loading, erro, retry e revalidacao, evitando controle manual excessivo nas paginas.

Hooks principais:

- `useProducts`
- `useProduct`
- `useProductCategories`
- `useProductSuggestions`

### Context API para autenticacao

A autenticacao fica centralizada no `AuthProvider`, que expoe:

- usuario autenticado;
- status de autenticacao;
- `signIn`;
- `signOut`;
- `refreshSession`.

Essa decisao evita prop drilling e mantem o fluxo de sessao disponivel para rotas e componentes compartilhados.

### Services por dominio

As chamadas HTTP ficam isoladas em `services/`:

- `authService`: login e refresh token.
- `productService`: listagem, busca, categorias e detalhe do produto.

Isso reduz acoplamento entre UI e API e facilita manutencao caso os endpoints mudem.

### Axios centralizado

O cliente HTTP fica em `api/httpClient.ts`, com:

- `baseURL` configuravel por variavel de ambiente;
- header `Content-Type`;
- interceptor para anexar `Authorization: Bearer <token>` quando houver sessao.

### React Hook Form + Zod no login

O formulario de login usa React Hook Form para controle performatico do formulario e Zod para validacao declarativa dos campos. Isso deixa as regras de validacao isoladas em `schemas/loginSchema.ts`.

### Rotas protegidas

As paginas internas ficam dentro de `ProtectedRoute`. Se nao houver sessao autenticada, o usuario e redirecionado para `/`, preservando a rota originalmente solicitada para redirecionamento apos login.

### Paths centralizados

As rotas principais ficam em `routes/paths.ts`. Isso evita strings duplicadas como `/home` e `/products/:id` espalhadas pelo codigo.

### Layout compartilhado da loja

As paginas autenticadas usam `StorePageLayout`, que encapsula:

- `StoreHeader`;
- conteudo da pagina;
- `AppFooter`.

Com isso, Home, Detalhes e Not Found mantem consistencia visual e reduzem duplicacao de estrutura.

### Componentizacao por responsabilidade

A Home foi dividida em componentes menores:

- filtros;
- grid;
- cards;
- skeleton;
- paginacao;
- estados de tela;
- hero.

A tela de detalhes tambem foi dividida em:

- breadcrumb;
- galeria;
- painel de informacoes;
- especificacoes tecnicas;
- avaliacoes;
- estados;
- error boundary.

Essa separacao melhora leitura, manutencao e testabilidade futura.

### Filtros alinhados a DummyJSON

A DummyJSON oferece busca, categorias, `limit` e `skip`. O projeto usa esses recursos diretamente quando possivel. Para combinacoes que a API nao resolve completamente, como faixa de preco junto de alguns filtros, a aplicacao complementa a filtragem no frontend de forma controlada.

### Debounce na busca

As buscas usam `useDebounce` para evitar chamadas a cada tecla digitada. Isso reduz requisicoes desnecessarias e melhora a experiencia do usuario.

### Cache eficiente

React Query mantem cache das listas, categorias, sugestoes e detalhes de produto. Categorias possuem `staleTime` maior por serem dados menos volateis.

### UX responsiva

O layout foi pensado para desktop e mobile:

- grid com tres cards em telas grandes;
- layout empilhado em telas menores;
- busca no header em desktop;
- busca acima dos filtros no mobile;
- header fixo no mobile;
- paginacao adaptada para telas pequenas;
- estados visuais claros para loading, erro e vazio.

### Deploy simples

Como o projeto nao possui backend proprio, o build estatico e servido por `scripts/serve.mjs`. Esse servidor respeita `process.env.PORT`, o que facilita deploy no Railway.

## Criterios do Teste Atendidos

### Essencial

- Funcionalidades principais funcionando.
- Consumo da API DummyJSON.
- Login.
- Navegacao com React Router DOM.
- Home com listagem de produtos.
- Detalhes do produto.
- Not Found.

### Intermediario

- Codigo componentizado.
- Separacao entre pages, components, hooks, services, providers, routes, schemas, types e utils.
- Validacao com Zod.
- Formulario com React Hook Form.
- Tratamento de loading, erro e vazio.

### Avancado / Diferenciais Implementados

- Paginacao com `limit` e `skip`.
- Debounce na busca.
- Loading com skeleton.
- Hooks customizados.
- Cache com React Query.
- Layout responsivo.
- Error boundary na tela de detalhes.
- Header, footer e layout compartilhados.
- Deploy preparado para Railway.

## Observacoes

- A DummyJSON retorna nomes, descricoes e avaliacoes em ingles. A interface da aplicacao esta em portugues, mas os dados textuais dos produtos seguem o retorno original da API.
- Os precos sao numericos na API e foram formatados na interface com `Intl.NumberFormat`.
- Nao ha backend proprio; toda comunicacao e feita diretamente com a API publica.
- Testes automatizados nao foram adicionados nesta versao.
