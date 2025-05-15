import { Alert, Form, Button } from "react-bootstrap";
import "../../css/login.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Login(props){

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([])
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const formulario = document.getElementById("formularioLogin");

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            console.log(email);
            const response = fetch("http://localhost:3000/funcionarios/"+email);
            if (!response.ok) 
                throw new Error("Funcionario nao cadastrado");
            const dados = response.json();
                
            /*setTimeout(() => {
                navigate("/relatorioResponsavel"); 
            }, 3000);*/

        }catch(e){
            console.error("Funcionario nao cadastrado ", e);
            setMensagem("Erro ao carregar os funcionarios.");
        }

    }

    return (
        <div>
            <br />
            <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Sistema SOS Crianças</h2>
            </Alert>
            <br />
            {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("Erro") || mensagem.includes("erro") || mensagem.includes("Preencha") || mensagem.includes("invalido")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
                </Alert>} 
            <div className="divForm">
                <Form onSubmit={handleSubmit} id="formularioLogin"  className="formularioD">
                    <Form.Group className="mb-4" controlId="email">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="senha">
                    <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" placeholder="Senha" 
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Entrar
                    </Button>
                </Form>
            </div>
        </div>
    );
}