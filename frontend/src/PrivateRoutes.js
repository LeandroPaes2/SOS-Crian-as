import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from './LoginContext';

export default function PrivateRoute({ niveisPermitidos }) {
  const { funcionario, isLogado } = useLogin();

  if (!isLogado) {
    return <Navigate to="/" replace />;
  }

  if (!niveisPermitidos.includes(funcionario?.nivel)) {
    return <Navigate to="/telaMenu" replace />;
  }

  return <Outlet />;
}
