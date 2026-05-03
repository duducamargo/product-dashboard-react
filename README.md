# Product Dashboard React

Aplicacao frontend em React para login, listagem e gerenciamento visual de produtos consumindo a API publica DummyJSON.

## Stack

- React + Vite
- TypeScript
- React Router DOM
- TanStack Query (React Query)
- Context API
- React Hook Form
- Zod
- Axios

## Como executar

```bash
npm install
npm run dev
```

Por padrao, a aplicacao usa `https://dummyjson.com` como base da API. Para alterar a URL, crie um arquivo `.env` seguindo o `.env.example`.

```env
VITE_API_BASE_URL=https://dummyjson.com
```

## Scripts

- `npm run dev`: inicia o projeto em modo desenvolvimento.
- `npm run build`: valida TypeScript e gera o build de producao.
- `npm run preview`: executa uma previa local do build.
- `npm run lint`: executa a analise estatica com ESLint.

## Login de teste

A autenticacao consome a API da DummyJSON.

```txt
usuario: emilys
senha: emilyspass
```

## Funcionalidades

### Login (`/`)

- Formulario com usuario e senha.
- Validacao com React Hook Form e Zod.
- Fluxo de autenticacao integrado ao endpoint `/auth/login`.
- Persistencia de sessao no `localStorage`.
- Controle de rota autenticada.
- Refresh token isolado no service de autenticacao.
- Token enviado automaticamente via interceptor do Axios.

### Home (`/home`)

- Listagem de produtos em grid.
- Cards responsivos com imagem, categoria, avaliacao, preco e link para detalhes.
- Hover com zoom suave apenas na imagem do produto.
- Filtro por nome do produto.
- Busca com debounce.
- Sugestoes de produtos em formato de combobox com imagem, nome, categoria e avaliacao.
- No desktop, a busca fica no header.
- No mobile, a busca sai do header e fica acima dos filtros.
- Produtos sao filtrados automaticamente enquanto o usuario digita.
- Filtro por categoria em painel retratil.
- Filtro por faixa de preco.
- Botao para limpar filtros.
- Paginacao com `limit` e `skip`.
- Paginacao responsiva com pagina ativa, setas e reticencias.
- Loading com skeleton.
- Estado de erro com acao para tentar novamente.
- Estado de sem resultados com ilustracao e botao para limpar filtros.
- Header compartilhado em `components/layout`, preparado para reutilizacao em outras paginas.
- Header mobile fixo no topo.
- Menu de usuario com avatar generico e opcao de sair.
- Footer compartilhado reaproveitado da tela de login.

### Detalhes do Produto (`/products/:id`)

Funcionalidade prevista pelo teste para exibicao completa do produto, com tratamento de loading, erro e produto nao encontrado.

### Not Found

Funcionalidade prevista para rotas inexistentes e produtos nao encontrados.

## Estados de tela implementados na Home

- **Loading**: skeleton cards com `aria-busy` e `role="status"`.
- **Erro**: card visual com mensagem e botao `Tentar novamente`.
- **Sem resultados**: estado centralizado com ilustracao de produto/caixa e botao `Limpar filtros`.

## Estrutura

```txt
src/
├── api/          # Configuracao do cliente HTTP Axios
├── assets/       # Assets estaticos, como o icone da marca
├── components/   # Componentes reutilizaveis
│   ├── auth/     # Componentes da autenticacao
│   ├── home/     # Componentes especificos da Home
│   ├── layout/   # Layout compartilhado, header e footer
│   └── product/  # Componentes reutilizaveis de produto
├── hooks/        # Hooks customizados
├── pages/        # Paginas da aplicacao
├── providers/    # Providers globais de auth e query
├── routes/       # Configuracao de rotas
├── schemas/      # Validacoes com Zod
├── services/     # Chamadas organizadas por dominio
├── styles/       # Estilos globais
├── types/        # Tipagens compartilhadas
└── utils/        # Funcoes utilitarias
```

## Decisoes tecnicas

- **React Query para estado remoto**: cache, loading, erro e revalidacao ficam centralizados nos hooks de produtos.
- **Context API para autenticacao**: sessao e acoes de login, logout e refresh ficam no `AuthProvider`.
- **Services por dominio**: chamadas de auth e produtos ficam isoladas em `services/`.
- **Hooks customizados**: `useProducts`, `useProductCategories`, `useProductSuggestions`, `useAuth` e `useDebounce` reduzem acoplamento nas paginas.
- **Componentizacao da Home**: filtros, cards, grid, skeleton, paginacao, estados, hero e header foram separados em componentes.
- **Axios com interceptor**: o token autenticado e anexado automaticamente nas requisicoes.
- **UX mobile**: header fixo, busca reposicionada para a pagina, filtros empilhados e paginacao compacta.
- **Simplicidade sem overengineering**: filtros e adaptacoes respeitam as capacidades da DummyJSON, complementando no frontend apenas quando necessario.

## Criterios do teste atendidos

- Consumo correto da API DummyJSON.
- Navegacao com React Router DOM.
- Login com controle de sessao.
- Listagem de produtos.
- Busca, categoria e faixa de preco.
- Estados de loading, erro e sem resultados.
- Paginacao.
- Debounce na busca.
- Skeleton loading.
- Hooks customizados.
- Separacao por camadas.
- Cache eficiente com React Query.
- UX responsiva para desktop e mobile.

## Observacoes

- A DummyJSON retorna produtos em ingles e precos como numeros. A interface da aplicacao esta em portugues, mas os nomes e descricoes dos produtos seguem os dados originais da API.
- Nao ha backend proprio; toda comunicacao e feita diretamente com a API publica.
