import { Alert, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from "../../../LoginContext.js";
import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import "../../css/verificarEmail.css";

export default function VerificarEmail(){

    const [email, setEmail] = useState("");
    const [listaDeFuncionarios, setListaDeFuncionarios] = useState([])
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const {login} = useLogin();
    const [manterConectado, setManterConectado] = useState(false);

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
            
            if(!dados || dados.length==0){
                setMensagem("Funcionário não cadastrado.");
                setTimeout(() => setMensagem(""), 3000);
                return;
            }
            setMensagem("");

        }catch(e){
            setMensagem("E-Mail não cadastrado.");
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
                        <Button variant="primary" type="submit" className="botaoEnviar">
                            Enviar email 
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}