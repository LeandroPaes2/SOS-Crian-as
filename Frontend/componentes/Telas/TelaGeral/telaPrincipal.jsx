

// src/pages/TelaPrincipal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TelaPrincipal() {
    const navigate = useNavigate();
    const irParaCadastro = () => {
        navigate('/cadastro_funcionarios');
    }
    const irParaTabela = () => {
      navigate('/tabela_funcionarios');
  }
  return (
    <div className="cadastro-wrapper">
        <div className="cadastro-container">
          <h1>Tela Principal</h1>
          <button onClick={irParaCadastro} style={{marginBottom: 100, marginTop:100}}>Ir para Cadastro de Funcionários</button>
          <button onClick={irParaTabela}>Ir para Tabela de Funcionários</button>
        </div>
      </div>

  );

}


