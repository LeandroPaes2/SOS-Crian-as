import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import "../../css/login.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLogin } from "../../../LoginContext.js";

export default function Login(props){

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([])
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const {login} = useLogin();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/funcionarios/"+email);
            if (!response.ok){
                setMensagem("Funcionário não cadastrado.");
                return;
            }
            const dados = await response.json();
            console.log(dados);
            if(senha!==dados[0].senha){
                setMensagem("Senha incorreta.");
                return;
            }
            if(!dados || dados.length==0){
                setMensagem("Funcionário não cadastrado.");
                setTimeout(() => setMensagem(""), 3000);
                return;
            }
            login(dados[0]);
            setMensagem("");
            navigate("/telaMenu"); 
            

        }catch(e){
            setMensagem("Funcionario não cadastrado.");
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
                : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
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
                        <InputGroup>
                        <Form.Control type={mostrarSenha ? "text" : "password"} 
                        placeholder="Senha" 
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}/>
                        <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                        </InputGroup>
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