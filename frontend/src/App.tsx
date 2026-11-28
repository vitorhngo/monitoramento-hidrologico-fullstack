import { Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Home from './pages/home/Home'

// Rotas da aplicação: página inicial (/) e painel de monitoramento (/painel).
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/painel" element={<Dashboard />} />
      {/* Qualquer outro endereço volta para a página inicial. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
