const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const redis = require('redis');
const winston = require('winston');
const promMid = require('express-prometheus-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'gateway.log' })
  ]
});

// Configuração do Redis para cache
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use(limiter);

// Métricas Prometheus
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5]
}));

// Configuração dos serviços
const SERVICES = {
  books: {
    url: process.env.BOOKS_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000,
    retries: 3
  }
};

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware de autorização para admins
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Permissão de administrador necessária.' });
  }
  
  next();
};

// Middleware de cache
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        logger.info(`Cache hit for ${req.originalUrl}`);
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      logger.error('Redis error:', error);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      try {
        redisClient.setex(key, duration, JSON.stringify(body));
      } catch (error) {
        logger.error('Redis cache error:', error);
      }
      res.sendResponse(body);
    };

    next();
  };
};

// Função para fazer proxy das requisições com retry
const proxyRequest = async (service, path, method = 'GET', data = null, retries = 3) => {
  const serviceConfig = SERVICES[service];
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const config = {
        method,
        url: `${serviceConfig.url}${path}`,
        timeout: serviceConfig.timeout,
        headers: { 'Content-Type': 'application/json' }
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      logger.error(`Tentativa ${attempt} falhou para ${service}${path}:`, error.message);
      
      if (attempt === retries) {
        throw new Error(`Serviço ${service} indisponível após ${retries} tentativas`);
      }
      
      // Backoff exponencial
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES)
  });
});

// Sistema simples de usuários em memória (em produção seria banco de dados)
const users = [
  { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@biblioteca.com', fullName: 'Administrador' }
];

// Autenticação - Cadastro de usuário
app.post('/api/auth/register', (req, res) => {
  const { username, password, email, fullName } = req.body;
  
  // Validações básicas
  if (!username || !password || !email || !fullName) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ error: 'Nome de usuário deve ter pelo menos 3 caracteres' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
  }
  
  // Verificar se usuário já existe
  const existingUser = users.find(user => user.username === username || user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Usuário ou email já existe' });
  }
  
  // Criar novo usuário
  const newUser = {
    username,
    password, // Em produção seria hash da senha
    email,
    fullName,
    role: 'user'
  };
  
  users.push(newUser);
  
  logger.info(`Novo usuário cadastrado: ${username}`);
  res.status(201).json({ 
    message: 'Usuário cadastrado com sucesso',
    user: { username, email, fullName, role: 'user' }
  });
});

// Autenticação - Login simples para demonstração
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validar se os dados foram fornecidos
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }
  
  // Verificar se o usuário existe
  const userExists = users.find(u => u.username === username);
  
  if (!userExists) {
    logger.warn(`Tentativa de login com usuário inexistente: ${username}`);
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }
  
  // Verificar se a senha está correta
  if (userExists.password !== password) {
    logger.warn(`Tentativa de login com senha incorreta para usuário: ${username}`);
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  // Login bem-sucedido
  const token = jwt.sign(
    { username: userExists.username, role: userExists.role },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '24h' }
  );
  
  logger.info(`Login realizado por ${username}`);
  res.json({ 
    token, 
    user: { 
      username: userExists.username, 
      role: userExists.role, 
      email: userExists.email, 
      fullName: userExists.fullName 
    } 
  });
});

// ===== ROTAS ADMINISTRATIVAS =====

// Listar todos os usuários (apenas admin)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const usersData = users.map(user => ({
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  }));
  
  logger.info(`Admin ${req.user.username} listou usuários`);
  res.json(usersData);
});

// Atualizar role de usuário (apenas admin)
app.put('/api/admin/users/:username/role', authenticateToken, requireAdmin, (req, res) => {
  const { username } = req.params;
  const { role } = req.body;
  
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role deve ser "user" ou "admin"' });
  }
  
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  users[userIndex].role = role;
  
  logger.info(`Admin ${req.user.username} alterou role do usuário ${username} para ${role}`);
  res.json({ 
    message: 'Role atualizada com sucesso',
    user: {
      username: users[userIndex].username,
      email: users[userIndex].email,
      fullName: users[userIndex].fullName,
      role: users[userIndex].role
    }
  });
});

// Deletar usuário (apenas admin)
app.delete('/api/admin/users/:username', authenticateToken, requireAdmin, (req, res) => {
  const { username } = req.params;
  
  if (username === req.user.username) {
    return res.status(400).json({ error: 'Não é possível deletar seu próprio usuário' });
  }
  
  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  logger.info(`Admin ${req.user.username} deletou usuário ${username}`);
  res.json({ 
    message: 'Usuário deletado com sucesso',
    deletedUser: {
      username: deletedUser.username,
      email: deletedUser.email,
      fullName: deletedUser.fullName,
      role: deletedUser.role
    }
  });
});

// Estatísticas do sistema (apenas admin)
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Estatísticas de usuários
    const userStats = {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    };
    
    // Buscar estatísticas dos livros do serviço
    let bookStats = {};
    try {
      bookStats = await proxyRequest('books', '/stats');
    } catch (error) {
      logger.error('Erro ao obter estatísticas dos livros:', error.message);
      bookStats = { error: 'Dados indisponíveis' };
    }
    
    logger.info(`Admin ${req.user.username} acessou estatísticas do sistema`);
    res.json({
      users: userStats,
      books: bookStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Erro ao obter estatísticas:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ROTAS DE LIVROS =====

// Rotas do serviço de livros com cache
app.get('/api/books', cacheMiddleware(300), async (req, res) => {
  try {
    const data = await proxyRequest('books', '/books');
    logger.info('Livros obtidos com sucesso');
    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter livros:', error.message);
    res.status(503).json({ error: 'Serviço temporariamente indisponível' });
  }
});

app.get('/api/books/:id', cacheMiddleware(600), async (req, res) => {
  try {
    const data = await proxyRequest('books', `/books/${req.params.id}`);
    res.json(data);
  } catch (error) {
    logger.error(`Erro ao obter livro ${req.params.id}:`, error.message);
    res.status(404).json({ error: 'Livro não encontrado' });
  }
});

app.post('/api/books', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = await proxyRequest('books', '/books', 'POST', req.body);
    logger.info(`Livro criado por ${req.user.username}`);
    
    // Invalidar cache
    const pattern = 'cache:/api/books*';
    redisClient.keys(pattern).then(keys => {
      if (keys.length > 0) {
        redisClient.del(keys);
      }
    });
    
    res.status(201).json(data);
  } catch (error) {
    logger.error('Erro ao criar livro:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/books/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const data = await proxyRequest('books', `/books/${req.params.id}`, 'PUT', req.body);
    logger.info(`Livro ${req.params.id} atualizado por ${req.user.username}`);
    
    // Invalidar cache específico
    redisClient.del(`cache:/api/books/${req.params.id}`);
    redisClient.del('cache:/api/books');
    
    res.json(data);
  } catch (error) {
    logger.error(`Erro ao atualizar livro ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/books/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await proxyRequest('books', `/books/${req.params.id}`, 'DELETE');
    logger.info(`Livro ${req.params.id} removido por ${req.user.username}`);
    
    // Invalidar cache
    redisClient.del(`cache:/api/books/${req.params.id}`);
    redisClient.del('cache:/api/books');
    
    res.status(204).send();
  } catch (error) {
    logger.error(`Erro ao remover livro ${req.params.id}:`, error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Busca avançada com cache inteligente
app.get('/api/search', cacheMiddleware(180), async (req, res) => {
  try {
    const { q, category, author } = req.query;
    const searchPath = `/search?q=${encodeURIComponent(q || '')}&category=${encodeURIComponent(category || '')}&author=${encodeURIComponent(author || '')}`;
    const data = await proxyRequest('books', searchPath);
    
    logger.info(`Busca realizada: ${q}`);
    res.json(data);
  } catch (error) {
    logger.error('Erro na busca:', error.message);
    res.status(500).json({ error: 'Erro na busca' });
  }
});

// Recomendações personalizadas
app.get('/api/recommendations', authenticateToken, cacheMiddleware(900), async (req, res) => {
  try {
    const data = await proxyRequest('books', `/recommendations?user=${req.user.username}`);
    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter recomendações:', error.message);
    res.status(500).json({ error: 'Erro ao obter recomendações' });
  }
});

// Categorias
app.get('/api/categories', cacheMiddleware(3600), async (req, res) => {
  try {
    const data = await proxyRequest('books', '/categories');
    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter categorias:', error.message);
    res.status(500).json({ error: 'Erro ao obter categorias' });
  }
});

// Estatísticas
app.get('/api/stats', authenticateToken, cacheMiddleware(300), async (req, res) => {
  try {
    const data = await proxyRequest('books', '/stats');
    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter estatísticas:', error.message);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  logger.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicialização do servidor
const server = app.listen(PORT, () => {
  logger.info(`API Gateway rodando na porta ${PORT}`);
  
  // Conectar ao Redis
  redisClient.connect().catch(err => {
    logger.error('Erro ao conectar ao Redis:', err);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    redisClient.quit();
    logger.info('Servidor fechado');
    process.exit(0);
  });
});

module.exports = app;
