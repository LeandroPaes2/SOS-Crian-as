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

    const statusOptions = [
        { name: 'Ativos', value: '1' },
        { name: 'Excluídos', value: '0' },
        { name: 'Todos', value: 'todos' },
    ];

    const ordenarOptions = [
        { name: 'Data', value: 'dataInsercao' },
        { name: 'Prioridade', value: 'prioridade' },
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
                headers: { "Content-Type": "application/json" },
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

    const getCorPrioridade = (prioridade) => {
        if (prioridade === 1) return "AZUL";
        if (prioridade === 2) return "VERMELHO";
        return prioridade;
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
        .filter(item => item.aluno?.nome?.toLowerCase().includes(pesquisaNome.toLowerCase()))
        .sort((a, b) => {
            if (ordenarPor === "nome") {
                const compNome = a.aluno.nome.localeCompare(b.aluno.nome);
                if (compNome !== 0) return compNome;
                const compPrioridade = a.prioridade - b.prioridade;
                if (compPrioridade !== 0) return compPrioridade;
                return new Date(a.dataInsercao) - new Date(b.dataInsercao);
            }

            if (ordenarPor === "id") return a.id - b.id;

            if (ordenarPor === "prioridade") {
                const compPrioridade = a.prioridade - b.prioridade;
                if (compPrioridade !== 0) return compPrioridade;
                const compData = new Date(a.dataInsercao) - new Date(b.dataInsercao);
                return compData !== 0 ? compData : a.aluno.nome.localeCompare(b.aluno.nome);
            }

            if (ordenarPor === "dataInsercao") {
                const compData = new Date(a.dataInsercao) - new Date(b.dataInsercao);
                if (compData !== 0) return compData;
                const compPrioridade = a.prioridade - b.prioridade;
                return compPrioridade !== 0 ? compPrioridade : a.aluno.nome.localeCompare(b.aluno.nome);
            }

            return 0;
        });

    /*const gerarPdfEImprimir = () => {
        const doc = new jsPDF();
        if (filtroStatus !== "todos") {
            if (filtroStatus == "0")
                doc.text("Relatório de Crianças Excluidas na Lista de Espera", 14, 20);
            else
                doc.text("Relatório de Crianças Cadastradas na Lista de Espera", 14, 20);
            const data = listaFiltrada.map(item => [
                item.id,
                item.aluno?.nome || "N/A",
                item.aluno?.telefone || "N/A",
                item.aluno?.responsavel?.nome || "N/A",
                formatarData(item.dataInsercao),
                getCorPrioridade(item.prioridade)
            ]);

            autoTable(doc, {
            startY: 30,
            head: [["ID", "Nome","Telefone", "Responsável", "Data de Inserção", "Prioridade"]],
            body: data,
        });
        }
        else {
            doc.text("Todas as Crianças da Lista de Espera", 14, 20);

            const data = listaFiltrada.map(item => [
                item.id,
                item.aluno?.nome || "N/A",
                item.aluno?.telefone || "N/A",
                item.aluno?.responsavel?.nome || "N/A",
                formatarData(item.dataInsercao),
                getCorPrioridade(item.prioridade),
                getStatus(item.status)
            ]);

            autoTable(doc, {
            startY: 30,
            head: [["ID", "Nome","Telefone", "Responsável", "Data de Inserção", "Prioridade", "Status"]],
            body: data,
        });
        }
        

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl);
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };*/



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
            getCorPrioridade(item.prioridade),
            filtroStatus === "todos" ? getStatus(item.status) : null
        ].filter(val => val !== null)); // remove o "status" se não for necessário

        const head = filtroStatus === "todos"
            ? [["ID", "Nome", "Telefone", "Responsável", "Data de Inserção", "Prioridade", "Status"]]
            : [["ID", "Nome", "Telefone", "Responsável", "Data de Inserção", "Prioridade"]];

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
            <Alert className="mt-02 mb-02 dark text-center" variant="dark">
                <h2>Lista de Espera</h2>
            </Alert>

            <div style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1000,
                padding: '10px',
                borderBottom: '1px solid #ccc',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                width: '70%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
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

            <Form className="mt-3">
                <Form.Group controlId="formPesquisaNome">
                    <Form.Label>Pesquise a criança pelo nome</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Nome da Criança"
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

            <Container className="mt-4">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Responsável</th>
                            <th>Telefone</th>
                            <th>Prioridade</th>
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
                                <td>{getCorPrioridade(listaEspera.prioridade)}</td>
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

                <p>Quantidade de crianças cadastradas na lista de espera: {listaFiltrada.length}</p>

            </Container>
        </PaginaGeral>
    );
}
