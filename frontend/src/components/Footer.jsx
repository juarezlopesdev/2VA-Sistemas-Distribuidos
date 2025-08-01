import React from 'react'
import { BookOpen, Github, Code2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold">Biblioteca Digital</span>
            </div>
            <p className="text-gray-400 text-sm">
              Sistema distribuído para gerenciamento de biblioteca digital, 
              desenvolvido com arquitetura de microserviços.
            </p>
          </div>

          {/* Tecnologias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tecnologias</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Node.js + Express (API Gateway)</li>
              <li>• SQLite (Books Service)</li>
              <li>• React + Vite (Frontend)</li>
              <li>• Redis (Cache)</li>
              <li>• JWT (Autenticação)</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>

          {/* Características do Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Arquitetura distribuída</li>
              <li>• Cache inteligente</li>
              <li>• Busca avançada</li>
              <li>• Sistema de recomendações</li>
              <li>• Métricas e monitoramento</li>
              <li>• Interface responsiva</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Biblioteca Digital Distribuída. Projeto acadêmico de Sistemas Distribuídos.
            </p>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Code2 className="h-4 w-4" />
                <span>Sistema Distribuído</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Github className="h-4 w-4" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
