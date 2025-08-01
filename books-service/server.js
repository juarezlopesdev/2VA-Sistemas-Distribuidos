const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Fuse = require('fuse.js');
const promMid = require('express-prometheus-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'books-service.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Métricas
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true
}));

// Configuração do banco SQLite
const db = new sqlite3.Database('./biblioteca.db', (err) => {
  if (err) {
    logger.error('Erro ao conectar com o banco:', err.message);
  } else {
    logger.info('Conectado ao banco SQLite');
    initializeDatabase();
  }
});

// Inicializar estrutura do banco
function initializeDatabase() {
  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT UNIQUE,
      category TEXT,
      description TEXT,
      published_year INTEGER,
      pages INTEGER,
      language TEXT DEFAULT 'pt-BR',
      available_copies INTEGER DEFAULT 1,
      total_copies INTEGER DEFAULT 1,
      rating REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      book_id TEXT,
      user_id TEXT,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(book_id) REFERENCES books(id)
    )
  `;

  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createBooksTable);
  db.run(createReviewsTable);
  db.run(createCategoriesTable);
  
  // Inserir categorias padrão
  const defaultCategories = [
    { id: uuidv4(), name: 'Ficção', description: 'Livros de ficção literária' },
    { id: uuidv4(), name: 'Tecnologia', description: 'Livros sobre programação e tecnologia' },
    { id: uuidv4(), name: 'Ciência', description: 'Livros científicos e acadêmicos' },
    { id: uuidv4(), name: 'História', description: 'Livros de história' },
    { id: uuidv4(), name: 'Biografia', description: 'Biografias e autobiografias' }
  ];

  defaultCategories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)',
      [category.id, category.name, category.description]);
  });
}

// Validadores
const bookValidators = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('author').notEmpty().withMessage('Autor é obrigatório'),
  body('isbn').optional().isISBN().withMessage('ISBN inválido'),
  body('category').notEmpty().withMessage('Categoria é obrigatória'),
  body('published_year').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('pages').optional().isInt({ min: 1 }),
  body('total_copies').optional().isInt({ min: 1 })
];

// Função auxiliar para calcular rating médio
function updateBookRating(bookId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT AVG(rating) as avg_rating FROM reviews WHERE book_id = ?';
    db.get(query, [bookId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      const avgRating = row.avg_rating || 0;
      db.run('UPDATE books SET rating = ? WHERE id = ?', [avgRating, bookId], (err) => {
        if (err) reject(err);
        else resolve(avgRating);
      });
    });
  });
}

// Rotas

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'books-service',
    timestamp: new Date().toISOString() 
  });
});

// Listar todos os livros
app.get('/books', (req, res) => {
  const { page = 1, limit = 10, category, author, available } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM books WHERE 1=1';
  let params = [];
  
  if (category) {
    query += ' AND category LIKE ?';
    params.push(`%${category}%`);
  }
  
  if (author) {
    query += ' AND author LIKE ?';
    params.push(`%${author}%`);
  }
  
  if (available === 'true') {
    query += ' AND available_copies > 0';
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      logger.error('Erro ao buscar livros:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    // Contar total para paginação
    const countQuery = 'SELECT COUNT(*) as total FROM books WHERE 1=1';
    db.get(countQuery, (err, countRow) => {
      if (err) {
        logger.error('Erro ao contar livros:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      res.json({
        books: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countRow.total,
          pages: Math.ceil(countRow.total / limit)
        }
      });
    });
  });
});

// Buscar livro por ID
app.get('/books/:id', (req, res) => {
  const query = `
    SELECT b.*, 
           AVG(r.rating) as avg_rating,
           COUNT(r.id) as review_count
    FROM books b
    LEFT JOIN reviews r ON b.id = r.book_id
    WHERE b.id = ?
    GROUP BY b.id
  `;
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      logger.error('Erro ao buscar livro:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    // Buscar reviews do livro
    const reviewsQuery = 'SELECT * FROM reviews WHERE book_id = ? ORDER BY created_at DESC';
    db.all(reviewsQuery, [req.params.id], (err, reviews) => {
      if (err) {
        logger.error('Erro ao buscar reviews:', err);
        reviews = [];
      }
      
      res.json({ ...row, reviews });
    });
  });
});

// Criar novo livro
app.post('/books', bookValidators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const id = uuidv4();
  const {
    title, author, isbn, category, description,
    published_year, pages, language = 'pt-BR',
    total_copies = 1
  } = req.body;
  
  const query = `
    INSERT INTO books (
      id, title, author, isbn, category, description,
      published_year, pages, language, total_copies, available_copies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    id, title, author, isbn, category, description,
    published_year, pages, language, total_copies, total_copies
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      logger.error('Erro ao criar livro:', err);
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'ISBN já existe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    logger.info(`Livro criado: ${title} (${id})`);
    
    // Retornar o livro criado
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
      if (err) {
        logger.error('Erro ao buscar livro criado:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      res.status(201).json(row);
    });
  });
});

// Atualizar livro
app.put('/books/:id', bookValidators, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const {
    title, author, isbn, category, description,
    published_year, pages, language, total_copies
  } = req.body;
  
  const query = `
    UPDATE books SET
      title = ?, author = ?, isbn = ?, category = ?, description = ?,
      published_year = ?, pages = ?, language = ?, total_copies = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const params = [
    title, author, isbn, category, description,
    published_year, pages, language, total_copies, req.params.id
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      logger.error('Erro ao atualizar livro:', err);
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'ISBN já existe' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    logger.info(`Livro atualizado: ${req.params.id}`);
    
    // Retornar o livro atualizado
    db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
      if (err) {
        logger.error('Erro ao buscar livro atualizado:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      res.json(row);
    });
  });
});

// Deletar livro
app.delete('/books/:id', (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      logger.error('Erro ao deletar livro:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    logger.info(`Livro deletado: ${req.params.id}`);
    res.status(204).send();
  });
});

// Busca avançada usando Fuse.js
app.get('/search', (req, res) => {
  const { q, category, author } = req.query;
  
  if (!q && !category && !author) {
    return res.status(400).json({ error: 'Pelo menos um parâmetro de busca é necessário' });
  }
  
  db.all('SELECT * FROM books', (err, books) => {
    if (err) {
      logger.error('Erro na busca:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    let results = books;
    
    // Filtrar por categoria e autor primeiro
    if (category) {
      results = results.filter(book => 
        book.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (author) {
      results = results.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    // Busca fuzzy se houver query de texto
    if (q) {
      const fuse = new Fuse(results, {
        keys: ['title', 'author', 'description', 'category'],
        threshold: 0.4,
        includeScore: true
      });
      
      const searchResults = fuse.search(q);
      results = searchResults.map(result => ({
        ...result.item,
        searchScore: 1 - result.score
      }));
    }
    
    logger.info(`Busca realizada: "${q}" - ${results.length} resultados`);
    res.json({ results, total: results.length });
  });
});

// Sistema de recomendações simples
app.get('/recommendations', (req, res) => {
  const { user } = req.query;
  
  // Algoritmo simples: livros mais bem avaliados por categoria
  const query = `
    SELECT b.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
    FROM books b
    LEFT JOIN reviews r ON b.id = r.book_id
    GROUP BY b.id
    HAVING avg_rating >= 4.0 AND review_count >= 1
    ORDER BY avg_rating DESC, review_count DESC
    LIMIT 10
  `;
  
  db.all(query, (err, books) => {
    if (err) {
      logger.error('Erro ao gerar recomendações:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    
    logger.info(`Recomendações geradas para usuário: ${user}`);
    res.json({ recommendations: books, algorithm: 'rating-based' });
  });
});

// Categorias
app.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
    if (err) {
      logger.error('Erro ao buscar categorias:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    res.json(rows);
  });
});

// Estatísticas
app.get('/stats', (req, res) => {
  const queries = {
    totalBooks: 'SELECT COUNT(*) as count FROM books',
    totalCategories: 'SELECT COUNT(*) as count FROM categories',
    totalReviews: 'SELECT COUNT(*) as count FROM reviews',
    averageRating: 'SELECT AVG(rating) as avg FROM books WHERE rating > 0',
    booksByCategory: 'SELECT category, COUNT(*) as count FROM books GROUP BY category'
  };
  
  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;
  
  Object.entries(queries).forEach(([key, query]) => {
    db.all(query, (err, rows) => {
      if (err) {
        logger.error(`Erro na query ${key}:`, err);
        stats[key] = null;
      } else {
        stats[key] = key === 'booksByCategory' ? rows : rows[0];
      }
      
      completed++;
      if (completed === total) {
        res.json(stats);
      }
    });
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  logger.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
const server = app.listen(PORT, () => {
  logger.info(`Books Service rodando na porta ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    db.close((err) => {
      if (err) {
        logger.error('Erro ao fechar banco:', err);
      } else {
        logger.info('Banco fechado');
      }
      process.exit(0);
    });
  });
});

module.exports = app;
