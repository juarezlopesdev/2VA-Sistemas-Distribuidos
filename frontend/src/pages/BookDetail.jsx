import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { ArrowLeft, Edit, Trash2, Star, Book, Calendar, FileText, User, Copy } from 'lucide-react'
import { booksService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    () => booksService.getBook(id),
    {
      enabled: !!id,
      retry: 2,
      staleTime: 5 * 60 * 1000
    }
  )

  const deleteMutation = useMutation(
    () => booksService.deleteBook(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('books')
        toast.success('Livro removido com sucesso!')
        navigate('/books')
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Erro ao remover livro')
      }
    }
  )

  const handleDelete = () => {
    deleteMutation.mutate()
    setShowDeleteConfirm(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Carregando livro..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Book className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Livro não encontrado</h2>
          <p className="text-gray-600 mb-4">O livro que você procura não existe ou foi removido</p>
          <Link to="/books" className="btn btn-primary">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegação */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/books"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao catálogo</span>
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <div className="flex space-x-2">
              <Link
                to={`/books/${id}/edit`}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-danger flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remover</span>
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações principais */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {/* Cabeçalho do livro */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {book.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>por {book.author}</span>
                    </div>
                    {book.published_year && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{book.published_year}</span>
                      </div>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    {book.category}
                  </span>
                </div>

                {/* Rating */}
                {book.rating > 0 && (
                  <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold text-gray-900">
                      {book.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({book.review_count || 0} {book.review_count === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {book.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Descrição</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Reviews */}
              {book.reviews && book.reviews.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Avaliações ({book.reviews.length})
                  </h2>
                  <div className="space-y-4">
                    {book.reviews.map((review) => (
                      <div key={review.id} className="border-l-4 border-primary-200 pl-4 py-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            por {review.user_id}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar com informações técnicas */}
          <div className="space-y-6">
            {/* Disponibilidade */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilidade</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cópias disponíveis:</span>
                  <span className="font-semibold text-gray-900">
                    {book.available_copies}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de cópias:</span>
                  <span className="font-semibold text-gray-900">
                    {book.total_copies}
                  </span>
                </div>
                <div className="pt-2">
                  {book.available_copies > 0 ? (
                    <span className="inline-block w-full text-center px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                      ✓ Disponível
                    </span>
                  ) : (
                    <span className="inline-block w-full text-center px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
                      ✗ Indisponível
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes técnicos */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h3>
              <div className="space-y-3 text-sm">
                {book.isbn && (
                  <div>
                    <span className="text-gray-600 block">ISBN:</span>
                    <span className="font-mono text-gray-900">{book.isbn}</span>
                  </div>
                )}
                {book.pages && (
                  <div>
                    <span className="text-gray-600 block">Páginas:</span>
                    <span className="text-gray-900">{book.pages}</span>
                  </div>
                )}
                {book.language && (
                  <div>
                    <span className="text-gray-600 block">Idioma:</span>
                    <span className="text-gray-900">
                      {book.language === 'pt-BR' ? 'Português' : book.language}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 block">Adicionado em:</span>
                  <span className="text-gray-900">
                    {new Date(book.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {book.updated_at !== book.created_at && (
                  <div>
                    <span className="text-gray-600 block">Atualizado em:</span>
                    <span className="text-gray-900">
                      {new Date(book.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copiado!')
                  }}
                  className="btn btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Compartilhar</span>
                </button>
                
                <Link
                  to={`/search?category=${encodeURIComponent(book.category)}`}
                  className="btn btn-secondary w-full text-center"
                >
                  Ver livros similares
                </Link>
                
                <Link
                  to={`/search?author=${encodeURIComponent(book.author)}`}
                  className="btn btn-secondary w-full text-center"
                >
                  Outros livros do autor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover o livro "{book.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary flex-1"
                disabled={deleteMutation.isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger flex-1"
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookDetail
