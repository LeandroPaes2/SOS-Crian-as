import { useLogin } from "../../../LoginContext.js";
import "../../css/dadosUsuario.css";
import { useState, useEffect } from "react";
import { IoPerson, IoLogOut } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button, InputGroup, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function DadosUsuario(){

    const { funcionario, logout, atualizarFuncionario } = useLogin();
    const [email, setEmail] = useState(funcionario.email);
    const [emailAlterado, setEmailAlterado] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        setEmailAlterado(email !== funcionario.email);
    }, [email, funcionario.email]);

    const handleLogout = async (event) => {
        logout();
        navigate("/");
    }

    const handleAlterarEmail = async (event) => {
        event.preventDefault(); 
        const url = `http://localhost:3000/funcionarios/${funcionario.cpf}`;
        const method = "PUT";

        try {

            if(!window.confirm("Deseja realmente alterar o email?")){
                return;
            }

            const funcionarioAtualizado = {
                ...funcionario,
                email: email,
            };

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json",
                    "Authorization":`Bearer ${token}`
                 },
                body: JSON.stringify(funcionarioAtualizado),
            });

            if (response.ok) {
                setMensagem("Email alterada com sucesso!");
                setTimeout(() => setMensagem(""), 3000);
                atualizarFuncionario(funcionarioAtualizado); // ← isso atualiza o estado no contexto
                setEmailAlterado(false);
            }
            else {
                setMensagem("Erro ao atualizar email!");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return(
     
        <div className="container">
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
            </Alert>} 
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
            <input type="email" value={email} required
            onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAlterado(e.target.value !== funcionario.email); 
                }}/>
             {emailAlterado && (
                        <Button variant="success" size="sm" onClick={handleAlterarEmail} style={{ marginTop: '10px' }}>
                            Alterar
                        </Button>
                    )}
            </div>

            <div className="field">
            <label>Cargo</label>
            <input type="text" value={funcionario.cargo} disabled />
            </div>

            <div className="field">
            <label>Nível</label>
            <input type="text" value={funcionario.nivel} disabled />
            </div>
            
            </div>
        </div>
    );
}