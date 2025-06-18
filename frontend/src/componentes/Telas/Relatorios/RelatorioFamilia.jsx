import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaFamilia.css";

export default function RelatorioFamilia() {
    const [listaDeFamilias, setListaDeFamilias] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const [alunos, setAlunos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {

        const buscarFamilias = async () => {
            try {
                const response = await fetch("http://localhost:3000/familias", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                })
                if (!response.ok) throw new Error("Erro ao buscar familias");

                const dados = await response.json();
                setListaDeFamilias(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar familias:", error);
                setMensagem("Erro ao carregar as familias.");
            }
        };
        buscarFamilias();

        const buscarAlunos = async () => {
            try {
                const response = await fetch("http://localhost:3000/alunos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Erro ao buscar alunos");

                const dados = await response.json();
                setAlunos(dados);
            } catch (error) {
                console.error("Erro ao buscar alunos:", error);
                setMensagem("Erro ao carregar os alunos.");
            }
        };
        buscarAlunos();

    }, []);




    const excluirFamilia = async (familia) => {
        if (window.confirm("Deseja realmente excluir a familia " + familia.nome + "?")) {
            if (!familia || !familia.id) {
                setMensagem("Erro: familia inválida!");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/familias/${familia.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setMensagem("Familia excluida com sucesso!");
                    setListaDeFamilias(listaDeFamilias.filter(f => f.id !== familia.id));
                } else {
                    setMensagem("Erro ao excluir a familia.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const editarFamilia = (familia) => {
        navigate("/cadastroFamilia", {
            state: {
                id: familia.id,
                nome: familia.nome,
                sexo: familia.sexo,
                dataNascimento: familia.dataNascimento,
                grauParentesco: familia.grauParentesco,
                profissao: familia.profissao,
                escolaridade: familia.escolaridade,
                irmaos: familia.irmaos,
                temContato: familia.temContato,
                alunoNome: familia.alunoNome || familia.aluno?.nome || ""
            }
        });
    }

    const familiasFiltradas = pesquisaNome
        ? listaDeFamilias.filter(familia =>
            familia.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeFamilias;

    return (
        <PaginaGeral>
            <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Familiares</h2>
                    </div>

                    <Form className="mb-4">
                        <Form.Group>
                            <Form.Label>Buscar familia por nome:</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o nome da familia"
                                    value={pesquisaNome}
                                    onChange={(e) => setPesquisaNome(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>

                    {mensagem && (
                        <Alert
                            className="alert-animado mt-2 mb-2 text-center"
                            variant={
                                mensagem.toLowerCase().includes("sucesso")
                                    ? "success"
                                    : mensagem.toLowerCase().includes("erro")
                                        ? "danger"
                                        : "warning"
                            }
                        >
                            {mensagem}
                        </Alert>
                    )}
                    <div className="bg-white p-3 rounded shadow-sm">
                        <div className="table-responsive">
                            <Table responsive striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Aluno</th>
                                        <th>Sexo</th>
                                        <th>Data de Nascimento</th>
                                        <th>Grau de Parentesco</th>
                                        <th>Profissao</th>
                                        <th>Escolaridade</th>
                                        <th>Irmaos</th>
                                        <th>Tem Contato</th>
                                        <th>Editar</th>
                                        <th>Excluir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {familiasFiltradas?.map((familia) => {
                                        const aluno = alunos.find(a => a.id === familia.alunoId?.id);
                                        return (
                                            <tr key={familia.id}>
                                                <td>{familia.nome}</td>
                                                <td>{aluno ? aluno.nome : "—"}</td>
                                                <td>{familia.sexo}</td>
                                                <td>{new Date(familia.dataNascimento).toLocaleDateString('pt-BR')}</td>
                                                <td>{familia.grauParentesco}</td>
                                                <td>{familia.profissao}</td>
                                                <td>{familia.escolaridade}</td>
                                                <td>{familia.irmaos}</td>
                                                <td>{familia.temContato}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button
                                                            onClick={() => editarFamilia(familia)}
                                                            variant="warning"
                                                        >
                                                            ✏️
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => excluirFamilia(familia)}
                                                        >
                                                            🗑️
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>

                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaMenu" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                    </div>
                </Container>
            </div>
        </PaginaGeral>
    );
}