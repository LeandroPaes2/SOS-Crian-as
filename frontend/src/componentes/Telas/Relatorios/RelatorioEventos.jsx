import { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Alert, Container, ButtonGroup, ToggleButton, Row, Col } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/telaTurma.css";

function dataNova(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

export default function RelatorioEventos() {

    const [listaDeEventos, setListaDeEventos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(false);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {  //é executado uma única vez quando o componente monta, ou seja, quando a página/carregamento do componente acontece pela primeira vez.
        //Ele serve pra carregar os elementos que você precisa assim que a página abrir, como buscar dados no backend
        const buscarEventos = async () => {
            console.log(token);
            try {
                const response = await fetch("http://localhost:3000/eventos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    console.log("Status da resposta:", response.status);
                    throw new Error("Erro ao buscar eventos");
                }

                const dados = await response.json();
                setListaDeEventos(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar eventos:", error);
                setMensagem("Erro ao carregar os eventos.");
            }
        };

        buscarEventos();
    }, []);  //Esse [] (array de dependências vazio) faz com que o efeito rode só uma vez, na "montagem" do componente — igual ao componentDidMount em classes React.

    const excluirEvento = async (evento) => {
        if (window.confirm("Deseja realmente excluir o evento " + evento.nome)) {
            if (evento.id <= 0 || !evento.nome || !evento.dataInicio || !evento.dataFim || !evento.periodo || !evento.horaInicio || !evento.horaFim) {
                setMensagem("Erro: evento inválido!");
                setTimeout(() => setMensagem(""), 5000);
                return;
            }
            try {
                const response = await fetch("http://localhost:3000/eventos/" + evento.id, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {
                    setMensagem("Evento excluido com sucesso!");
                    setTimeout(() => setMensagem(""), 3000);
                    setListaDeEventos(listaDeEventos.filter((e) => e.id !== evento.id));
                }
                else {
                    setMensagem("Erro ao excluir o evento.");
                    setTimeout(() => setMensagem(""), 3000);
                }
            } catch (e) {
                console.error("Erro ao conectar com o backend:", e);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload();
    };

    const editarEventos = async (evento) => {
        navigate("/cadastroEvento", {
            state: {
                id: evento.id,
                nome: evento.nome,
                tipoEvento: evento.tipoEvento,
                dataInicio: evento.dataInicio.split("T")[0],
                dataFim: evento.dataFim.split("T")[0],
                periodo: evento.periodo,
                horaInicio: evento.horaInicio,
                horaFim: evento.horaFim
            }
        });
    };


    const eventosFiltrados = pesquisaNome
        ? listaDeEventos.filter((evento) => evento.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeEventos;

    return (
        <PaginaGeral>
            <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Eventos</h2>
                    </div>
                <div className="bg-white p-3 rounded shadow-sm mb-4">
                        <Row className="gy-3">
                            
                            <Col md={4} sm={12}>
                                <Form.Label><strong>Pesquisar por nome:</strong></Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Digite o nome do evento"
                                        value={pesquisaNome}
                                        onChange={(e) => setPesquisaNome(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </div>
                <br />
                {mensagem && <Alert className="mt-02 mb-02 green text-center" variant={
                    mensagem.includes("sucesso")
                        ? "success"
                        : mensagem.includes("Erro") || mensagem.includes("erro")
                            ? "danger"
                            : "warning"
                }>
                    {mensagem}
                </Alert>}
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="table-responsive">
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>TIPO</th>
                                <th>PERIODO</th>
                                <th>DATA INICIO</th>
                                <th>DATA FIM</th>
                                <th>HORA INICIO</th>
                                <th>HORA FIM</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                eventosFiltrados?.map((evento) => {

                                    return (
                                        <tr>
                                            <td>{evento.nome}</td>
                                            <td>{evento.tipoEvento}</td>
                                            <td>{evento.periodo}</td>
                                            <td>{dataNova(evento.dataInicio)}</td>
                                            <td>{dataNova(evento.dataFim)}</td>
                                            <td>{evento.horaInicio}</td>
                                            <td>{evento.horaFim}</td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        onClick={() => editarEventos(evento)}
                                                        variant="warning"
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => excluirEvento(evento)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        </Table>
                        <p>Quatidade de eventos cadastrados: {listaDeEventos.length}</p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaAluno" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                        <Button variant="info" >
                            🖨️ Imprimir
                        </Button>
                    </div>
                </div>
                </Container>
            </div>
        </PaginaGeral>
    );
}
