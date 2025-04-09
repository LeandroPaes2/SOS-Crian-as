import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaEscola.css";
import { useEffect, useState } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

export default function FormCadEscola(){
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [editando, setEditando] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const rotaVoltar = editando ? "/relatorioEscola" : "/telaEscola";

    useEffect(() => {
        if(location.state && location.state.nome && location.state.endereco){
            setNome(location.state.nome);
            setEndereco(location.state.endereco);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
       
        if (!nome || !endereco) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const escola = { nome, endereco }; 
        const url = editando ? `http://localhost:3000/escolas/${nome}` : "http://localhost:3000/escolas";
        const method = editando ? "PUT" : "POST";
        try {
            if(editando){
                if(!window.confirm("Deseja realmente alterar o escola: " + escola.nome)){
                    return;
                }
            }
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(escola),
            });

            if (response.ok) {
                setMensagem(editando ? "Escola atualizado com sucesso!" : "Escola cadastrado com sucesso!");
                setTimeout(() =>setNome(""), 3000);
                setTimeout(() => setEndereco(""), 3000);
    

                setTimeout(() => setMensagem(""), 3000);
                setEditando(false);
                setTimeout(() => {
                    navigate("/relatorioEscola"); 
                }, 3000); 
            } else {
                setMensagem(editando ? "Erro ao atualizar responsavel!": "Erro ao cadastrar o escola.");
            }

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
            <div>
                <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2>Escola</h2>
                </Alert>
    
                {mensagem && <Alert className="mt-02 mb-02 success text-center" variant={
                mensagem.includes("sucesso")
                ? "success"
                : mensagem.includes("Erro") || mensagem.includes("erro") || mensagem.includes("Preencha") || mensagem.includes("invalido")
                ? "danger"
                : "warning"
                    }>
                {mensagem}
                </Alert>} 
    
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            isInvalid={mensagem !== "" && nome.trim() === ""}
                        />

                        <Form.Control.Feedback type="invalid">
                            O nome é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>
    
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            isInvalid={mensagem !== "" && endereco.trim() === ""}
                        />
                        <Form.Control.Feedback type="invalid">
                            O endereço é obrigatório.
                        </Form.Control.Feedback>
                    </Form.Group>
    
                    <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                <Button className="botaoPesquisa" variant="primary" type="submit">
                    {editando ? "Atualizar" : "Cadastrar"}
                </Button>
                    
                </Form>
                
                </PaginaGeral>
            </div>
        );
}