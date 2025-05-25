import { Alert, Form, Button, InputGroup, FormControl } from "react-bootstrap";
import "../../css/login.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLogin } from "../../../LoginContext.js";
import logo2 from "../../imagens/logo2.PNG";
import Navbar from 'react-bootstrap/Navbar';
export default function Login(props) {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([])
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const { login } = useLogin();
    const [manterConectado, setManterConectado] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/funcionarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
            });

            const resultado = await response.json();

            if (!response.ok) {
            setMensagem(resultado.erro || resultado.mensagem || "Erro no login.");
            return;
            }

            // Aqui você pode armazenar o token, se for retornado:
            // localStorage.setItem("token", resultado.token);
            login(resultado.funcionario, manterConectado);
            setMensagem("");
        } catch (e) {
            setMensagem("Erro ao tentar fazer login.");
        }

        setTimeout(() => setMensagem(""), 5000);
    }

    return (
        <div>
            {mensagem && (
                <Alert
                    className="alert-animado mt-2 mb-2 text-center"
                    style={{ position: 'absolute', top: '20%', left: '43%' }}
                    variant={
                        mensagem.includes("sucesso")
                            ? "success"
                            : mensagem.includes("nao cadastrado") || mensagem.includes("erro") || mensagem.includes("incorreta")
                                ? "danger"
                                : "warning"
                    }
                >
                    {mensagem}
                </Alert>
            )}

            <div className="formularioL">
                <div className="imagemLogin"></div>
                <Navbar.Brand><img src={logo2} style={{ width: '300px', position: 'absolute', top: '20%', left: '12%' }} /></Navbar.Brand>
                <Form onSubmit={handleSubmit} id="formularioLogin"  >
                    <div className="texto">
                        <Form.Group className="mb-4" controlId="email">
                            <Form.Label>E-Mail</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="senha">
                            <Form.Label>Senha</Form.Label>
                            <InputGroup>
                                <Form.Control type={mostrarSenha ? "text" : "password"}
                                    placeholder="Senha"
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)} />
                                <InputGroup.Text onClick={() => setMostrarSenha(!mostrarSenha)} style={{ cursor: "pointer" }}>
                                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Button className="botaoSenha" as={Link} to="/verificarEmail">
                            Esqueceu a senha?
                        </Button>
                        <Form.Group className="mb-4" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Mantenha-me conectado"
                                onChange={() => setManterConectado(!manterConectado)} />
                        </Form.Group>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="primary" type="submit">
                                Entrar
                            </Button>
                        </div>

                    </div>
                </Form>
            </div>
        </div>
    );
}