# Gestor de Pagamentos

Sistema de gerenciamento de clientes e faturas com autenticação JWT.

- **Backend:** Java 21 + Spring Boot 4.1.0 + PostgreSQL
- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4

---

## Sumário

- [Requisitos](#requisitos)
- [Configuração do Banco](#configuração-do-banco)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)

---

## Requisitos

- JDK 21
- Node.js 20+
- PostgreSQL 16
- Maven 3.9+ (ou usar o wrapper `./mvnw`)

---

## Configuração do Banco

```bash
psql -U postgres
```

```sql
CREATE DATABASE gestor_de_pagamentos;
```

As tabelas são criadas automaticamente pelo Hibernate ao rodar a aplicação.

---

## Variáveis de Ambiente

| Variável | Obrigatório | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `POSTGRES_PASSWORD` | Sim | — | Senha do usuário `postgres` no PostgreSQL |

```bash
export POSTGRES_PASSWORD=minha_senha
```

---

## Como Rodar

### Backend

```bash
cd backend
export POSTGRES_PASSWORD=minha_senha
./mvnw spring-boot:run
```

A API roda em `http://localhost:8080/api/v1`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`.

### Script útil

```bash
./backend/kill-port.sh    # Libera a porta 8080 se estiver ocupada
```

---

## Estrutura do Projeto

```
backend/
├── src/main/java/com/example/gestor_de_pagamentos/
│   ├── config/          # CORS, JWT, Security, UserDetailsService
│   ├── controller/      # Auth, Cliente, Fatura, GlobalExceptionHandler
│   ├── dto/             # LoginRequest, LoginResponse, RegisterRequest
│   ├── model/           # Usuario, Cliente, Fatura
│   ├── repository/      # JPA repositories
│   └── service/         # ClienteService, FaturaService
└── src/main/resources/
    └── application.properties

frontend/
└── src/
    ├── api/             # Axios instance com interceptor JWT
    ├── components/      # ClienteForm, ClienteList, FaturaForm, FaturaList, Modal, Toast
    ├── pages/           # Login, Register, Clientes, Faturas
    └── utils/           # date.js (formatação)
```

---

## API Endpoints

Todos os endpoints usam o prefixo `/api/v1`. Rotas protegidas exigem header:

```
Authorization: Bearer <token>
```

### Autenticação (públicas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Cadastrar novo usuário |
| POST | `/api/v1/auth/login` | Login e retorno do token JWT |

### Clientes (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/clientes` | Listar todos |
| GET | `/api/v1/clientes/{id}` | Buscar por ID |
| POST | `/api/v1/clientes` | Criar |
| PUT | `/api/v1/clientes/{id}` | Atualizar |
| DELETE | `/api/v1/clientes/{id}` | Remover |

### Faturas (protegidas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/faturas` | Listar todas |
| GET | `/api/v1/faturas/{id}` | Buscar por ID |
| GET | `/api/v1/faturas/cliente/{clienteId}` | Listar por cliente |
| POST | `/api/v1/faturas` | Criar |
| DELETE | `/api/v1/faturas/{id}` | Remover |

---

## Funcionalidades

- Autenticação JWT com cadastro e login
- CRUD completo de clientes
- CRUD completo de faturas com vencimento e status
- Modal de detalhes com edição inline
- Notificações toast de sucesso/erro
- Calendário embutido em português
- Navegação entre páginas com rotas protegidas
- CORS configurado para desenvolvimento local
