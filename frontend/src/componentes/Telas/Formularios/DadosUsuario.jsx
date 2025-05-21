import { useLogin } from "../../../LoginContext.js";
import "../../css/dadosUsuario.css";
import { useState } from "react";
import { IoPerson, IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DadosUsuario(){

    const { funcionario } = useLogin();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    
    function buscarDados(){
        const response = fetch("http://localhost:3000/funcionarios/"+funcionario.cpf);
        if(!response)
            console.log("Funcionario nao esta logado.");
    }

    return(
     
        <div className="container">
        <div className="sidebar">
            <Button href="#"><IoPerson/> Dados Pessoais</Button>
            <Button as={Link} to="/telaEmailSenha">< RiLockPasswordFill/> Alterar Senha</Button>
            <Button href="#"><IoLogOut/> Sair</Button>
        </div>

        <div className="content">
            <div className="field">
            <label>CPF</label>
            <input type="text" value={funcionario.cpf} disabled />
            </div>

            <div className="field">
            <label>Nome</label>
            <input type="text" value={funcionario.nome} disabled />
            </div>

            <div className="field">
            <label>Email</label>
            <input type="email" value={funcionario.email} disabled />
            </div>

            <div className="field">
            <label>Cargo</label>
            <input type="text" value={funcionario.cargo} disabled />
            </div>

            <div className="field senha-wrapper">
            <label>Senha</label>
            <input
                type={mostrarSenha ? "text" : "password"}
                value={funcionario.senha}
                disabled
            />
            <span className="material-icons" onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                {mostrarSenha ? "visibility_off" : "visibility"}
            </span>
            </div>
        </div>
        </div>
    );
}