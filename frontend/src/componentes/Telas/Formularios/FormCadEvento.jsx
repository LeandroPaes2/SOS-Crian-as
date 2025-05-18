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
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [id, setId] = useState(0);
    const [editando, setEditando] = useState(false);
    const [evento, setEvento] = useState(id, nome, data, periodo, horaInicio, horaFim);
    const location = useLocation();
    const navigate = useNavigate();
    const rotaVoltar = editando ? "/relatorioEvento" : "/telaEvento";

    useEffect(() => {
        if (location.state && location.state.id && location.state.nome && location.state.data && location.state.periodo && location.state.horaFim && location.state.horaInicio) {
            
            setId(location.state.id);
            setNome(location.state.nome);
            setData(location.state.data);
            setPeriodo(location.state.periodo);
            setHoraFim(location.state.horaFim);
            setHoraInicio(location.state.horaInicio);
            setEditando(true);
            console.log("Data recebida do location.state:", location.state.data);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação básica
    if (!data || !nome || !periodo || !horaFim || !horaInicio) {
        setMensagem("Preencha todos os campos!");
        return;
    }

    if (horaInicio === horaFim || horaParaNumero(horaFim) < horaParaNumero(horaInicio)) {
        setMensagem("Horário de início e fim inválido.");
        return;
    }

    const evento = { id, nome, data, periodo, horaInicio, horaFim };
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evento),
        });

        const resultado = await response.json();

        if (response.ok && resultado.status) {
            setMensagem(editando ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");

            setTimeout(() => {
                setNome("");
                setData("");
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


    function horaParaNumero(hora) {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    }
    
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

                    <Form.Group className="mb-3" id="data">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
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
