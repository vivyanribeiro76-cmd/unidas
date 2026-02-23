# FZ.IA - Dashboard Duplicado

Projeto duplicado do FZ.IA (ai-assistant-admin) com as seguintes modificações:
- **Removido**: Botão e página de "Configurações"
- **Mantido**: Login/Senha, Dashboard, Alterar Senha
- **Tabela Supabase**: `assistant_settings_duplicado` (ao invés de `assistant_settings`)

## Stack Tecnológica

- **Frontend**: Vite + React 19 + TypeScript
- **Roteamento**: React Router DOM
- **Estilização**: TailwindCSS
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Validação**: Zod + React Hook Form
- **Ícones**: Lucide React

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

### 3. Criar tabela no Supabase

Execute o script SQL `scripts/create-table-duplicado.sql` no SQL Editor do Supabase.

Este script irá criar:
- Tabela `assistant_settings_duplicado`
- Índice em `client_id`
- Políticas RLS (Row Level Security) para autenticação

### 4. Criar usuário admin

Use o script `scripts/create-user.mjs` para criar um usuário administrador ou crie manualmente via Supabase Dashboard em Authentication > Users.

## Executar o projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para produção

```bash
npm run build
npm run preview
```

## Estrutura do Projeto

```
fzia-duplicado/
├── src/
│   ├── components/
│   │   ├── LogoutButton.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layouts/
│   │   └── AppLayout.tsx          # Layout principal (SEM botão Configurações)
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase
│   │   └── logger.ts              # Logger
│   ├── pages/
│   │   ├── Login.tsx              # Página de login
│   │   ├── Dashboard.tsx          # Dashboard principal
│   │   ├── ChangePassword.tsx     # Alterar senha
│   │   └── ForgotPassword.tsx     # Recuperar senha
│   ├── App.tsx                    # Rotas (SEM rota /settings)
│   └── main.tsx
├── scripts/
│   └── create-table-duplicado.sql # Script SQL para criar tabela
├── .env.local.example             # Exemplo de variáveis de ambiente
└── README.md
```

## Tabela Supabase

### assistant_settings_duplicado

| Coluna       | Tipo      | Descrição                                    |
|--------------|-----------|----------------------------------------------|
| id           | UUID      | Chave primária                               |
| client_id    | TEXT      | Identificador do cliente (use "global")      |
| observacoes  | JSONB     | Configurações em JSON                        |
| created_at   | TIMESTAMP | Data de criação                              |
| updated_at   | TIMESTAMP | Data de atualização                          |

O Dashboard consome dados da tabela `contabilizacao` (não incluída neste projeto).

## Diferenças do projeto original

1. **Removido**: Página `/settings` (Configurações do Assistente)
2. **Removido**: Botão "Configurações" no menu de navegação
3. **Alterado**: Redirecionamento inicial de `/` para `/dashboard` (ao invés de `/settings`)
4. **Alterado**: Referências de tabela para `assistant_settings_duplicado`

## Suporte

Para dúvidas ou problemas, consulte a documentação do Supabase: https://supabase.com/docs
