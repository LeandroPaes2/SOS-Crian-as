import { Alert, Form, Button } from "react-bootstrap";
import "../../css/telaTurma.css";
import { useState, useEffect } from "react";
import PaginaGeral from "../../../componentes/layouts/PaginaGeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/alerts.css";
import { useEventos } from "../../../EventosContext";

export default function FormCadEvento(props) {
    const [periodo, setPeriodo] = useState("");
    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [id, setId] = useState(0);
    const [editando, setEditando] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Pega a lista de eventos da navegação anterior ou inicia vazia
    const { listaDeEventos, setListaDeEventos } = useEventos();

    const rotaVoltar = editando ? "/relatorioEvento" : "/telaEvento";

    useEffect(() => {
        if (location.state && location.state.nome && location.state.data && location.state.periodo && location.state.horaFim && location.state.horaInicio) {
            setNome(location.state.nome);
            setData(location.state.data);
            setId(location.state.id);
            setPeriodo(location.state.periodo);
            setHoraFim(location.state.horaFim);
            setHoraInicio(location.state.horaInicio);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!data || !nome || !periodo || !horaFim || !horaInicio) {
            setMensagem("Preencha todos os campos!");
            return;
        }

        const conflito = listaDeEventos.some(evento => {
            const mesmoDia = evento.data === data;
            const mesmoPeriodo = evento.periodo === periodo;
            const outroEvento = !editando || evento.id !== id;

            const inicioA = horaParaNumero(evento.horaInicio);
            const fimA = horaParaNumero(evento.horaFim);
            const inicioB = horaParaNumero(horaInicio);
            const fimB = horaParaNumero(horaFim);
        
            if (mesmoDia && mesmoPeriodo && outroEvento) {
        
                const foraDoHorario = (inicioA < fimB && inicioA>inicioB) || (fimA > inicioB && fimA < fimB) || inicioA==inicioB || fimA==fimB;
                return foraDoHorario;
            }
        
            return false;
        });

        const conflitoHorario = listaDeEventos.some(evento => {
            const outroEvento = !editando || evento.id !== id;
            const inicioA = horaParaNumero(horaInicio);
            const fimA = horaParaNumero(horaFim);
        
            
                const foraDoHorario = inicioA < horaParaNumero("08:00") || inicioA > horaParaNumero("17:00") || fimA < horaParaNumero("08:00") || fimA > horaParaNumero("17:00");
                

                return foraDoHorario;
        });
        
        if(conflitoHorario){
            setMensagem("Não é permitido eventos neste horario!");
            return;
        }
        else{
            if(horaInicio === horaFim || horaParaNumero(horaFim)<horaParaNumero(horaInicio)){
                setMensagem("Horario de inicio e fim iguais ou término de evento antes do inicio.");
                return;
            }
            else{
                if (conflito) {
                    setMensagem("Conflito de horário! Já existe um evento nesse dia, período e horário.");
                    return;
                }
            }
        }

        const novoId = listaDeEventos.length > 0
        ? Math.max(...listaDeEventos.map((evento) => evento.id)) + 1
        : 1;
    
        const novoEvento = {
            id: editando ? id : novoId,
            nome,
            data,
            periodo,
            horaInicio,
            horaFim
        };
    
        let novaLista;
        if (editando) {
            novaLista = listaDeEventos.map((evento) => (evento.id === novoEvento.id ? novoEvento : evento));
        } else {
            novaLista = [...listaDeEventos, novoEvento];
        }
    
        setListaDeEventos(novaLista); // Atualiza a lista de eventos no contexto
        setMensagem(editando ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");
    
        // Limpa os campos
        setTimeout(() => {
            setNome("");
            setData("");
            setPeriodo("");
            setHoraInicio("");
            setHoraFim("");
            setMensagem("");
            setEditando(false);
    
            navigate("/relatorioEvento", {
                state: { eventos: novaLista }, 
            });
        }, 3000);
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

                    <Button as={Link} to={rotaVoltar} className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                    <Button className="botaoPesquisa" variant="primary" type="submit">
                        {editando ? "Atualizar" : "Cadastrar"}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}
