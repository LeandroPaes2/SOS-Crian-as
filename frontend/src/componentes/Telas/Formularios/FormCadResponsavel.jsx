import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadResponsavel() {
    const [cor, setCor] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [turma, setTurma] = useState(cor, periodo);

    useEffect(() => {
        if (location.state && location.state.cor && location.state.periodo) {
            setCor(location.state.cor);
            setPeriodo(location.state.periodo);
            setEditando(true);  // Ativa o modo de edição
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!cor || !periodo) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const turma = { cor, periodo }; // Monta o objeto para enviar ao backend
        const url = editando ? `http://localhost:3000/turmas/${cor}` : "http://localhost:3000/turmas";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(turma),
            });

            if (response.ok) {
                setMensagem(editando ? "Turma atualizada com sucesso!" : "Turma cadastrada com sucesso!");
                /*setCor(""); 
                setPeriodo("");*/
            } else {
                setMensagem("Erro ao cadastrar a turma.");
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
                <h2>Turmas</h2>
            </Alert>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Cor</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite a cor"
                        value={turma.cor}
                        onChange={(e) => setCor(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Período</Form.Label>
                    <Form.Select
                        value={turma.periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                    >
                        <option value="">Selecione um período</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                    </Form.Select>
                </Form.Group>

                <Button as={Link} to="/telaResponsavel" className="botaoPesquisa" variant="secondary">
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
