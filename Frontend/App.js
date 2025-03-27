import TelaCadastroFuncionario from "./componentes/Telas/TelaCadastro/FormCadFuncionario";
import TelaTabelaFuncionario from "./componentes/ListaFuncionario"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, createContext } from "react";
import store from './redux/store';
import { Provider } from "react-redux";
import './App.css';

export const ContextoUsuario=createContext();

function App() {
    return (
      <div className="App">
        <Provider store={store}>
          <BrowserRouter>
            { //A ordem das rotas é importante 
            }
            <Routes>
              <Route path="/cadastro_funcionarios" element={<TelaCadastroFuncionario />} />
              <Route path="/tabela_funcionarios" element={<TelaTabelaFuncionario />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </div>
    );
  
}

export default App;
