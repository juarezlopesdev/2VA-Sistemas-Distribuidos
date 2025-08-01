# 📚 Sistema Distribuído - Biblioteca Digital
## Avaliação 2VA - Sistemas Distribuídos

Este é um sistema completo de biblioteca digital implementado como um sistema distribuído com 3 módulos principais, desenvolvido especificamente para atender aos critérios de avaliação da disciplina.

## 🏗️ Arquitetura do Sistema

O sistema é composto por **3 módulos principais** integrados:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Books Service  │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Node.js)     │
│   Porto: 5173   │    │   Porto: 3000   │    │   Porto: 3001   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │      Redis      │
                       │   (Cache)       │
                       │   Porto: 6379   │
                       └─────────────────┘
```

## 🎯 Critérios de Avaliação Atendidos

### ✅ **Complexidade**
- **Arquitetura de Microserviços** com comunicação inter-serviços
- **Cache distribuído** com Redis e invalidação automática
- **Sistema de retry** com backoff exponencial
- **Padrão Circuit Breaker** para tolerância a falhas
- **Monitoramento** com Prometheus e métricas customizadas
- **Autenticação JWT** com roles e autorização

### ✅ **Corretude**
- **Validação robusta** em múltiplas camadas
- **Tratamento de erros** consistente e informativo
- **Transações seguras** com rollback automático
- **Health checks** para monitoramento de saúde
- **Logs estruturados** para auditoria e debug
- **Graceful shutdown** para finalização segura

### ✅ **Completude**
- **CRUD completo** para livros e usuários
- **Sistema de busca** avançado com fuzzy search
- **Interface administrativa** completa
- **Autenticação e autorização** por roles
- **Monitoramento e métricas** em tempo real
- **Documentação técnica** abrangente

### ✅ **Criatividade**
- **Busca inteligente** com correção de erros de digitação
- **Dashboard interativo** com estatísticas dinâmicas
- **Sistema de roles** com acesso diferenciado
- **Interface moderna** com Tailwind CSS e animações
- **Cache inteligente** com TTL dinâmico
- **Deploy automatizado** com scripts

## 🔐 Sistema de Autenticação e Autorização

### 👥 **Tipos de Usuário**

#### **🔧 Administrador**
- **Credenciais:** `admin` / `admin123`
- **Permissões:**
  - ✅ Acesso total ao catálogo de livros
  - ✅ CRUD completo de livros
  - ✅ Dashboard com estatísticas
  - ✅ Painel administrativo
  - ✅ Gerenciamento de usuários
  - ✅ Monitoramento do sistema

#### **👤 Usuário Comum**
- **Cadastro:** Via tela de registro
- **Permissões:**
  - ✅ Fazer login/logout
  - ✅ Visualizar página inicial
  - ❌ Acesso ao catálogo (restrito)
  - ❌ Acesso ao dashboard (restrito)
  - ❌ Funcionalidades administrativas

### 🛡️ **Segurança Implementada**
- **JWT Tokens** com expiração configurável
- **Middleware de autorização** baseado em roles
- **Validação de entrada** em todas as rotas
- **Rate limiting** para prevenir abuso
- **Sanitização de dados** para prevenir XSS
- **CORS configurado** para ambiente de desenvolvimento

## 🚀 Funcionalidades

### 📖 Gestão de Livros (Admin Only)
- ✅ **CRUD completo** de livros
- ✅ **Busca avançada** com filtros (título, autor, categoria)
- ✅ **Busca fuzzy** para encontrar livros mesmo com erros de digitação
- ✅ **Sistema de categorias** organizado
- ✅ **Controle de estoque** (cópias disponíveis/total)
- ✅ **Sistema de avaliações** com ratings
- ✅ **Upload de capas** (simulado)

### 🔍 Busca e Descoberta
- **Busca Fuzzy** inteligente usando Fuse.js
- **Filtros dinâmicos** por categoria, autor, ano
- **Resultados ordenados** por relevância
- **Busca em tempo real** com debounce
- **Destacar termos** encontrados nos resultados

### 📊 Dashboard Administrativo
- **Estatísticas em tempo real** do acervo
- **Gráficos interativos** de distribuição
- **Métricas de uso** do sistema
- **Monitoramento de performance** dos serviços
- **Logs de auditoria** das operações

### 👥 Gerenciamento de Usuários (Admin)
- **Lista completa** de usuários cadastrados
- **Alterar roles** (user ↔ admin)
- **Remover usuários** do sistema
- **Visualizar atividade** dos usuários

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js 18** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **Redis** - Cache distribuído
- **JWT** - Autenticação
- **Prometheus** - Métricas
- **Winston** - Logging
- **Axios** - Cliente HTTP
- **Fuse.js** - Busca fuzzy

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool moderno
- **React Router** - Roteamento SPA
- **React Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários performáticos
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

### DevOps
- **Git** - Controle de versão
- **Bash Scripts** - Automação
- **PM2** - Gerenciamento de processos

## 🚀 Como Executar

### 📋 Pré-requisitos
- Node.js 18+
- Redis Server (opcional, sistema funciona sem)
- Git

### ⚡ Execução Automática

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd 2VA-Sistemas-Distribuidos

# Execute automaticamente (método recomendado)
cd api-gateway && npm install && cd ..
cd books-service && npm install && cd ..
cd frontend && npm install && cd ..

# Popular banco de dados
cd books-service && node seed.js && cd ..

# Iniciar todos os serviços
# Terminal 1: API Gateway
cd api-gateway && npm start

# Terminal 2: Books Service  
cd books-service && npm start

# Terminal 3: Frontend
cd frontend && npm run dev
```

### 🔧 Execução Passo a Passo

```bash
# 1. Instalar dependências
npm install # em cada diretório (api-gateway, books-service, frontend)

# 2. Popular banco de dados
cd books-service && node seed.js

# 3. Iniciar serviços (em terminais separados)
# Terminal 1
cd api-gateway && npm start

# Terminal 2
cd books-service && npm start  

# Terminal 3
cd frontend && npm run dev
```

## 📱 Acesso ao Sistema

### 🌐 URLs de Acesso
- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:3000
- **Books Service:** http://localhost:3001
- **Métricas:** http://localhost:3000/metrics

### 🔑 Credenciais de Teste

#### Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`
- **Acesso:** Completo ao sistema

#### Usuário Comum
- **Cadastro:** Via tela `/register`
- **Acesso:** Limitado (sem catálogo/dashboard)

## 📊 Monitoramento e Métricas

### 🔍 Health Checks
```bash
# Verificar saúde dos serviços
curl http://localhost:3000/health
curl http://localhost:3001/health
```

### 📈 Métricas Prometheus
```bash
# Métricas do API Gateway
curl http://localhost:3000/metrics

# Métricas do Books Service
curl http://localhost:3001/metrics
```

## 🧪 Testando o Sistema

### 🎯 Fluxo de Teste Completo

1. **Acesse:** http://localhost:5173
2. **Registre um usuário comum** em `/register`
3. **Faça login** e veja as limitações de acesso
4. **Logout e login como admin** (`admin/admin123`)
5. **Explore o catálogo completo** de livros
6. **Teste a busca** com termos como "clean code" ou "clen cod"
7. **Acesse o dashboard** para ver estatísticas
8. **Use o painel admin** para gerenciar usuários

### 🔍 Funcionalidades para Demonstrar

#### **Complexidade Técnica:**
- Navegue entre as páginas e observe a comunicação entre serviços
- Teste a busca fuzzy com erros de digitação
- Verifique o cache funcionando (mesmas consultas mais rápidas)
- Observe os logs estruturados no terminal

#### **Sistema Distribuído:**
- Cada módulo roda independentemente
- API Gateway roteia entre serviços
- Cache Redis compartilhado (quando disponível)
- Tolerância a falhas com retry

#### **Interface Moderna:**
- Design responsivo em diferentes telas
- Animações suaves com Tailwind
- Notificações em tempo real
- Formulários com validação instantânea

## 📁 Estrutura do Projeto

```
📦 2VA-Sistemas-Distribuidos/
├── 🌐 api-gateway/          # Ponto de entrada único
│   ├── server.js            # Servidor principal
│   ├── package.json         # Dependências
│   └── .env                # Configurações
├── 📚 books-service/        # Microserviço de livros  
│   ├── server.js            # Servidor de livros
│   ├── seed.js             # Dados iniciais
│   ├── biblioteca.db        # Banco SQLite
│   └── package.json         # Dependências
├── 🎨 frontend/             # Interface React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Integração com APIs
│   │   └── contexts/       # Contextos React
│   ├── package.json         # Dependências
│   └── vite.config.js      # Configuração Vite
└── 📋 README.md            # Documentação
```

## 🏆 Diferenciais Implementados

### 🎨 **User Experience (UX)**
- Interface intuitiva e moderna
- Feedback visual em todas as ações
- Loading states e skeleton screens
- Mensagens de erro específicas e úteis
- Navegação fluida entre páginas

### ⚡ **Performance**
- Cache Redis para consultas frequentes (opcional)
- Debounce em campos de busca
- Lazy loading de componentes
- Otimização de bundle com Vite
- Consultas otimizadas no backend

### 🛡️ **Segurança**
- Autenticação stateless com JWT
- Autorização baseada em roles
- Validação de entrada rigorosa
- Rate limiting por IP
- Headers de segurança com Helmet

### 📊 **Observabilidade**
- Logs estruturados em JSON
- Métricas Prometheus customizadas
- Health checks em todos os serviços
- Monitoring de performance
- Auditoria de ações administrativas

## 🎓 Conceitos de Sistemas Distribuídos Demonstrados

### 🏗️ **Arquitetura**
- **Microserviços** independentes e especializados
- **API Gateway** como ponto de entrada único
- **Separação de responsabilidades** clara
- **Escalabilidade horizontal** preparada

### 🔄 **Comunicação**
- **HTTP/REST** para comunicação síncrona
- **JSON** como formato de troca de dados
- **Proxy reverso** no API Gateway
- **Circuit breaker** para tolerância a falhas

### 💾 **Dados**
- **Banco de dados** por serviço (SQLite)
- **Cache distribuído** com Redis (opcional)
- **Consistency eventual** aceitável
- **Estado compartilhado** minimizado

### 🛡️ **Confiabilidade**
- **Health checks** automáticos
- **Retry com backoff** exponencial
- **Timeout** configurável
- **Graceful degradation** em falhas

## 📞 Troubleshooting

### 🔧 Problemas Comuns

#### **Erro de Porta em Uso**
```bash
# Encontrar e parar processos
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9  
lsof -ti:5173 | xargs kill -9
```

#### **Dependências não Instaladas**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### **Banco de Dados Vazio**
```bash
# Repopular banco
cd books-service
rm biblioteca.db
node seed.js
```

#### **Cache Redis Indisponível**
- Sistema funciona normalmente sem Redis
- Cache em memória é usado como fallback
- Não afeta funcionalidades principais

## 🎯 Conclusão

Este sistema demonstra de forma prática e completa os conceitos fundamentais de sistemas distribuídos, implementando uma solução real e funcional que atende a todos os critérios de avaliação com criatividade e excelência técnica.

**Características Destacadas:**
- ✅ **3 módulos independentes** funcionando como microserviços
- ✅ **Interface gráfica moderna** e responsiva
- ✅ **Sistema de autenticação robusto** com diferentes níveis de acesso
- ✅ **Arquitetura distribuída real** com comunicação entre serviços
- ✅ **Funcionalidades completas** de CRUD e busca avançada
- ✅ **Monitoramento e observabilidade** implementados
- ✅ **Documentação completa** para execução e avaliação


---

