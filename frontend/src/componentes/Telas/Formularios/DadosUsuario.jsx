import { useLogin } from "../../../LoginContext.js";
import "../../css/dadosUsuario.css";
import { useState } from "react";
import { IoPerson, IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function DadosUsuario(){

    const { funcionario, logout } = useLogin();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    
    /*function buscarDados(){
        const response = fetch("http://localhost:3000/funcionarios/"+funcionario.cpf);
        if(!response)
            console.log("Funcionario nao esta logado.");
    }*/

    const handleLogout = async (event) => {
        logout();
        navigate("/");
    }

    return(
     
        <div className="container">
        <div className="sidebar">
            <Button href="#" className="botaoDados"><IoPerson/> Dados Pessoais</Button>
            <Button as={Link} to="/telaEmailSenha" className="botaoDados">< RiLockPasswordFill/> Alterar Senha</Button>
            <Button href="#" className="botaoDados" onClick={handleLogout}><IoLogOut/> Sair</Button>
        </div>

        <div className="content">
            <h5>Dados Pessoais</h5>
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
            <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
            
            </div>
        </div>
        </div>
    );
}