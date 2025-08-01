import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TestePage = () => {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    console.log(`Tentando navegar para: ${path}`)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🧪 Página de Teste de Navegação
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Teste com Links (React Router Link)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
              >
                Home
              </Link>
              <Link 
                to="/books" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
              >
                Livros
              </Link>
              <Link 
                to="/login" 
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center"
              >
                Login
              </Link>
              <Link 
                to="/search" 
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-center"
              >
                Busca
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Teste com Botões (useNavigate)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleNavigation('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('/books')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Livros
              </button>
              <button 
                onClick={() => handleNavigation('/login')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/search')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Busca
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Teste com Links Diretos (HTML)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a 
                href="/" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center block"
              >
                Home
              </a>
              <a 
                href="/books" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center block"
              >
                Livros
              </a>
              <a 
                href="/login" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center block"
              >
                Login
              </a>
              <a 
                href="/search" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center block"
              >
                Busca
              </a>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 Instruções de Teste:</h3>
            <ol className="text-yellow-700 space-y-2">
              <li>1. <strong>Links React Router:</strong> Devem navegar sem recarregar a página</li>
              <li>2. <strong>Botões useNavigate:</strong> Devem navegar programaticamente</li>
              <li>3. <strong>Links HTML:</strong> Vão recarregar a página (comportamento normal)</li>
              <li>4. <strong>Console:</strong> Abra F12 para ver logs de navegação</li>
            </ol>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🔍 Como Identificar Problemas:</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Se os botões não funcionam: problema com useNavigate</li>
              <li>• Se os Links não funcionam: problema com React Router</li>
              <li>• Se aparecer "404": rota não encontrada no App.jsx</li>
              <li>• Se a página recarrega: problema com BrowserRouter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestePage
