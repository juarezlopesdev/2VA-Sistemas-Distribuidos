import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import BookForm from './pages/BookForm'
import Search from './pages/Search'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import LoadingSpinner from './components/LoadingSpinner'

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

// Componente para proteger rotas administrativas
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* Catálogo só para admins */}
        <Route path="books" element={
          <AdminRoute>
            <BookList />
          </AdminRoute>
        } />
        <Route path="books/:id" element={
          <AdminRoute>
            <BookDetail />
          </AdminRoute>
        } />
        <Route path="search" element={
          <AdminRoute>
            <Search />
          </AdminRoute>
        } />
        
        {/* Rotas administrativas */}
        <Route path="admin" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="admin/panel" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
        <Route path="books/new" element={
          <AdminRoute>
            <BookForm />
          </AdminRoute>
        } />
        <Route path="books/:id/edit" element={
          <AdminRoute>
            <BookForm />
          </AdminRoute>
        } />
      </Route>
      
      {/* Rota 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-4">Página não encontrada</p>
            <a href="/" className="btn btn-primary px-6 py-2">
              Voltar ao início
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
