import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadmateria() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [materia, setMateria] = useState(nome, descricao);

    useEffect(() => {
        if (location.state && location.state.nome && location.state.descricao) {
            setNome(location.state.nome);
            setDescricao(location.state.descricao);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        if (!nome || !descricao) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const materia = { nome, descricao }; // Monta o objeto para enviar ao backend
        const url = editando ? `http://localhost:3000/materias/${nome}` : "http://localhost:3000/materias";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(materia),
            });

            if (response.ok) {
                setMensagem(editando ? "materia atualizada com sucesso!" : "materia cadastrada com sucesso!");
                /*setNome(""); 
                setDescricao("");*/
            } else {
                setMensagem("Erro ao cadastrar a materia.");
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
                <h2>materias</h2>
            </Alert>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome"
                        value={materia.nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descricao</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite a descrição"
                        value={materia.descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Button as={Link} to="/telaMateria" className="botaoPesquisa" variant="secondary">
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
