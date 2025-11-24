// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Historico from "./pages/Historico";
import Cadastro from "./pages/Cadastro";
import EditarRemedio from "./pages/EditarRemedio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import useNotificacoes from "./hooks/useNotificacoes";

function App() {
  // <-- Chamando o hook global de notificações
  useNotificacoes();

  return (
    <BrowserRouter>
      <Routes>

        {/* Login / Cadastro */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/historico"
          element={
            <RequireAuth>
              <Historico />
            </RequireAuth>
          }
        />
        <Route
          path="/cadastro"
          element={
            <RequireAuth>
              <Cadastro />
            </RequireAuth>
          }
        />
        {/* Rota de edição */}
        <Route
          path="/editar/:id"
          element={
            <RequireAuth>
              <EditarRemedio />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

