# Product Dashboard React

Base inicial para o teste tecnico frontend em React, preparada para evoluir com a API publica DummyJSON.

## Stack planejada

- React + Vite
- TypeScript
- React Router DOM
- TanStack Query
- Context API
- React Hook Form
- Zod
- Axios

## Como executar

```bash
npm install
npm run dev
```

Caso precise alterar a URL da API, crie um `.env` com base no `.env.example`.

## Login de teste

A autenticacao usa a API publica da DummyJSON.

Credenciais validas para desenvolvimento:

```txt
usuario: emilys
senha: emilyspass
```

## Cadastro

A rota `/register` usa `POST /users/add` da DummyJSON para simular a criacao de um usuario.

Importante: a DummyJSON retorna o usuario criado com um novo `id`, mas nao persiste esse usuario no servidor e nao gera uma sessao autenticada automaticamente. Por isso, a aplicacao salva a conta criada no `localStorage` e gera um token local para permitir acesso as rotas protegidas da propria aplicacao.

## Scripts

- `npm run dev`: inicia o projeto em modo desenvolvimento.
- `npm run build`: valida TypeScript e gera build de producao.
- `npm run preview`: executa uma previa do build.
- `npm run lint`: executa a analise estatica com ESLint.

## Estrutura inicial

```txt
src/
├── api/          # Configuracao de cliente HTTP e interceptors
├── components/   # Componentes reutilizaveis
├── hooks/        # Hooks customizados
├── pages/        # Paginas da aplicacao
├── providers/    # Providers globais, como auth e query
├── routes/       # Configuracao de rotas
├── schemas/      # Schemas e validacoes com Zod
├── services/     # Chamadas organizadas por dominio
├── styles/       # Estilos globais
├── types/        # Tipagens compartilhadas
└── utils/        # Funcoes utilitarias
```

## Proximos passos

1. Implementar a listagem de produtos na rota `/home`.
2. Criar filtros por nome, categoria e faixa de preco.
3. Implementar a pagina de detalhes do produto em `/products/:id`.

## Decisoes tecnicas iniciais

- O login usa React Hook Form com Zod para validacao do formulario.
- O cadastro tambem usa React Hook Form com Zod e consome `/users/add`.
- Contas criadas via cadastro podem acessar a aplicacao com token local.
- A sessao autenticada fica centralizada no `AuthProvider`.
- Os tokens retornados pela DummyJSON sao persistidos no `localStorage`.
- O `accessToken` e enviado automaticamente pelo interceptor do Axios.
- A renovacao de sessao foi isolada no service de auth usando `/auth/refresh`.
