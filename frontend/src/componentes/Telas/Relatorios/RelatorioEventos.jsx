import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/alerts.css";

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
        <>
            <PaginaGeral>

                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">LISTA DE EVENTOS</h2>
                </Alert>

                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O EVENTO PELO NOME</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control className="formInput" type="text" placeholder="Pesquise o nome do evento"
                                    value={pesquisaNome}
                                    onChange={(e) => setPesquisaNome(e.target.value)} />
                            </div>
                            <div>
                                <Button className="botaoPesquisa" variant="secondary">
                                    Pesquisar
                                </Button>
                            </div>
                        </InputGroup>
                    </Form.Group>
                </Form>
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
                <Container>
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
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <Button onClick={() => editarEventos(evento)}
                                                        variant="warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button onClick={() => {
                                                        excluirEvento(evento);
                                                    }} variant="danger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
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
                </Container>
                <div>
                    <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button as={Link} to="/cadastroEvento" className="botaoPesquisa" variant="secondary">
                        Cadastrar novo evento
                    </Button>
                </div>
            </PaginaGeral>
        </>
    );
}
