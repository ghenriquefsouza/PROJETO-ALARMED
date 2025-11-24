import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/home.css"; // importa estilos da logo

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/home");
    } catch (error) {
      alert("Email ou senha incorretos!");
      console.log(error);
    }
  };

  return (
    <div className="login-container">

      {/* LOGO igual à Home */}
      <div className="login-logo">
        <div className="icon-pill">💊</div>
        <h1 className="titulo-app">
          ALAR<span>MED</span>
        </h1>
        <p className="subtitulo-app">Seu controle inteligente de medicamentos.</p>
      </div>

      <div className="login-card fade-in">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="login-input"
        />

        <button className="btn-login" onClick={handleLogin}>
          Entrar
        </button>

        <div className="register-link">
          Não tem conta? <Link to="/register">Cadastrar</Link>
        </div>
      </div>
    </div>
  );
}
