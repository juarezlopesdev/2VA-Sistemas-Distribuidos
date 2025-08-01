import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Search, Filter, Star, Book, Plus } from 'lucide-react'
import { booksService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const BookList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    available: false
  })
  const { isAuthenticated, user } = useAuth()

  const { data, isLoading, error } = useQuery(
    ['books', currentPage, filters],
    () => booksService.getBooks({
      page: currentPage,
      limit: 12,
      ...filters
    }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
      available: false
    })
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Book className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar livros</h2>
          <p className="text-gray-600 mb-4">Não foi possível conectar ao serviço de livros</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Livros</h1>
            <p className="text-gray-600">
              {data && `${data.pagination?.total || 0} livros disponíveis`}
            </p>
          </div>
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/books/new"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Livro</span>
            </Link>
          )}
        </div>

        {/* Filtros */}
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                <option value="">Todas as categorias</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Ficção">Ficção</option>
                <option value="Ciência">Ciência</option>
                <option value="História">História</option>
                <option value="Biografia">Biografia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                placeholder="Filtrar por autor"
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="input"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="available"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="available" className="text-sm text-gray-700">
                Apenas disponíveis
              </label>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn btn-secondary w-full"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Livros */}
        {isLoading ? (
          <LoadingSpinner text="Carregando livros..." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data?.books?.map((book) => (
                <div key={book.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col h-full">
                    {/* Header com rating */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        {book.category}
                      </span>
                      {book.rating > 0 && (
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600">{book.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Título e autor */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">por {book.author}</p>

                    {/* Informações adicionais */}
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      {book.published_year && (
                        <p>Publicado em {book.published_year}</p>
                      )}
                      {book.pages && (
                        <p>{book.pages} páginas</p>
                      )}
                      <p>
                        Disponíveis: {book.available_copies}/{book.total_copies}
                      </p>
                    </div>

                    {/* Descrição */}
                    {book.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {book.description}
                      </p>
                    )}

                    {/* Status de disponibilidade */}
                    <div className="mb-4">
                      {book.available_copies > 0 ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Disponível
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Indisponível
                        </span>
                      )}
                    </div>

                    {/* Botão de ação */}
                    <Link
                      to={`/books/${book.id}`}
                      className="btn btn-primary w-full text-center mt-auto"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: data.pagination.pages }, (_, i) => i + 1)
                    .filter(page => {
                      const current = currentPage
                      return page === 1 || 
                             page === data.pagination.pages || 
                             (page >= current - 2 && page <= current + 2)
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-3 py-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pagination.pages))}
                  disabled={currentPage === data.pagination.pages}
                  className="btn btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}

            {/* Estado vazio */}
            {data?.books?.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum livro encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou adicione novos livros ao catálogo
                </p>
                {isAuthenticated && (
                  <Link
                    to="/books/new"
                    className="btn btn-primary"
                  >
                    Adicionar Primeiro Livro
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BookList
