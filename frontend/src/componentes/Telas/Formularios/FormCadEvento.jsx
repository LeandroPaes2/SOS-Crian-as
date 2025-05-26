import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/alerts.css";
import { useLogin } from "../../../LoginContext";

export default function FormCadEvento(props) {
    const [periodo, setPeriodo] = useState("");
    const [nome, setNome] = useState("");
    const [tipoEvento, setTipoEvento] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [id, setId] = useState(0);
    const [editando, setEditando] = useState(false);
    const [evento, setEvento] = useState(id, nome, tipoEvento, dataInicio, dataFim, periodo, horaInicio, horaFim);
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const rotaVoltar = editando ? "/relatorioEvento" : "/telaEvento";

    useEffect(() => {
        if (location.state && location.state.id && location.state.nome && location.state.tipoEvento && location.state.dataInicio && location.state.dataFim && location.state.periodo && location.state.horaFim && location.state.horaInicio) {
            
            setId(location.state.id);
            setNome(location.state.nome);
            setTipoEvento(location.state.tipoEvento);
            setDataInicio(location.state.dataInicio);
            setDataFim(location.state.dataFim);
            setPeriodo(location.state.periodo);
            setHoraFim(location.state.horaFim);
            setHoraInicio(location.state.horaInicio);
            setEditando(true);
            console.log("Data recebida do location.state:", location.state.dataInicio);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação básica
    if (!dataInicio || !dataFim || !nome || !tipoEvento || !periodo || !horaFim || !horaInicio) {
        setMensagem("Preencha todos os campos!");
        return;
    }

    const evento = { id, nome, tipoEvento, dataInicio, dataFim, periodo, horaInicio, horaFim };
    const url = editando ? `http://localhost:3000/eventos/${id}` : "http://localhost:3000/eventos";
    const method = editando ? "PUT" : "POST";

    try {
        if (editando) {
            if (!window.confirm("Deseja realmente alterar o evento: " + evento.nome)) {
                return;
            }
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify(evento),
        });

        const resultado = await response.json();

        if (response.ok && resultado.status) {
            setMensagem(editando ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");

            setTimeout(() => {
                setNome("");
                setTipoEvento("");
                setDataInicio("");
                setDataFim("");
                setPeriodo("");
                setHoraInicio("");
                setHoraFim("");
                setMensagem("");
            }, 1000);

            if (editando) {
                setTimeout(() => {
                    navigate("/relatorioEvento");
                }, 3000);
            }

            setEditando(false);
        } else {
            setMensagem(resultado.mensagem || "Erro ao salvar evento.");
        }
    } catch (error) {
        console.error("Erro ao conectar com o backend:", error);
        setMensagem("Erro de conexão com o servidor.");
    }
};
    
    return (
        <div>
            <PaginaGeral>
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">CADASTRO DE EVENTOS</h2>
                </Alert>

                {mensagem && (
                    <Alert
                        className="mt-2 mb-2 success text-center"
                        variant={
                            mensagem.includes("sucesso")
                                ? "success"
                                : mensagem.includes("Erro") || mensagem.includes("erro") || mensagem.includes("Preencha") ||
                                  mensagem.includes("invalido")
                                ? "danger"
                                : "warning"
                        }
                    >
                        {mensagem}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" id="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control type="text" value={id} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3" id="nome">
                        <Form.Label>Nome/Descrição do Evento</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="tipoEvento">
                        <Form.Label>Tipo do Evento</Form.Label>
                        <Form.Select
                            value={tipoEvento}
                            onChange={(e) => setTipoEvento(e.target.value)}
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="Festa">Festa</option>
                            <option value="Passeio">Passeio</option>
                            <option value="Outro">Outro</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" id="dataInicio">
                        <Form.Label>Data Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="dataFim">
                        <Form.Label>Data Fim</Form.Label>
                        <Form.Control
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="periodo">
                        <Form.Label>Período</Form.Label>
                        <Form.Select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                            <option value="">Selecione o período</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" id="horaInicio">
                        <Form.Label>Hora Início</Form.Label>
                        <Form.Control
                            type="time"
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="horaFim">
                        <Form.Label>Hora Fim</Form.Label>
                        <Form.Control
                            type="time"
                            value={horaFim}
                            onChange={(e) => setHoraFim(e.target.value)}
                        />
                    </Form.Group>

                    <Button as={Link} to="/telaEvento" className="botaoPesquisa" variant="secondary">
                        Pagina inicial eventos
                    </Button>
                    <Button as={Link} to="/relatorioEvento" className="botaoPesquisa" variant="secondary">
                        Eventos Agendados
                    </Button>
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}
