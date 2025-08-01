import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, Search, Users, BarChart3, Star, TrendingUp, Plus, Settings } from 'lucide-react'
import { booksService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  
  // Buscar livros recentes para exibir na home (somente se autenticado)
  const { data: booksData, isLoading } = useQuery(
    'recent-books',
    () => booksService.getBooks({ limit: 6 }),
    { 
      enabled: isAuthenticated, // Só executa se estiver autenticado
      staleTime: 5 * 60 * 1000,
      retry: 2
    }
  )

  // Buscar recomendações se disponível (somente se autenticado)
  const { data: recommendations } = useQuery(
    'recommendations',
    () => booksService.getRecommendations(),
    { 
      enabled: isAuthenticated, // Só executa se estiver autenticado
      retry: false,
      staleTime: 10 * 60 * 1000
    }
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Biblioteca Digital
              <span className="block text-primary-200">Distribuída</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Explore nosso catálogo de livros em uma arquitetura distribuída moderna, 
              com busca avançada e recomendações personalizadas.
            </p>
            
            {isAuthenticated ? (
              // Seção para usuários logados
              <div className="mb-8">
                {user?.role === 'admin' ? (
                  // Conteúdo para administradores
                  <div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto mb-6">
                      <h2 className="text-2xl font-bold mb-4 text-white">
                        Bem-vindo, Administrador {user.fullName}!
                      </h2>
                      <p className="text-primary-100 mb-4">
                        Gerencie o sistema, adicione novos livros e monitore as atividades.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Link
                        to="/books"
                        className="btn btn-white px-6 py-3 flex items-center space-x-2"
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Ver Catálogo</span>
                      </Link>
                      <Link
                        to="/admin/panel"
                        className="btn btn-secondary px-6 py-3 flex items-center space-x-2"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Painel Admin</span>
                      </Link>
                      <Link
                        to="/admin"
                        className="btn btn-secondary px-6 py-3 flex items-center space-x-2"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Conteúdo para usuários comuns
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      Bem-vindo, {user.fullName}!
                    </h2>
                    <p className="text-primary-100 mb-4">
                      Você está logado no sistema. Para acessar funcionalidades administrativas, 
                      entre em contato com um administrador.
                    </p>
                    <div className="text-sm text-primary-200">
                      <p>🔒 Funcionalidades disponíveis apenas para administradores:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Visualizar catálogo de livros</li>
                        <li>Adicionar e editar livros</li>
                        <li>Acessar dashboard e estatísticas</li>
                        <li>Gerenciar usuários do sistema</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Seção para usuários não logados
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Fazer Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-primary-600 transition-colors"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Características do Sistema */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema Distribuído Moderno
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Construído com as melhores práticas de sistemas distribuídos,
              garantindo performance, escalabilidade e disponibilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Microserviços</h3>
              <p className="text-gray-600 text-sm">
                Arquitetura baseada em microserviços para máxima escalabilidade
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cache Inteligente</h3>
              <p className="text-gray-600 text-sm">
                Sistema de cache distribuído com Redis para alta performance
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Busca Avançada</h3>
              <p className="text-gray-600 text-sm">
                Busca fuzzy com Fuse.js para encontrar exatamente o que procura
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monitoramento</h3>
              <p className="text-gray-600 text-sm">
                Métricas em tempo real com Prometheus para observabilidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Livros Recentes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Livros Recentes</h2>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {booksData?.books?.slice(0, 6).map((book) => (
                <div key={book.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">por {book.author}</p>
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {book.category}
                      </span>
                    </div>
                    {book.rating > 0 && (
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600">{book.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  {book.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  )}
                  
                  <Link
                    to={`/books/${book.id}`}
                    className="btn btn-primary w-full text-center"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recomendações */}
      {recommendations?.recommendations?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recomendados para Você</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.recommendations.slice(0, 3).map((book) => (
                <div key={book.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">Recomendado</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">por {book.author}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                      {book.category}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600">{book.avg_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/books/${book.id}`}
                    className="btn btn-primary w-full text-center"
                  >
                    Ver Livro
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para explorar?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Descubra milhares de livros em nosso sistema distribuído de alta performance.
          </p>
          <Link
            to="/books"
            className="btn bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 text-lg font-medium"
          >
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
