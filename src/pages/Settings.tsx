import { getSupabase } from '../lib/supabase'

export default function Settings() {
  return (
    <div className="space-y-6 relative">
      {/* Decoração de fundo */}
      <div className="fixed right-0 top-20 bottom-0 w-96 opacity-5 pointer-events-none">
        <div className="absolute top-32 right-20 w-48 h-48 bg-brand-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-56 h-56 bg-brand-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-32 w-40 h-40 bg-brand-300 rounded-full blur-3xl"></div>
      </div>

      {getSupabase() === null && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          Variáveis do Supabase não configuradas. Informe VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar o salvamento.
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <img 
          src="/logo-fzia.png" 
          alt="FZIA" 
          className="h-16"
        />
        <div>
          <h1 className="text-2xl font-semibold text-white">Configurações</h1>
          <p className="text-sm text-brand-400/80">Gerencie as configurações do sistema.</p>
        </div>
      </div>

      <div className="card p-6 space-y-6 max-w-3xl">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Configurações do Sistema</h2>
          <p className="text-gray-400">
            Esta página está disponível para futuras configurações do sistema.
          </p>
          
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium text-white mb-2">Informações</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Versão: 1.0.0</li>
              <li>• Projeto: FZ.IA Dashboard</li>
              <li>• Supabase: {getSupabase() ? 'Conectado' : 'Não configurado'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
