import { useState, useEffect } from "react";
import {
    Container,
    Table,
    Button,
    Form,
    InputGroup,
    Alert,
    ButtonGroup,
    ToggleButton
} from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// npm install jspdf jspdf-autotable

export default function RelatorioListaEspera() {
    const navigate = useNavigate();

    const [listaDeListaEspera, setListaDeListaEspera] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("1");
    const [ordenarPor, setOrdenarPor] = useState("dataInsercao");
    const [mostrarFiltros, setMostrarFiltros] = useState(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const statusOptions = [
        { name: 'Ativos', value: '1' },
        { name: 'Excluídos', value: '0' },
        { name: 'Todos', value: 'todos' },
    ];

    const ordenarOptions = [
        { name: 'Data', value: 'dataInsercao' },
        { name: 'Cor', value: 'cor' },
        { name: 'ID', value: 'id' },
        { name: 'Nome', value: 'nome' },
    ];

    useEffect(() => {
        const buscarListaEspera = async () => {
            try {
                const response = await fetch("http://localhost:3000/listasEspera");
                if (!response.ok) throw new Error("Erro ao buscar listaEspera");

                const dados = await response.json();
                setListaDeListaEspera(dados);
            } catch (error) {
                console.error("Erro ao buscar listaEspera:", error);
                setMensagem("Erro ao carregar a lista de espera.");
            }
        };

        buscarListaEspera();
    }, []);

    const alterarListaEspera = (listaEspera) => {
        navigate("/cadastroListaEspera", {
            state: {
                editando: true,
                ...listaEspera
            }
        });
    };

    const excluirListaEspera = async (listaEspera, confirmar = true) => {
        if (confirmar) {
            const confirmacao = window.confirm("Deseja realmente excluir a criança " + listaEspera.aluno.nome + " da lista de espera?");
            if (!confirmacao) return;
        }

        try {
            listaEspera.status = 0;
            const response = await fetch("http://localhost:3000/listasEspera/" + listaEspera.num, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json" },
                body: JSON.stringify(listaEspera)
            });

            if (response.ok) {
                setMensagem("Excluído com sucesso!");
                setListaDeListaEspera(prevLista =>
                    prevLista.map(item =>
                        item.num === listaEspera.num ? { ...item, status: 0 } : item
                    )
                );
            } else {
                setMensagem("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const matricularAluno = (listaEspera) => {
        navigate("/cadastroAluno", {
            state: {
                editando: true,
                ...listaEspera.aluno,
                dataInsercao: listaEspera.dataInsercao
            }
        });
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const getStatus = (status) => {
        if (status === 0) return "CADASTRADO";
        if (status === 1) return "EXCLUIDO";
        return status;
    };

    const listaFiltrada = listaDeListaEspera
    .filter(item => {
        if (filtroStatus === "todos") return true;
        return item.status.toString() === filtroStatus;
    })
    .filter(item => {
        const nome = item.aluno?.nome?.toLowerCase() || "";
        const cor = item.cor?.toLowerCase() || "";
        const termo = pesquisaNome.toLowerCase();
        return nome.includes(termo) || cor.includes(termo);
    })
    .sort((a, b) => {
        if (ordenarPor === "nome") {
            const compNome = a.aluno.nome.localeCompare(b.aluno.nome);
            if (compNome !== 0) return compNome;
            const compCor = a.cor.localeCompare(b.cor);
            if (compCor !== 0) return compCor;
            return new Date(a.dataInsercao) - new Date(b.dataInsercao);
        }

        if (ordenarPor === "id") return a.id - b.id;

        if (ordenarPor === "cor") {
            const compCor = a.cor.localeCompare(b.cor);
            if (compCor !== 0) return compCor;
            const compData = new Date(a.dataInsercao) - new Date(b.dataInsercao);
            return compData !== 0 ? compData : a.aluno.nome.localeCompare(b.aluno.nome);
        }

        if (ordenarPor === "dataInsercao") {
            const compData = new Date(a.dataInsercao) - new Date(b.dataInsercao);
            if (compData !== 0) return compData;
            const compCor = a.cor.localeCompare(b.cor);
            return compCor !== 0 ? compCor : a.aluno.nome.localeCompare(b.aluno.nome);
        }

        return 0;
    });


    const gerarPdfEImprimir = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        let titulo = "Todas as Crianças da Lista de Espera";
        if (filtroStatus !== "todos") {
            titulo = filtroStatus === "0"
                ? "Relatório de Crianças Excluídas na Lista de Espera"
                : "Relatório de Crianças Cadastradas na Lista de Espera";
        }

        const textWidth = doc.getTextWidth(titulo);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(titulo, textX, 20);

        const data = listaFiltrada.map(item => [
            item.id,
            item.aluno?.nome || "N/A",
            item.aluno?.telefone || "N/A",
            item.aluno?.responsavel?.nome || "N/A",
            formatarData(item.dataInsercao),
            item.cor,
            filtroStatus === "todos" ? getStatus(item.status) : null
        ].filter(val => val !== null)); // remove o "status" se não for necessário

        const head = filtroStatus === "todos"
            ? [["ID", "Nome", "Telefone", "Responsável", "Data de Inserção", "Cor", "Status"]]
            : [["ID", "Nome", "Telefone", "Responsável", "Data de Inserção", "Cor"]];

        autoTable(doc, {
            startY: 30,
            head: head,
            body: data,
            styles: {
                lineWidth: 0.2, // aumenta para bordas mais visíveis, ex: 0.5 ou 1
                lineColor: [0, 0, 0], // preto
                fillColor: [255, 255, 255],
                textColor: 0,
            },
            headStyles: {
                fillColor: [240, 240, 240], // cor de fundo do cabeçalho
                textColor: 0,
                fontStyle: 'bold',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
            },
        });


        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl);
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };


    return (
        <PaginaGeral>
            <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório da Lista de Espera</h2>
                    </div>


            {mostrarFiltros ? (
                <div style={{
                    position: 'fixed',
                    top: '100px', // ajuste conforme a altura da barra de menu
                    right: '20px',
                    width: '250px',
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    border: '1px solid #ccc',
                    zIndex: 1050
                }}>
                    <div>
                        <h5>Filtrar Status:</h5>
                        <ButtonGroup className="mb-2 me-3">
                            {statusOptions.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`status-${idx}`}
                                    type="radio"
                                    variant="outline-primary"
                                    name="status"
                                    value={radio.value}
                                    checked={filtroStatus === radio.value}
                                    onChange={(e) => setFiltroStatus(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <h5 className="mt-2">Ordenar Por:</h5>
                        <ButtonGroup className="mb-2">
                            {ordenarOptions.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`ordenar-${idx}`}
                                    type="radio"
                                    variant="outline-success"
                                    name="ordenar"
                                    value={radio.value}
                                    checked={ordenarPor === radio.value}
                                    onChange={(e) => setOrdenarPor(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>
                    <button onClick={() => setMostrarFiltros(false)} style={{ marginTop: '10px' }}>
                        &gt;
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setMostrarFiltros(true)}
                    style={{
                        position: 'fixed',
                        top: '80px',
                        right: '20px',
                        zIndex: 1050,
                        padding: '5px 10px'
                    }}
                >
                    &lt;
                </button>
            )}

            <Form className="mt-3">
                <Form.Group controlId="formPesquisaNome">
                    <Form.Label>Pesquisa</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar por nome ou cor"
                            value={pesquisaNome}
                            onChange={(e) => setPesquisaNome(e.target.value)}
                        />
                    </InputGroup>
                </Form.Group>
            </Form>

            <div className="mt-4">
                <Button as={Link} to="/telaListaEspera" variant="secondary" className="me-2">Voltar</Button>
                <Button as={Link} to="/cadastroListaEspera" variant="secondary">Cadastrar</Button>
                <Button variant="info" onClick={gerarPdfEImprimir}>Imprimir</Button>
            </div>
            <p>Quantidade de crianças cadastradas na lista de espera: {listaFiltrada.length}</p>
            <div className="bg-white p-3 rounded shadow-sm">
                <div className="table-responsive">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Responsável</th>
                            <th>Telefone</th>
                            <th>Cor</th>
                            <th>Data Inserção</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaFiltrada.map((listaEspera) => (
                            <tr key={listaEspera.id}>
                                <td>{listaEspera.id}</td>
                                <td>{listaEspera.aluno?.nome}</td>
                                <td>{listaEspera.aluno?.responsavel?.nome}</td>
                                <td>{listaEspera.aluno?.telefone}</td>
                                <td>{listaEspera.cor}</td>
                                <td>{formatarData(listaEspera.dataInsercao)}</td>
                                <td>
                                    {listaEspera.status !== 0 && (
                                        <>
                                            <Button
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => alterarListaEspera(listaEspera)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="me-2"
                                                onClick={() => excluirListaEspera(listaEspera)}
                                            >
                                                Excluir
                                            </Button>
                                            <Button
                                                variant="success"
                                                onClick={() => matricularAluno(listaEspera)}
                                            >
                                                Matricular
                                            </Button>
                                        </>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
                        <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaMenu" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                        <Button variant="info" onClick={gerarPdfEImprimir}>
                            🖨️ Imprimir
                        </Button>
                    </div>
                </div>
                </Container>
            </div>
        </PaginaGeral >
    );
}
