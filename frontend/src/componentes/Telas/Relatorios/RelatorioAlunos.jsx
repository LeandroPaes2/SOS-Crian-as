import { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Alert, Container, ButtonGroup, ToggleButton } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
                const token = localStorage.getItem("token");
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
            <Alert variant="dark" className="text-center mt-2 mb-4">
                <h2>Relatório de Alunos</h2>
            </Alert>

            {/* Filtros */}
            <div className="mb-4">
                <Form.Group>
                    <Form.Label>Filtrar por Status:</Form.Label>
                    <ButtonGroup>
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
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Ordenar por:</Form.Label>
                    <ButtonGroup>
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
                </Form.Group>
            </div>

            {/* Pesquisa */}
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

            {/* Tabela */}
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
                        {alunosFiltrados.map((aluno) => (
                            <tr key={aluno.id}>
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
                <p>Quantidade de alunos: {alunosFiltrados.length}</p>
            </Container>

            {/* Botões */}
            <div className="mt-3">
                <Button as={Link} to="/telaAluno" variant="secondary" className="me-2">Voltar</Button>
                <Button variant="info" onClick={gerarPdfEImprimir}>Imprimir</Button>
            </div>
        </PaginaGeral>
    );
}