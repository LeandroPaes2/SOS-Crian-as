import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaEscola.css";
import { useState } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import {Link} from 'react-router-dom';

export default function FormCadEscola(){
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); 
       
        if (!nome || !endereco) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const escola = { nome, endereco }; 

        try {
            const response = await fetch("http://localhost:3000/escolas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(escola),
            });

            if (response.ok) {
                setMensagem("Escola cadastrada com sucesso!");
                setNome(""); 
                setEndereco("");
            } else {
                setMensagem("Erro ao cadastrar a escola.");
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
    
                {mensagem && <Alert variant="info">{mensagem}</Alert>}
    
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Form.Group>
    
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />
                    </Form.Group>
    
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        Cadastrar
                    </Button>
                    
                </Form>
                <div>
                        <Button as={Link} to="/telaEscola" className="botaoPesquisa" variant="secondary">
                                Voltar
                        </Button>
                </div>
                </PaginaGeral>
            </div>
        );
}