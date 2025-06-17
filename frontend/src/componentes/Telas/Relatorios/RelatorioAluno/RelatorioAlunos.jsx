import { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Alert, Container, ButtonGroup, ToggleButton, Row, Col } from "react-bootstrap";
import PaginaGeral from "../../../layouts/PaginaGeral";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./css/relatorioAluno.css";


export default function RelatorioAlunos() {
    const [id, setId] = useState(0);
    const [nome, setNome] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [periodoEscola, setPeriodoEscola] = useState("");
    const [periodoProjeto, setPeriodoProjeto] = useState("");
    const [listaDeAlunos, setListaDeAlunos] = useState([]);
    const [pesquisaNome, setPesquisaNome] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [ordenarPor, setOrdenarPor] = useState("id");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Opções para filtros e ordenação
    const statusOptions = [
        { name: 'Todos', value: 'todos' },
        // Adicione novos status aqui no futuro
    ];

    const ordenarOptions = [
        { name: 'ID', value: 'id' },
        { name: 'Nome', value: 'nome' },
    ];

    useEffect(() => {
        const buscarAlunos = async () => {
            try {
                
                const res = await fetch("http://localhost:3000/alunos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Erro ao buscar alunos");
                const dados = await res.json();
                console.log(dados);
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
            try {
                const res = await fetch(`http://localhost:3000/alunos/${aluno.id}`, { method: "DELETE" });
                if (res.ok) {
                    setListaDeAlunos(listaDeAlunos.filter(a => a.id !== aluno.id));
                    setMensagem("Aluno excluído com sucesso!");
                } else setMensagem("Erro ao excluir o aluno.");
            } catch (error) {
                setMensagem("Erro de conexão com o servidor.");
                console.error(error);
            }
        }
    };

    const alunosFiltrados = listaDeAlunos
        .filter(aluno => {
            if (filtroStatus === "todos") return true;
            return aluno.status.toString() === filtroStatus;
        })
        .filter(a => a.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        .sort((a, b) => {
            if (ordenarPor === 'id') return a.id - b.id;
            if (ordenarPor === 'nome') return a.nome.localeCompare(b.nome);
            return 0;
        });

    const gerarPdfEImprimir = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const titulo = "Relatório de Alunos";

        doc.text(titulo, (pageWidth - doc.getTextWidth(titulo)) / 2, 20);

        const data = alunosFiltrados.map(aluno => [
            aluno.id,
            aluno.nome,
            aluno.telefone || "N/A",
            aluno.responsavel?.map(r => r.nome).join(', ') || "N/A",
            aluno.periodoEscola || "N/A",
            aluno.periodoProjeto || "N/A",
            `${aluno.rua}, ${aluno.numero}, ${aluno.bairro}, ${aluno.cidade}` || "N/A",
            filtroStatus === "todos" ? (aluno.status === 1 ? "Ativo" : "Inativo") : null
        ].filter(val => val !== null));

        const headers = filtroStatus === "todos"
            ? [["ID", "Nome", "Telefone", "Responsável", "Período Escola", "Período Projeto", "Endereço", "Status"]]
            : [["ID", "Nome", "Telefone", "Responsável", "Período Escola", "Período Projeto", "Endereço"]];

        autoTable(doc, {
            startY: 30,
            head: headers,
            body: data,
            styles: { lineWidth: 0.2, lineColor: [0, 0, 0], textColor: 0 },
            headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
        });

        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const printWindow = window.open(pdfUrl);
        printWindow.onload = () => printWindow.print();
    };

    return (
        <PaginaGeral>
            <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Alunos</h2>
                    </div>

                    {/* Filtros e Pesquisa */}
                    <div className="bg-white p-3 rounded shadow-sm mb-4">
                        <Row className="gy-3">
                            <Col md={4} sm={12}>
                                <Form.Label><strong>Status:</strong></Form.Label>
                                <ButtonGroup className="w-100">
                                    {statusOptions.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            type="radio"
                                            variant="outline-primary"
                                            name="status"
                                            value={option.value}
                                            checked={filtroStatus === option.value}
                                            onChange={(e) => setFiltroStatus(e.currentTarget.value)}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Col>

                            <Col md={4} sm={12}>
                                <Form.Label><strong>Ordenar por:</strong></Form.Label>
                                <ButtonGroup className="w-100">
                                    {ordenarOptions.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            type="radio"
                                            variant="outline-success"
                                            name="ordenar"
                                            value={option.value}
                                            checked={ordenarPor === option.value}
                                            onChange={(e) => setOrdenarPor(e.currentTarget.value)}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Col>

                            <Col md={4} sm={12}>
                                <Form.Label><strong>Pesquisar por nome:</strong></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Digite o nome do aluno"
                                        value={pesquisaNome}
                                        onChange={(e) => setPesquisaNome(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>

                    {/* Alerta */}
                    {mensagem && <Alert variant="info" className="shadow-sm">{mensagem}</Alert>}

                    {/* Tabela */}
                    <div className="bg-white p-3 rounded shadow-sm">
                        <div className="table-responsive">
                            <Table striped bordered hover className="text-center align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Período</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alunosFiltrados.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td>{aluno.id}</td>
                                            <td>{aluno.nome}</td>
                                            <td>{aluno.periodoProjeto || "N/A"}</td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        onClick={() => navigate("/cadastroAluno", { state: aluno })}
                                                        variant="warning"
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => excluirAluno(aluno)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <div className="text-end mt-2">
                            Quantidade de alunos: <strong>{alunosFiltrados.length}</strong>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaAluno" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                        <Button variant="info" onClick={gerarPdfEImprimir}>
                            🖨️ Imprimir
                        </Button>
                    </div>
                </Container>
            </div>
        </PaginaGeral>
    );
}