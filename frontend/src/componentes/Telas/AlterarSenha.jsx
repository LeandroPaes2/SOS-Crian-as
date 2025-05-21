import { useState } from "react";
import { Alert, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useLogin } from "../../LoginContext";
import "../css/alterarSenha.css";

export default function AlterarSenha(){

    const [mensagem, setMensagem] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const {funcionario, logout} = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        const url = `http://localhost:3000/funcionarios/${funcionario.cpf}`;
        const method = "PUT";

        try {

            if(!window.confirm("Deseja realmente alterar a senha?")){
                return;
            }

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(funcionario),
            });

            if (response.ok) {
                setMensagem("Senha alterada com sucesso! Aguarde para fazer login novamente.");
                setTimeout(() => setMensagem(""), 3000);
                setTimeout(() => {
                    logout();
                    navigate("/");
                }, 3000); 
            } 
            else {
                setMensagem("Erro ao atualizar senha!");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };
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
                    <Form.Group className="campoSenhaAtual" controlId="senhaAtual">
                        <Form.Label>Senha Atual</Form.Label>
                        <Form.Control type="password" placeholder="Digite a senha atual" 
                        required
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="campoNovaSenha" controlId="novaSenha">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control type="password" placeholder="Digite a senha nova" 
                        required
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="campoConfirmarSenha" controlId="confirmarSenha">
                        <Form.Label>Confirme a senha nova</Form.Label>
                        <Form.Control type="password" placeholder="Digite a senha nova" 
                        required
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}/>
                    </Form.Group>
                    <br />
                    <div className="divVoltar">
                        <Button className="botaoVoltar" as={Link} to="/dadosUsuario">
                        <GoArrowLeft /> Voltar
                        </Button>
                        <Button variant="primary" type="submit" className="botaoEnviar">
                            Alterar Senha
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}