import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, X } from 'lucide-react'
import { booksService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const BookForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = !!id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm()

  // Buscar livro se estiver editando
  const { data: book, isLoading } = useQuery(
    ['book', id],
    () => booksService.getBook(id),
    {
      enabled: isEditing,
      onSuccess: (data) => {
        reset({
          title: data.title,
          author: data.author,
          isbn: data.isbn || '',
          category: data.category,
          description: data.description || '',
          published_year: data.published_year || '',
          pages: data.pages || '',
          language: data.language || 'pt-BR',
          total_copies: data.total_copies || 1
        })
      }
    }
  )

  // Mutação para criar/atualizar livro
  const mutation = useMutation(
    (data) => isEditing ? booksService.updateBook(id, data) : booksService.createBook(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('books')
        queryClient.invalidateQueries(['book', data.id])
        
        toast.success(isEditing ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!')
        navigate(`/books/${data.id}`)
      },
      onError: (error) => {
        const message = error.response?.data?.error || 
                       (isEditing ? 'Erro ao atualizar livro' : 'Erro ao criar livro')
        toast.error(message)
      }
    }
  )

  const onSubmit = (data) => {
    // Converter strings vazias para null/undefined onde apropriado
    const processedData = {
      ...data,
      published_year: data.published_year ? parseInt(data.published_year) : null,
      pages: data.pages ? parseInt(data.pages) : null,
      total_copies: parseInt(data.total_copies) || 1,
      isbn: data.isbn || null
    }

    mutation.mutate(processedData)
  }

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        navigate(-1)
      }
    } else {
      navigate(-1)
    }
  }

  if (isEditing && isLoading) {
    return <LoadingSpinner text="Carregando livro..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}
            </h1>
          </div>
        </div>

        {/* Formulário */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { 
                  required: 'Título é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Título deve ter pelo menos 2 caracteres'
                  }
                })}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Digite o título do livro"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Autor */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <input
                id="author"
                type="text"
                {...register('author', { 
                  required: 'Autor é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome do autor deve ter pelo menos 2 caracteres'
                  }
                })}
                className={`input ${errors.author ? 'border-red-500' : ''}`}
                placeholder="Digite o nome do autor"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                {...register('category', { required: 'Categoria é obrigatória' })}
                className={`input ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Ficção">Ficção</option>
                <option value="Ciência">Ciência</option>
                <option value="História">História</option>
                <option value="Biografia">Biografia</option>
                <option value="Filosofia">Filosofia</option>
                <option value="Arte">Arte</option>
                <option value="Educação">Educação</option>
                <option value="Saúde">Saúde</option>
                <option value="Negócios">Negócios</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                id="isbn"
                type="text"
                {...register('isbn', {
                  pattern: {
                    value: /^(?:\d{10}|\d{13}|[\d-]{13,17})$/,
                    message: 'ISBN deve ter 10 ou 13 dígitos'
                  }
                })}
                className={`input ${errors.isbn ? 'border-red-500' : ''}`}
                placeholder="Digite o ISBN (opcional)"
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-600">{errors.isbn.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Formato: 1234567890 ou 123-456-789-0
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description', {
                  maxLength: {
                    value: 1000,
                    message: 'Descrição deve ter no máximo 1000 caracteres'
                  }
                })}
                className={`textarea ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Digite uma breve descrição do livro"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Grid com campos menores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ano de publicação */}
              <div>
                <label htmlFor="published_year" className="block text-sm font-medium text-gray-700 mb-1">
                  Ano de Publicação
                </label>
                <input
                  id="published_year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  {...register('published_year', {
                    min: {
                      value: 1000,
                      message: 'Ano deve ser maior que 1000'
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: 'Ano não pode ser no futuro'
                    }
                  })}
                  className={`input ${errors.published_year ? 'border-red-500' : ''}`}
                  placeholder="Ex: 2023"
                />
                {errors.published_year && (
                  <p className="mt-1 text-sm text-red-600">{errors.published_year.message}</p>
                )}
              </div>

              {/* Número de páginas */}
              <div>
                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Páginas
                </label>
                <input
                  id="pages"
                  type="number"
                  min="1"
                  {...register('pages', {
                    min: {
                      value: 1,
                      message: 'Número de páginas deve ser maior que 0'
                    }
                  })}
                  className={`input ${errors.pages ? 'border-red-500' : ''}`}
                  placeholder="Ex: 350"
                />
                {errors.pages && (
                  <p className="mt-1 text-sm text-red-600">{errors.pages.message}</p>
                )}
              </div>

              {/* Idioma */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <select
                  id="language"
                  {...register('language')}
                  className="input"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">Inglês</option>
                  <option value="es">Espanhol</option>
                  <option value="fr">Francês</option>
                  <option value="de">Alemão</option>
                  <option value="it">Italiano</option>
                </select>
              </div>

              {/* Total de cópias */}
              <div>
                <label htmlFor="total_copies" className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Cópias *
                </label>
                <input
                  id="total_copies"
                  type="number"
                  min="1"
                  {...register('total_copies', {
                    required: 'Total de cópias é obrigatório',
                    min: {
                      value: 1,
                      message: 'Deve ter pelo menos 1 cópia'
                    }
                  })}
                  className={`input ${errors.total_copies ? 'border-red-500' : ''}`}
                  placeholder="Ex: 1"
                />
                {errors.total_copies && (
                  <p className="mt-1 text-sm text-red-600">{errors.total_copies.message}</p>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary flex items-center space-x-2 flex-1 sm:flex-none"
                disabled={mutation.isLoading}
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex items-center space-x-2 flex-1"
                disabled={mutation.isLoading}
              >
                <Save className="h-4 w-4" />
                <span>
                  {mutation.isLoading 
                    ? (isEditing ? 'Salvando...' : 'Criando...') 
                    : (isEditing ? 'Salvar Alterações' : 'Criar Livro')
                  }
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Informações sobre campos obrigatórios */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Os campos marcados com * são obrigatórios</p>
        </div>
      </div>
    </div>
  )
}

export default BookForm
