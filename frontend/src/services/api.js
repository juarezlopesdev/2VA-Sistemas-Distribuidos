import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Serviços da API
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

export const booksService = {
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params })
    return response.data
  },
  
  getBook: async (id) => {
    const response = await api.get(`/books/${id}`)
    return response.data
  },
  
  createBook: async (book) => {
    const response = await api.post('/books', book)
    return response.data
  },
  
  updateBook: async (id, book) => {
    const response = await api.put(`/books/${id}`, book)
    return response.data
  },
  
  deleteBook: async (id) => {
    await api.delete(`/books/${id}`)
  },
  
  searchBooks: async (query) => {
    const response = await api.get('/search', { params: query })
    return response.data
  },
  
  getRecommendations: async () => {
    const response = await api.get('/recommendations')
    return response.data
  }
}

export const statsService = {
  getStats: async () => {
    const response = await api.get('/stats')
    return response.data
  }
}

export const categoriesService = {
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  }
}

export default api
