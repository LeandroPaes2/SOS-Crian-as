import { Alert, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";

export default function EmailSenha(){

    const [mensagem, setMensagem] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

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
            navigate("/alterarSenha");

        }catch(e){
            setMensagem("E-Mail não cadastrado.");
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
                    <Form.Group className="campoEmail" controlId="email">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" as={Link} to="/dadosUsuario">
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar" onClick={handleSubmit}>
                            Verificar Email
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}