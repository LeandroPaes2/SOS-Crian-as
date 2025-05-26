import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from "../../../LoginContext.js";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import "../../css/verificarEmail.css";

export default function VerificarEmail(){

    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const [manterConectado, setManterConectado] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(email);
        await fetch("http://localhost:3000/recuperarSenha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        setTimeout(() =>
        setMensagem("Você receberá um codigo."), 3000);
        navigate("/verificarCodigo", {state:{email}});
    }

    return(
        <div>
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Recuperar Senha</h2>
            </Alert>
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("codigo")
                ? "success"
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
            </Alert>} 
            <div className="divForm">
                <Form onSubmit={handleSubmit} id="formularioLogin"  className="formularioD">
                    <Form.Group className="campoEmail" controlId="email">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" as={Link} to="/">
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar" onClick={handleSubmit}>
                            Enviar email 
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}