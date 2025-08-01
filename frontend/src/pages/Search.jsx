import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Search, Filter, Star, Book, X } from 'lucide-react'
import { booksService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    author: searchParams.get('author') || ''
  })

  const { data, isLoading, error } = useQuery(
    ['search', filters],
    () => booksService.searchBooks(filters),
    {
      enabled: !!(filters.q || filters.category || filters.author),
      staleTime: 2 * 60 * 1000
    }
  )

  const handleSearch = (newFilters) => {
    setFilters(newFilters)
    
    // Atualizar URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const newFilters = { q: '', category: '', author: '' }
    setFilters(newFilters)
    setSearchParams({})
  }

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const searchQuery = formData.get('search')
    
    handleSearch({
      ...filters,
      q: searchQuery
    })
  }

  const hasActiveFilters = filters.q || filters.category || filters.author
  const hasResults = data?.results?.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Buscar Livros
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use nossa busca avançada para encontrar exatamente o que procura. 
            Nossa busca inteligente encontra livros mesmo com erros de digitação.
          </p>
        </div>

        {/* Formulário de busca principal */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleQuickSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="Buscar por título, autor, descrição..."
                  defaultValue={filters.q}
                  className="input pl-10 text-base"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary px-8 py-3"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Filtros avançados */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filtros Avançados</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleSearch({ ...filters, category: e.target.value })}
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
                  placeholder="Nome do autor"
                  value={filters.author}
                  onChange={(e) => handleSearch({ ...filters, author: e.target.value })}
                  className="input"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar Filtros</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros ativos */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filtros ativos:</span>
                
                {filters.q && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    Busca: "{filters.q}"
                    <button
                      onClick={() => handleSearch({ ...filters, q: '' })}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    Categoria: {filters.category}
                    <button
                      onClick={() => handleSearch({ ...filters, category: '' })}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {filters.author && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    Autor: {filters.author}
                    <button
                      onClick={() => handleSearch({ ...filters, author: '' })}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {hasActiveFilters && (
          <div>
            {isLoading ? (
              <LoadingSpinner text="Buscando livros..." />
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Erro na busca
                </h3>
                <p className="text-gray-600">
                  Não foi possível realizar a busca. Tente novamente.
                </p>
              </div>
            ) : hasResults ? (
              <>
                {/* Informações dos resultados */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {data.total} {data.total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </h2>
                  
                  {data.results.some(book => book.searchScore) && (
                    <div className="text-sm text-gray-600">
                      Ordenado por relevância
                    </div>
                  )}
                </div>

                {/* Grid de resultados */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.results.map((book) => (
                    <div key={book.id} className="card p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col h-full">
                        {/* Header com categoria e score */}
                        <div className="flex items-start justify-between mb-3">
                          <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {book.category}
                          </span>
                          
                          {book.searchScore && (
                            <div className="text-xs text-gray-500">
                              {Math.round(book.searchScore * 100)}% match
                            </div>
                          )}
                        </div>

                        {/* Título e autor */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">por {book.author}</p>

                        {/* Rating se disponível */}
                        {book.rating > 0 && (
                          <div className="flex items-center space-x-1 mb-3">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">
                              {book.rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Descrição */}
                        {book.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                            {book.description}
                          </p>
                        )}

                        {/* Informações adicionais */}
                        <div className="text-xs text-gray-500 mb-4 space-y-1">
                          {book.published_year && (
                            <p>Publicado em {book.published_year}</p>
                          )}
                          <p>
                            Disponíveis: {book.available_copies}/{book.total_copies}
                          </p>
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
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os termos de busca ou usar filtros diferentes.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>💡 <strong>Dicas:</strong></p>
                  <p>• Use palavras-chave mais simples</p>
                  <p>• Verifique a ortografia</p>
                  <p>• Tente buscar por categoria ou autor</p>
                  <p>• Nossa busca funciona mesmo com erros de digitação!</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial - sem filtros */}
        {!hasActiveFilters && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Book className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pronto para buscar?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Digite um termo de busca acima ou use os filtros avançados 
              para encontrar livros específicos.
            </p>
            
            {/* Sugestões de busca rápida */}
            <div className="max-w-2xl mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Buscas populares:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: 'Tecnologia', type: 'category', value: 'Tecnologia' },
                  { label: 'Ficção', type: 'category', value: 'Ficção' },
                  { label: 'Robert Martin', type: 'author', value: 'Robert C. Martin' },
                  { label: 'Tolkien', type: 'author', value: 'J.R.R. Tolkien' },
                  { label: 'JavaScript', type: 'q', value: 'JavaScript' },
                  { label: 'História', type: 'category', value: 'História' }
                ].map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => handleSearch({ 
                      ...filters, 
                      [suggestion.type]: suggestion.value 
                    })}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
