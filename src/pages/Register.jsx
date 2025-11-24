import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
  if (error.code === "auth/email-already-in-use") {
    alert("Este email já está cadastrado. Tente fazer login.");
  } else if (error.code === "auth/weak-password") {
    alert("A senha deve ter pelo menos 6 caracteres.");
  } else if (error.code === "auth/invalid-email") {
    alert("Email inválido.");
  } else {
    alert("Erro ao cadastrar usuário.");
  }
  console.log(error);
}

  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Criar Conta</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Crie uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <button onClick={handleRegister}>Cadastrar</button>

        <div className="login-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}

