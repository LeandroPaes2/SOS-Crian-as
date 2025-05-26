import { useState, useEffect } from "react";
import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useLogin } from "../../../LoginContext";
import "../../css/alterarSenha.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function RecuperarSenha(){

    const location = useLocation();
    const [mensagem, setMensagem] = useState("");
    const email = location.state?.email || "";
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const {funcionario, logout} = useLogin();
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const query = new URLSearchParams(window.location.search);


    const verificarVoltar= async (event)=>{
        event.preventDefault();

        if(window.confirm("Deseja realmente voltar? O processo nao sera concluido.")){
            navigate("/");
            return;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if(novaSenha!==confirmarSenha){
                setMensagem("Senhas incompativeis.")
                return;
            }
            const resposta = await fetch('http://localhost:3000/redefinirSenha', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, novaSenha: novaSenha }),
            });

            const dados = await resposta.json();
            setMensagem(dados.mensagem || 'Erro ao redefinir senha');
            } catch (erro) {
                console.error(erro);
                setMensagem('Erro ao conectar com o servidor');
            }
    }

    return(
        <div>
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Alterar Senha</h2>
            </Alert>
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
            </Alert>} 
            <div className="divForm">
                <Form onSubmit={handleSubmit} id="formularioLogin"  className="formularioD">
                    <Form.Group className="campoNovaSenha" controlId="novaSenha">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control type={mostrarSenha ? "text" : "password"} placeholder="Digite a senha nova" 
                        required
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </Form.Group>
                    <Form.Group className="campoConfirmarSenha" controlId="confirmarSenha">
                        <Form.Label>Confirme a senha nova</Form.Label>
                        <Form.Control type={mostrarSenha ? "text" : "password"} placeholder="Digite a senha nova" 
                        required
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" onClick={verificarVoltar}>
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar" onClick={handleSubmit}>
                            Alterar Senha
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}