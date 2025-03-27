import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function FormCadAluno() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [periodoProjeto, setPeriodoProjeto] = useState("");
    const [periodoEscola, setPeriodoEscola] = useState("");
    const [mensagem, setMensagem] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (location.state && location.state.nome && location.state.idade && location.state.responsavel) {
            setNome(location.state.nome);
            setIdade(location.state.idade);
            setResponsavel(location.state.responsavel);
            setEndereco(location.state.endereco);
            setTelefone(location.state.telefone);
            setPeriodoProjeto(location.state.periodoProjeto);
            setPeriodoEscola(location.state.periodoEscola);
            setEditando(true);  // Ativa o modo de edição
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita recarregar a página

        // Verifica se os campos estão preenchidos
        if (!nome || !idade || !responsavel || !endereco || !telefone || !periodoProjeto || !periodoEscola) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const aluno = { nome, idade, responsavel, endereco, telefone, periodoProjeto, periodoEscola }; // Monta o objeto para enviar ao backend
        const url = editando ? `http://localhost:3000/alunos/${nome}` : "http://localhost:3000/alunos";
        const method = editando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aluno),
            });

            if (response.ok) {
                setMensagem(editando ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
                // Limpa os campos após cadastro/atualização
                setNome("");
                setIdade("");
                setResponsavel("");
                setEndereco("");
                setTelefone("");
                setPeriodoProjeto("");
                setPeriodoEscola("");
            } else {
                setMensagem("Erro ao cadastrar o aluno.");
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
                <h2>Cadastro de Aluno</h2>
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
                    <Form.Label>Idade</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Digite a idade"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Responsável</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o nome do responsável"
                        value={responsavel}
                        onChange={(e) => setResponsavel(e.target.value)}
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

                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Período do Projeto</Form.Label>
                    <Form.Select
                        value={periodoProjeto}
                        onChange={(e) => setPeriodoProjeto(e.target.value)}
                    >
                        <option value="">Selecione o período</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Período Escolar</Form.Label>
                    <Form.Select
                        value={periodoEscola}
                        onChange={(e) => setPeriodoEscola(e.target.value)}
                    >
                        <option value="">Selecione o período escolar</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                    </Form.Select>
                </Form.Group>

                <Button as={Link} to="/telaAluno" className="botaoPesquisa" variant="secondary">
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
