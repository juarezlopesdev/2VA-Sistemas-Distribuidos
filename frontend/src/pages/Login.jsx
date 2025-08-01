import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setErrorMessage('') // Limpar erro anterior
    
    try {
      const result = await login(data)
      
      if (result.success) {
        toast.success('Login realizado com sucesso!')
        // Redirecionar para a página inicial após login bem-sucedido
        navigate('/')
      } else {
        // Mensagens de erro específicas
        let errorMsg = ''
        switch (result.error) {
          case 'Usuário não encontrado':
            errorMsg = 'Este usuário não existe. Verifique o nome de usuário ou crie uma nova conta.'
            break
          case 'Senha incorreta':
            errorMsg = 'Senha incorreta. Verifique sua senha e tente novamente.'
            break
          case 'Usuário e senha são obrigatórios':
            errorMsg = 'Por favor, preencha todos os campos.'
            break
          default:
            errorMsg = result.error || 'Erro no login. Tente novamente.'
        }
        
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      const errorMsg = 'Erro inesperado no login. Tente novamente.'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Faça login em sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>
        
        {/* Mensagem de erro */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username', { 
                  required: 'Usuário é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Usuário deve ter pelo menos 3 caracteres'
                  }
                })}
                className={`mt-1 input ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Digite seu usuário"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            Este é um sistema de demonstração para fins acadêmicos.
            <br />
            <span className="text-primary-600 font-medium">
              Sistemas Distribuídos - Projeto de Avaliação
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
