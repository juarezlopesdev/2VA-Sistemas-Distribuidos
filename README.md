# 📚 Sistema Distribuído - Biblioteca Digital
## Avaliação 2VA - Sistemas Distribuídos

Este é um sistema completo de biblioteca digital implementado como um sistema distribuído com 3 módulos principais, desenvolvido especificamente para atender aos critérios de avaliação da disciplina.

## 🏗️ Arquitetura do Sistema

O sistema é composto por **3 módulos principais** integrados:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Books Service  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Node.js)     │
│   Porto: 3000   │    │   Porto: 3001   │    │   Porto: 3002   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │      Redis      │
                       │   (Cache)       │
                       │   Porto: 6379   │
                       └─────────────────┘
```

### 🔧 Tecnologias Utilizadas

#### API Gateway
- **Node.js + Express** - Servidor web
- **JWT** - Autenticação e autorização
- **Redis** - Cache distribuído
- **Axios** - Cliente HTTP para comunicação entre serviços
- **Winston** - Logging estruturado
- **Prometheus** - Métricas e monitoramento
- **Rate Limiting** - Controle de taxa de requisições
- **Helmet** - Segurança HTTP

#### Books Service (Microserviço)
- **Node.js + Express** - Servidor web
- **SQLite** - Banco de dados relacional
- **Fuse.js** - Busca fuzzy avançada
- **Express Validator** - Validação de dados
- **UUID** - Identificadores únicos
- **Winston** - Logging

#### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool moderno
- **React Router** - Roteamento SPA
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 🚀 Funcionalidades

### 📖 Gestão de Livros
- ✅ **CRUD completo** de livros
- ✅ **Busca avançada** com filtros (título, autor, categoria)
- ✅ **Busca fuzzy** para encontrar livros mesmo com erros de digitação
- ✅ **Paginação** eficiente
- ✅ **Sistema de categorias** 
- ✅ **Controle de estoque** (cópias disponíveis/total)
- ✅ **Sistema de avaliações** com ratings

### 🔍 Busca e Descoberta
- ✅ **Busca por texto livre** com Fuse.js
- ✅ **Filtros combinados** (categoria, autor, disponibilidade)
- ✅ **Sistema de recomendações** baseado em ratings
- ✅ **Cache inteligente** para buscas frequentes

### 🔐 Autenticação e Autorização
- ✅ **JWT Authentication** 
- ✅ **Controle de acesso** para operações administrativas
- ✅ **Sessions persistentes**
- ✅ **Logout seguro**

### 📊 Monitoramento e Observabilidade
- ✅ **Métricas Prometheus** em ambos os serviços
- ✅ **Logging estruturado** com Winston
- ✅ **Health checks** para monitoramento
- ✅ **Rate limiting** para proteção contra DDoS
- ✅ **Retry automático** com backoff exponencial

### 🎨 Interface de Usuário
- ✅ **Design responsivo** para desktop e mobile
- ✅ **Interface intuitiva** e moderna
- ✅ **Feedback visual** para todas as ações
- ✅ **Loading states** e error handling
- ✅ **Busca em tempo real**
- ✅ **Dashboard administrativo**

## 🏃‍♂️ Como Executar

### Pré-requisitos
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Redis** (opcional, mas recomendado para cache)

### 1️⃣ Clone o repositório
```bash
git clone <url-do-repositorio>
cd 2VA-Sistemas-Distribuidos
```

### 2️⃣ Configure e inicie o Books Service
```bash
cd books-service
npm install
npm run seed  # Popula o banco com dados de exemplo
npm start     # Inicia na porta 3002
```

### 3️⃣ Configure e inicie o API Gateway
```bash
cd ../api-gateway
npm install
npm start     # Inicia na porta 3001
```

### 4️⃣ Configure e inicie o Frontend
```bash
cd ../frontend
npm install
npm run dev   # Inicia na porta 3000
```

### 5️⃣ (Opcional) Inicie o Redis
```bash
# Ubuntu/Debian
sudo apt install redis-server
redis-server

# macOS
brew install redis
redis-server

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 🔑 Credenciais de Teste
- **Usuário**: `admin`
- **Senha**: `admin123`

## 📚 Endpoints da API

### API Gateway (http://localhost:3001)

#### Autenticação
- `POST /auth/login` - Login do usuário

#### Livros (com cache e proxy)
- `GET /api/books` - Lista livros (paginado)
- `GET /api/books/:id` - Busca livro por ID
- `POST /api/books` - Cria novo livro (requer auth)
- `PUT /api/books/:id` - Atualiza livro (requer auth)
- `DELETE /api/books/:id` - Remove livro (requer auth)
- `GET /api/search` - Busca avançada
- `GET /api/recommendations` - Recomendações (requer auth)

#### Monitoramento
- `GET /health` - Health check
- `GET /metrics` - Métricas Prometheus

### Books Service (http://localhost:3002)

#### Livros
- `GET /books` - Lista livros
- `GET /books/:id` - Busca livro por ID  
- `POST /books` - Cria livro
- `PUT /books/:id` - Atualiza livro
- `DELETE /books/:id` - Remove livro
- `GET /search` - Busca com Fuse.js
- `GET /recommendations` - Sistema de recomendações
- `GET /categories` - Lista categorias
- `GET /stats` - Estatísticas do sistema

## 🎯 Características de Sistemas Distribuídos

### 🔄 **Complexidade**
- **Arquitetura de Microserviços** com separação clara de responsabilidades
- **API Gateway** como ponto único de entrada
- **Comunicação assíncrona** entre serviços
- **Cache distribuído** com Redis
- **Sistema de retry** com backoff exponencial
- **Load balancing** preparado para múltiplas instâncias

### ✅ **Corretude**
- **Validação rigorosa** em múltiplas camadas
- **Tratamento de erros** abrangente
- **Transações seguras** no banco de dados
- **Autenticação JWT** robusta
- **Sanitização** de dados de entrada

### 📋 **Completude**
- **CRUD completo** para todas as entidades
- **Sistema de busca** avançado e eficiente
- **Interface administrativa** completa
- **Monitoramento** e observabilidade
- **Documentação** técnica detalhada
- **Seeds** para dados de exemplo

### 🚀 **Criatividade**
- **Busca fuzzy** para melhor UX
- **Sistema de recomendações** inteligente
- **Cache inteligente** com invalidação automática
- **Interface moderna** e responsiva
- **Métricas em tempo real** com Prometheus
- **Rate limiting** adaptativo
- **Graceful shutdown** para alta disponibilidade

## 🔍 Demonstração dos Conceitos

### 1. **Distribuição e Escalabilidade**
- Cada serviço pode ser escalado independentemente
- API Gateway permite adicionar novos serviços facilmente
- Cache Redis melhora performance drasticamente

### 2. **Tolerância a Falhas**
- Retry automático em caso de falha de serviço
- Circuit breaker pattern implementado
- Graceful degradation quando Redis não está disponível

### 3. **Consistência**
- Invalidação automática de cache após mudanças
- Transações atômicas no banco de dados
- Estado consistente entre frontend e backend

### 4. **Observabilidade**
- Logs estruturados em todos os serviços
- Métricas Prometheus para monitoramento
- Health checks para status dos serviços

## 📊 Métricas e Monitoramento

O sistema oferece métricas detalhadas via Prometheus:

```bash
# Métricas do API Gateway
curl http://localhost:3001/metrics

# Métricas do Books Service  
curl http://localhost:3002/metrics
```

### Principais métricas:
- **http_requests_total** - Total de requisições HTTP
- **http_request_duration_seconds** - Duração das requisições
- **nodejs_heap_size_used_bytes** - Uso de memória
- **nodejs_active_handles_total** - Handles ativos

## 🧪 Scripts Úteis

```bash
# Popular banco com dados de exemplo
cd books-service && npm run seed

# Executar em modo desenvolvimento (com restart automático)
npm run dev

# Ver logs do API Gateway
tail -f api-gateway/gateway.log

# Ver logs do Books Service
tail -f books-service/books-service.log

# Verificar health dos serviços
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## 🎯 Critérios de Avaliação Atendidos

### ✅ **Complexidade**
- Arquitetura distribuída real com 3 módulos independentes
- Comunicação inter-serviços com retry e circuit breaker
- Cache distribuído com invalidação inteligente
- Sistema de autenticação JWT completo
- Busca avançada com algoritmos de fuzzy matching

### ✅ **Corretude**
- Validação em múltiplas camadas (frontend, gateway, service)
- Tratamento robusto de erros e edge cases
- Testes automatizados implementáveis
- Transações atômicas e consistência de dados
- Segurança implementada (helmet, rate limiting, JWT)

### ✅ **Completude**
- Sistema CRUD completo para livros
- Interface de usuário moderna e funcional
- Sistema de busca e recomendações
- Monitoramento e observabilidade
- Documentação técnica abrangente
- Deploy pronto para produção

### ✅ **Criatividade**
- Interface moderna com Tailwind CSS e componentes reutilizáveis
- Busca fuzzy para melhor experiência do usuário
- Sistema de recomendações baseado em machine learning simples
- Cache inteligente com estratégias de invalidação
- Métricas em tempo real para observabilidade
- Graceful shutdown e health checks para alta disponibilidade

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido para demonstrar conceitos de sistemas distribuídos. Sinta-se à vontade para explorar o código e experimentar com as funcionalidades!

## 📝 Licença

MIT License - Projeto acadêmico para fins educacionais.

---

**Desenvolvido com ❤️ para a disciplina de Sistemas Distribuídos**
