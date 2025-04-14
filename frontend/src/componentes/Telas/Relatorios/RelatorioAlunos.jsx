import { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Alert, Container } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from "react-router-dom";

export default function RelatorioAlunos() {
    const [listaDeAlunos, setListaDeAlunos] = useState([]);
    const [pesquisaNome, setPesquisaNome] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [id, setId] = useState(0);
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState(0);
    const [responsavel, setResponsavel] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [periodoEscola, setPeriodoEscola] = useState("");
    const [periodoProjeto, setPeriodoProjeto] = useState("");
    const navigate = useNavigate();



    useEffect(() => {
        const buscarAlunos = async () => {
            try {
                const res = await fetch("http://localhost:3000/alunos");
                if (!res.ok) throw new Error("Erro ao buscar alunos");

                const dados = await res.json();
                setListaDeAlunos(dados);
            } catch (error) {
                setMensagem("Erro ao carregar os alunos.");
                console.error(error);
            }
        };
        buscarAlunos();
    }, []);

    const excluirAluno = async (aluno) => {
        if (window.confirm(`Deseja realmente excluir o aluno ${aluno.nome}?`)) {
            if(!aluno || !aluno.id || !aluno.nome || !aluno.idade || aluno.responsavel|| aluno.endereco || aluno.telefone || aluno.periodoEscola || aluno.periodoProjeto )
            {
                console.log(aluno.id,aluno.nome);
                setMensagem("Erro: aluno inválido!");
                setTimeout(() => setMensagem(""), 5000);
                return;
            }

            try {
                const res = await fetch(`http://localhost:3000/alunos/${aluno.id}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    setListaDeAlunos(listaDeAlunos.filter(a => a.id !== aluno.id));
                    setMensagem("Aluno excluído com sucesso!");
                } else {
                    setMensagem("Erro ao excluir o aluno.");
                }
            } catch (error) {
                setMensagem("Erro de conexão com o servidor.");
                console.error(error);
            }
        }
    };

    const alunosFiltrados = pesquisaNome
        ? listaDeAlunos.filter(a => a.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeAlunos;

    return (
        <PaginaGeral>
            <Alert variant="dark" className="text-center mt-2 mb-4">
                <h2>Relatório de Alunos</h2>
            </Alert>

            <Form className="mb-4">
                <Form.Label>Pesquisar por nome</Form.Label>
                <InputGroup>
                    <Form.Control
                        placeholder="Digite o nome do aluno"
                        value={pesquisaNome}
                        onChange={(e) => setPesquisaNome(e.target.value)}
                    />
                </InputGroup>
            </Form>

            {mensagem && <Alert variant="info">{mensagem}</Alert>}

            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Período</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaDeAlunos.map((aluno) => (
                            <tr> 
                                {console.log(aluno)}
                                <td>{aluno.id}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.periodoProjeto}</td>
                                <td className="d-flex gap-2">
                                    <Button onClick={() => navigate("/cadastroAluno", { state: aluno })} variant="warning">
                                        ✏️
                                    </Button>
                                    <Button variant="danger" onClick={() => excluirAluno(aluno)}>
                                        🗑️
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <p>Quantidade de alunos cadastrados: {listaDeAlunos.length}</p>
            </Container>

            <Button as={Link} to="/telaAluno" variant="secondary" className="mt-3">
                Voltar
            </Button>
        </PaginaGeral>
    );
}
