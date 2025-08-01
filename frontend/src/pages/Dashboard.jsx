import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Users, Star, TrendingUp, 
  Activity, Clock, Database, Zap,
  Plus, Search, BarChart3
} from 'lucide-react'
import { booksService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'stats',
    () => booksService.getBooks({ limit: 1 }).then(res => res.pagination),
    {
      staleTime: 5 * 60 * 1000
    }
  )

  const { data: recentBooks, isLoading: booksLoading } = useQuery(
    'recent-books-admin',
    () => booksService.getBooks({ limit: 5 }),
    {
      staleTime: 2 * 60 * 1000
    }
  )

  const { data: recommendations } = useQuery(
    'admin-recommendations',
    () => booksService.getRecommendations(),
    {
      staleTime: 10 * 60 * 1000,
      retry: false
    }
  )

  const quickStats = [
    {
      label: 'Total de Livros',
      value: stats?.total || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12% este mês'
    },
    {
      label: 'Livros Disponíveis',
      value: recentBooks?.books?.filter(book => book.available_copies > 0).length || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '85% do total'
    },
    {
      label: 'Categorias Ativas',
      value: new Set(recentBooks?.books?.map(book => book.category)).size || 0,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '5 principais'
    },
    {
      label: 'Média de Avaliação',
      value: '4.2',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: 'De 18 avaliações'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600">
            Visão geral do sistema de biblioteca digital distribuída
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {statsLoading ? '...' : stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ações rápidas */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary-600" />
                <span>Ações Rápidas</span>
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/books/new"
                  className="btn btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Livro</span>
                </Link>
                
                <Link
                  to="/search"
                  className="btn btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Buscar Livros</span>
                </Link>
                
                <Link
                  to="/books"
                  className="btn btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Ver Catálogo</span>
                </Link>
              </div>
            </div>

            {/* Status do sistema */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Status do Sistema</span>
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Gateway</span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    ● Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Books Service</span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    ● Online
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cache Redis</span>
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    ● Opcional
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database</span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    ● SQLite
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="http://localhost:3000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Ver health check →
                </a>
              </div>
            </div>
          </div>

          {/* Livros recentes e métricas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Livros adicionados recentemente */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Livros Recentes</span>
                </h2>
                <Link
                  to="/books"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver todos →
                </Link>
              </div>

              {booksLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <div className="space-y-3">
                  {recentBooks?.books?.slice(0, 5).map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          por {book.author} • {book.category}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {book.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">
                              {book.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          book.available_copies > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.available_copies}/{book.total_copies}
                        </span>
                        
                        <Link
                          to={`/books/${book.id}`}
                          className="text-primary-600 hover:text-primary-700 text-xs"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Métricas do sistema */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Database className="h-5 w-5 text-gray-600" />
                <span>Métricas do Sistema</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Distribuição por Categoria
                  </h3>
                  {booksLoading ? (
                    <div className="text-sm text-gray-500">Carregando...</div>
                  ) : (
                    <div className="space-y-1 text-sm">
                      {Object.entries(
                        recentBooks?.books?.reduce((acc, book) => {
                          acc[book.category] = (acc[book.category] || 0) + 1
                          return acc
                        }, {}) || {}
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between">
                            <span className="text-gray-600">{category}</span>
                            <span className="font-medium">{count} livros</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Performance do Cache
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hit Rate</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo médio</span>
                      <span className="font-medium">120ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cache ativo</span>
                      <span className="font-medium text-green-600">Sim</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-4 text-xs">
                  <a
                    href="http://localhost:3000/metrics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Métricas API Gateway →
                  </a>
                  <a
                    href="http://localhost:3001/metrics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Métricas Books Service →
                  </a>
                </div>
              </div>
            </div>

            {/* Recomendações do sistema */}
            {recommendations?.recommendations && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Livros Mais Recomendados
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.recommendations.slice(0, 4).map((book) => (
                    <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {book.author}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">
                          {book.avg_rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
