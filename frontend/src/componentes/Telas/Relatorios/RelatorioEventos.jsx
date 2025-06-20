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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [filtroStatus, setFiltroStatus] = useState("todos");
    const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: ''
});
    const [ordenarPor, setOrdenarPor] = useState("nome");
    const [listaTurmas, setListaTurmas] = useState([]);
    const [listaFunc, setListaFunc] = useState([]);

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

                const eventosComDetalhes = await Promise.all(dados.map(async (evento) => {
                    const [turmasRes, funcsRes] = await Promise.all([
                    fetch(`http://localhost:3000/eventoTurmas/${evento.id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:3000/eventoFuncionario/${evento.id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                    ]);

                    if (!turmasRes.ok || !funcsRes.ok) throw new Error("Erro ao buscar detalhes do evento");

                    const turmas = await turmasRes.json();
                    const funcionarios = await funcsRes.json();

                    return { ...evento, turmas, funcionarios };
                }));

                setListaDeEventos(eventosComDetalhes); // Atualiza o estado com os dados do backend

                
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
                    window.location.reload();
                }
                else {
                    setMensagem(response.error || "Erro ao excluir o evento.");
                    setTimeout(() => setMensagem(""), 3000);
                }
            } catch (e) {
                console.error("Erro ao conectar com o backend:", e);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
    };

    const editarEventos = async (evento) => {
        const resposta = await fetch("http://localhost:3000/eventoTurmas/" + evento.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
        if (!resposta.ok) 
            throw new Error("Erro ao buscar turmas do evento");
        const resp = await fetch("http://localhost:3000/eventoFuncionario/" + evento.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
        if (!resp.ok) 
            throw new Error("Erro ao buscar organizadores do evento");
        const dados = await resposta.json();
        setListaTurmas(dados);

        const dadosFunc = await resp.json();
        setListaFunc(dadosFunc);
        
        navigate("/cadastroEvento", {
            state: {
                id: evento.id,
                nome: evento.nome,
                tipoEvento: evento.tipoEvento,
                dataInicio: evento.dataInicio.split("T")[0],
                dataFim: evento.dataFim.split("T")[0],
                periodo: evento.periodo,
                horaInicio: evento.horaInicio,
                horaFim: evento.horaFim,
                listaTurmas: dados,
                listaFuncionario: dadosFunc
            }
        });
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const ordenarOptions = [
        { name: 'Nome', value: 'nome' },
        { name: 'Data de Início', value: 'dataInicio' },
    ];

    const statusOptions = [
        { name: 'Futuros', value: '2' },
        { name: 'Passados', value: '0' },
        { name: 'Todos', value: 'todos' },
        // Adicione novos status aqui no futuro
    ];

    const getStatus = (status) => {
        if (status === 0) return "PASSADOS";
        if (status === 2) return "FUTUROS";
        return status;
    };

    const eventosFiltrados = listaDeEventos.filter((evento) => {
    const nomeCorresponde = evento.nome.toLowerCase().includes(pesquisaNome.toLowerCase());

    const dataEvento = evento.dataInicio.split("T")[0]; // formato YYYY-MM-DD
    const dataInicioFiltro = filtros.dataInicio;
    const dataFimFiltro = filtros.dataFim;

    const hoje = new Date().toISOString().split("T")[0]; // data atual (só a parte da data)

    let dataCorresponde = true;
    if (dataInicioFiltro && !dataFimFiltro) {
        dataCorresponde = dataEvento === dataInicioFiltro;
    } else if (!dataInicioFiltro && dataFimFiltro) {
        dataCorresponde = dataEvento <= dataFimFiltro;
    } else if (dataInicioFiltro && dataFimFiltro) {
        dataCorresponde = dataEvento >= dataInicioFiltro && dataEvento <= dataFimFiltro;
    }

    // Filtra por status (passado, futuro, todos)
    let statusCorresponde = true;
    if (filtroStatus === "0") {
        statusCorresponde = dataEvento < hoje; // eventos passados
    } else if (filtroStatus === "2") {
        statusCorresponde = dataEvento >= hoje; // eventos futuros
    }

    return nomeCorresponde && dataCorresponde && statusCorresponde;
});



    const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {
    if (ordenarPor === "nome") {
        return a.nome.toLowerCase().localeCompare(b.nome.toLowerCase());
    } else if (ordenarPor === "dataInicio") {
    const dataA = new Date(a.dataInicio);
    const dataB = new Date(b.dataInicio);
    return dataA - dataB; // ordena do mais antigo para o mais novo

    }
    return 0;
});



    return (
        <PaginaGeral>
            <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Eventos</h2>
                    </div>
                <div className="bg-white p-3 rounded shadow-sm mb-4">
                    <Form>
  <Row className="gy-3 align-items-end">
    {/* Pesquisa por nome */}
    <Col xs={12} md={4}>
      <Form.Group controlId="pesquisaNome">
        <Form.Label><strong>Pesquisar por nome:</strong></Form.Label>
        <Form.Control
          placeholder="Digite o nome do evento"
          value={pesquisaNome}
          onChange={(e) => setPesquisaNome(e.target.value)}
        />
      </Form.Group>
    </Col>

    {/* Período do evento */}
    <Col xs={12} md={8}>
      <Form.Label><strong>Busque pelo período do evento:</strong></Form.Label>
      <Row className="gx-3">
        <Col xs={12} sm={6} md={5}>
          <Form.Group controlId="filtroDataInicio">
            <Form.Label className="mb-1">Data Início:</Form.Label>
            <Form.Control
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="mt-2"
              onClick={() => setFiltros(prev => ({ ...prev, dataInicio: '' }))}
              block="true"
            >
              Limpar Início
            </Button>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={5}>
          <Form.Group controlId="filtroDataFim">
            <Form.Label className="mb-1">Data Fim:</Form.Label>
            <Form.Control
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="mt-2"
              onClick={() => setFiltros(prev => ({ ...prev, dataFim: '' }))}
              block="true"
            >
              Limpar Fim
            </Button>
          </Form.Group>
        </Col>
      </Row>
    </Col>

    {/* Filtro Status */}
    <Col xs={12} md={4}>
      <Form.Label><strong>Status:</strong></Form.Label>
      <ButtonGroup className="w-100">
        {statusOptions.map((option, idx) => (
          <ToggleButton
            key={idx}
            id={`status-${idx}`}
            type="radio"
            variant="outline-primary"
            name="status"
            value={option.value}
            checked={filtroStatus === option.value}
            onChange={(e) => setFiltroStatus(e.currentTarget.value)}
            className="text-center"
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Col>

    {/* Ordenar por */}
    <Col xs={12} md={4}>
      <Form.Label><strong>Ordenar por:</strong></Form.Label>
      <ButtonGroup className="w-100">
        {ordenarOptions.map((option, idx) => (
          <ToggleButton
            key={idx}
            id={`ordenar-${idx}`}
            type="radio"
            variant="outline-success"
            name="ordenar"
            value={option.value}
            checked={ordenarPor === option.value}
            onChange={(e) => setOrdenarPor(e.currentTarget.value)}
            className="text-center"
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </Col>
  </Row>
</Form>
                    </div>
                <br />
                <Button as={Link} to="/cadastroEvento" className="botaoPesquisa" variant="secondary">
                        Cadastrar
                    </Button>
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
                                <th>TURMAS</th>
                                <th>ORGANIZADORES</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                eventosOrdenados?.map((evento) => {

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
                                                {evento.turmas?.map((turma, index) => (
                                                    <div key={index}>{turma.cor}</div>
                                                ))}
                                            </td>

                                            {/* ORGANIZADORES */}
                                            <td>
                                                {evento.funcionarios?.map((func, index) => (
                                                    <div key={index}>{func.nome}</div>
                                                ))}
                                            </td>
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
                        <Button as={Link} to="/telaMenu" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                    </div>
                </div>
                </Container>
            </div>
        </PaginaGeral>
    );
}
