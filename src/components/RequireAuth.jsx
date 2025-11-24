import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
    return <div>Carregando...</div>; // evita piscar telas
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

