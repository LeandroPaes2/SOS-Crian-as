import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLogin } from "../../../LoginContext.js";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import "../../css/verificarEmail.css";

export default function VerificarEmail(){

    const [codigo, setCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resposta = await fetch('http://localhost:3000/verificarCodigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo }),
        });
        const dados = await resposta.json();

        if (resposta.ok) {
            setMensagem(dados.mensagem || 'Código verificado com sucesso');
            // Redireciona para a tela de redefinir senha
            navigate('/redefinirSenha', {state:{email}});
        } else {
            setMensagem(dados.mensagem || 'Código incorreto ou expirado');
        }
    }

    return(
        <div>
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Recuperar Senha</h2>
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
                    <Form.Group className="campoCodigo" controlId="codigo">
                        <Form.Label>Codigo</Form.Label>
                        <Form.Control type="text" placeholder="Enter the code" 
                        required
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" as={Link} to="/">
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar">
                            Verificar Código 
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}