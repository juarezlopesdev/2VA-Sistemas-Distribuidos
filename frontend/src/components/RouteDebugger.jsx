import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RouteDebugger = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const testRoutes = [
    { path: '/', name: 'Home' },
    { path: '/books', name: 'Catálogo de Livros' },
    { path: '/login', name: 'Login' },
    { path: '/search', name: 'Busca' },
    { path: '/admin', name: 'Dashboard Admin' },
    { path: '/books/new', name: 'Novo Livro' }
  ]

  const handleNavigate = (path) => {
    console.log(`Navegando para: ${path}`)
    try {
      navigate(path)
      console.log(`✅ Navegação para ${path} bem-sucedida`)
    } catch (error) {
      console.error(`❌ Erro na navegação para ${path}:`, error)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🔍 Depurador de Rotas - Biblioteca Digital
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📍 Localização Atual</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>Pathname:</strong> {location.pathname}</p>
          <p><strong>Search:</strong> {location.search}</p>
          <p><strong>Hash:</strong> {location.hash}</p>
          <p><strong>State:</strong> {JSON.stringify(location.state)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🧪 Teste de Navegação</h2>
        <p className="text-gray-600 mb-4">
          Clique nos botões abaixo para testar a navegação entre rotas:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {testRoutes.map((route) => (
            <button
              key={route.path}
              onClick={() => handleNavigate(route.path)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🔗 Links Diretos</h2>
        <p className="text-gray-600 mb-4">
          Use os links abaixo para testar navegação via Link component:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {testRoutes.map((route) => (
            <a
              key={route.path}
              href={route.path}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm text-center block"
              onClick={(e) => {
                e.preventDefault()
                handleNavigate(route.path)
              }}
            >
              {route.name}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Informações do Sistema</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          <p><strong>URL:</strong> {window.location.href}</p>
          <p><strong>História disponível:</strong> {window.history.length}</p>
          <p><strong>React Router Version:</strong> Verificar no package.json</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 Dicas de Depuração:</h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Abra o Console do Desenvolvedor (F12) para ver logs de navegação</li>
          <li>• Verifique se há erros de JavaScript no console</li>
          <li>• Confirme se todos os componentes estão sendo importados corretamente</li>
          <li>• Verifique se o servidor de desenvolvimento está rodando na porta correta</li>
        </ul>
      </div>
    </div>
  )
}

export default RouteDebugger
