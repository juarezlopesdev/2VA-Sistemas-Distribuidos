import React, { useState, useEffect } from 'react'
import { Users, BookOpen, BarChart3, Shield, Trash2, UserCheck, UserX } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { adminService } from '../services/api'
import toast from 'react-hot-toast'

const AdminPanel = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('users')

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersData, statsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats()
      ])
      setUsers(usersData)
      setStats(statsData)
    } catch (error) {
      toast.error('Erro ao carregar dados administrativos')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (username, newRole) => {
    try {
      await adminService.updateUserRole(username, newRole)
      toast.success(`Role do usuário ${username} atualizada para ${newRole}`)
      loadData() // Recarregar dados
    } catch (error) {
      toast.error('Erro ao atualizar role do usuário')
      console.error('Erro:', error)
    }
  }

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${username}?`)) {
      try {
        await adminService.deleteUser(username)
        toast.success(`Usuário ${username} deletado com sucesso`)
        loadData() // Recarregar dados
      } catch (error) {
        toast.error('Erro ao deletar usuário')
        console.error('Erro:', error)
      }
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você precisa de permissões de administrador para acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gerencie usuários e monitore o sistema</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Usuários
              </button>
              <button
                onClick={() => setSelectedTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'stats'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Estatísticas
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {selectedTab === 'users' && (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gerenciar Usuários</h2>
              <p className="text-gray-600">Total de usuários: {users.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <tr key={userItem.username}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.fullName}
                          </div>
                          <div className="text-sm text-gray-500">@{userItem.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {userItem.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {userItem.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {userItem.username !== user.username && (
                            <>
                              <button
                                onClick={() =>
                                  handleRoleChange(
                                    userItem.username,
                                    userItem.role === 'admin' ? 'user' : 'admin'
                                  )
                                }
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                                  userItem.role === 'admin'
                                    ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                    : 'text-purple-700 bg-purple-100 hover:bg-purple-200'
                                }`}
                              >
                                {userItem.role === 'admin' ? (
                                  <>
                                    <UserX className="w-3 h-3 mr-1" />
                                    Remover Admin
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Tornar Admin
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(userItem.username)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Deletar
                              </button>
                            </>
                          )}
                          {userItem.username === user.username && (
                            <span className="text-xs text-gray-500 italic">Você</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estatísticas de Usuários */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Usuários</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Administradores:</span>
                  <span className="font-medium">{stats.users.admins}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usuários Regulares:</span>
                  <span className="font-medium">{stats.users.regularUsers}</span>
                </div>
              </div>
            </div>

            {/* Estatísticas de Livros */}
            {stats.books && !stats.books.error && (
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Livros</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.books.totalBooks || 0}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Categorias:</span>
                    <span className="font-medium">{stats.books.totalCategories || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Disponíveis:</span>
                    <span className="font-medium">{stats.books.availableBooks || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status do Sistema */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Sistema</h3>
                  <p className="text-sm text-green-600 font-medium">Online</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Última atualização:</span>
                  <span className="font-medium">
                    {new Date(stats.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
