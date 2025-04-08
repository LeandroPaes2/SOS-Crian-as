import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaFuncionario.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadFuncionario() {
    const [nome, setNome] = useState("");
    const [cpf, setCPF] = useState("");
    const [cargo, setCargo] = useState("");
    const [nivel, setNivel] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [funcionario, setFuncionario] = useState(nome, cpf, cargo, nivel);

    useEffect(() => {
        if (location.state && location.state.nome && location.state.cpf && location.state.cargo && location.state.nivel) {
            setNome(location.state.nome);
            setCPF(location.state.cpf);
            setNome(location.state.cargo);
            setCPF(location.state.nivel);
            setEditando(true);  // Ativa o modo de edição
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!nome || !cpf || !cargo || !nivel) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const funcionario = { nome, cpf, cargo, nivel }; // Monta o objeto para enviar ao backend
        const url = editando ? `http://localhost:3000/funcionarios/${nome}` : "http://localhost:3000/funcionarios";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(funcionario),
            });

            if (response.ok) {
                setMensagem(editando ? "Funcionario atualizada com sucesso!" : "Funcionario cadastrada com sucesso!");
            } else {
                setMensagem("Erro ao cadastrar a funcionario.");
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
                <h2>Funcionarios</h2>
            </Alert>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Nome do Funcionario"
                        value={funcionario.nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o CPF do Funcionario"
                        value={funcionario.cpf}
                        onChange={(e) => setCPF(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Cargo do Funcionario"
                        value={funcionario.cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nivel</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Informe o Nivel do Funcionario"
                        value={funcionario.nivel}
                        onChange={(e) => setNivel(e.target.value)}
                        disabled={editando}
                    />
                </Form.Group>

                <Button as={Link} to="/telaFuncionario" className="botaoPesquisa" variant="secondary">
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
