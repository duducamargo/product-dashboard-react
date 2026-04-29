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

1. Configurar `QueryClientProvider`, `BrowserRouter` e `AuthProvider`.
2. Criar o service da DummyJSON para autenticacao e produtos.
3. Implementar as paginas de login, home, detalhes do produto e not found.
