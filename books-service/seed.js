const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./biblioteca.db');

console.log('🌱 Iniciando seed do banco de dados...');

// Criar tabela se não existir
db.serialize(() => {
  console.log('📊 Criando tabela books...');
  db.run(`
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
      total_copies INTEGER DEFAULT 1,
      available_copies INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('� Criando tabela categories...');
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('�📚 Inserindo livros...');

  // Dados de exemplo para popular o banco
  const sampleBooks = [
    {
      id: uuidv4(),
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      category: 'Tecnologia',
      description: 'Um guia prático para escrever código limpo e maintível.',
      published_year: 2008,
      pages: 464,
      language: 'pt-BR',
      total_copies: 5,
      available_copies: 3
    },
    {
      id: uuidv4(),
      title: 'O Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9788595084759',
      category: 'Ficção',
      description: 'A jornada de Bilbo Bolseiro na Terra Média.',
      published_year: 1937,
      pages: 288,
      language: 'pt-BR',
      total_copies: 3,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'Sistemas Distribuídos: Princípios e Paradigmas',
      author: 'Andrew S. Tanenbaum',
      isbn: '9788543020495',
      category: 'Tecnologia',
      description: 'Fundamentos de sistemas distribuídos e suas aplicações.',
      published_year: 2017,
      pages: 596,
      language: 'pt-BR',
      total_copies: 4,
      available_copies: 4
    },
    {
      id: uuidv4(),
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '9788520925806',
      category: 'Literatura Clássica',
      description: 'Clássico da literatura brasileira sobre Bentinho e Capitu.',
      published_year: 1899,
      pages: 256,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 1
    },
    {
      id: uuidv4(),
      title: 'Kubernetes: Up and Running',
      author: 'Kelsey Hightower',
      isbn: '9781492046530',
      category: 'Tecnologia',
      description: 'Guia completo para orquestração de containers com Kubernetes.',
      published_year: 2019,
      pages: 318,
      language: 'pt-BR',
      total_copies: 3,
      available_copies: 3
    },
    {
      id: uuidv4(),
      title: '1984',
      author: 'George Orwell',
      isbn: '9788535914849',
      category: 'Ficção',
      description: 'Distopia clássica sobre vigilância e totalitarismo.',
      published_year: 1949,
      pages: 416,
      language: 'pt-BR',
      total_copies: 4,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Gang of Four',
      isbn: '9780201633610',
      category: 'Tecnologia',
      description: 'Padrões fundamentais de design em programação orientada a objetos.',
      published_year: 1994,
      pages: 395,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      isbn: '9788574480473',
      category: 'Literatura Clássica',
      description: 'Romance naturalista sobre a vida em um cortiço no Rio de Janeiro.',
      published_year: 1890,
      pages: 304,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'Microservices Patterns',
      author: 'Chris Richardson',
      isbn: '9781617294549',
      category: 'Tecnologia',
      description: 'Padrões e práticas para desenvolvimento de microserviços.',
      published_year: 2018,
      pages: 520,
      language: 'pt-BR',
      total_copies: 3,
      available_copies: 1
    },
    {
      id: uuidv4(),
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      isbn: '9788501061867',
      category: 'Literatura',
      description: 'Obra-prima do realismo mágico sobre a família Buendía.',
      published_year: 1967,
      pages: 432,
      language: 'pt-BR',
      total_copies: 3,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'Node.js: The Right Way',
      author: 'Jim Wilson',
      isbn: '9781680501957',
      category: 'Tecnologia',
      description: 'Desenvolvimento servidor moderno com Node.js.',
      published_year: 2018,
      pages: 334,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 1
    },
    {
      id: uuidv4(),
      title: 'O Auto da Compadecida',
      author: 'Ariano Suassuna',
      isbn: '9788520925157',
      category: 'Teatro',
      description: 'Peça teatral clássica da literatura brasileira.',
      published_year: 1955,
      pages: 178,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 2
    },
    {
      id: uuidv4(),
      title: 'React: Up & Running',
      author: 'Stoyan Stefanov',
      isbn: '9781491931820',
      category: 'Tecnologia',
      description: 'Desenvolvimento de interfaces com React.',
      published_year: 2016,
      pages: 222,
      language: 'pt-BR',
      total_copies: 4,
      available_copies: 3
    },
    {
      id: uuidv4(),
      title: 'Capitães da Areia',
      author: 'Jorge Amado',
      isbn: '9788535925457',
      category: 'Literatura',
      description: 'Romance sobre meninos de rua em Salvador.',
      published_year: 1937,
      pages: 280,
      language: 'pt-BR',
      total_copies: 2,
      available_copies: 1
    },
    {
      id: uuidv4(),
      title: 'Docker Deep Dive',
      author: 'Nigel Poulton',
      isbn: '9781521822807',
      category: 'Tecnologia',
      description: 'Guia aprofundado sobre containerização com Docker.',
      published_year: 2017,
      pages: 312,
      language: 'pt-BR',
      total_copies: 3,
      available_copies: 2
    }
  ];

  // Inserir livros
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO books 
    (id, title, author, isbn, category, description, published_year, pages, language, total_copies, available_copies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleBooks.forEach(book => {
    stmt.run([
      book.id,
      book.title,
      book.author,
      book.isbn,
      book.category,
      book.description,
      book.published_year,
      book.pages,
      book.language,
      book.total_copies,
      book.available_copies
    ]);
  });

  stmt.finalize();

  // Inserir categorias
  console.log('📂 Inserindo categorias...');
  const defaultCategories = [
    { id: uuidv4(), name: 'Tecnologia', description: 'Livros sobre programação, desenvolvimento e tecnologia' },
    { id: uuidv4(), name: 'Ficção', description: 'Romances, aventuras e histórias ficcionais' },
    { id: uuidv4(), name: 'Literatura Clássica', description: 'Clássicos da literatura nacional e internacional' },
    { id: uuidv4(), name: 'Literatura', description: 'Literatura em geral' },
    { id: uuidv4(), name: 'Teatro', description: 'Peças teatrais e dramaturgia' }
  ];

  const stmtCategories = db.prepare(`
    INSERT OR REPLACE INTO categories (id, name, description)
    VALUES (?, ?, ?)
  `);

  defaultCategories.forEach(category => {
    stmtCategories.run([category.id, category.name, category.description]);
  });

  stmtCategories.finalize();

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📊 Estatísticas:');
  console.log(`   - ${sampleBooks.length} livros inseridos`);
  console.log(`   - 5 categorias disponíveis`);
  console.log('\n💡 Para testar o sistema:');
  console.log('   1. Inicie o Books Service: npm start');
  console.log('   2. Inicie o API Gateway: npm start');
  console.log('   3. Acesse http://localhost:3001/api/books');
  
  db.close((err) => {
    if (err) {
      console.error('❌ Erro ao fechar banco:', err);
    } else {
      console.log('✅ Conexão com banco fechada');
    }
  });
});
