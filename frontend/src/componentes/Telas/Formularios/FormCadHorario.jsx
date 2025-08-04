import { Alert, Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/horario.css"
import { IoArrowBackCircle } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";

export default function FormCadHorario() {
    const [id, setId] = useState("");
    const [turma, setTurma] = useState("");
    const [materia, setMateria] = useState("");
    const [hora, setHora] = useState("");
    const [semana, setSemana] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [editando, setEditando] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [erros, setErros] = useState({
        turma: false,
        materia: false,
        hora: false,
        semana: false,
    });

    const turmaSelecionada = turmas.find((t) => t.id === parseInt(turma));
    const materiaSelecionada = materias.find((m) => m.id === parseInt(materia));

    const navigate = useNavigate();
    const location = useLocation();

    const rotaVoltar = editando ? "/relatorioHorario" : "/telaMenu";

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        if (location.state) {
            setId(location.state.id || "");
            setTurma(location.state.turma?.id?.toString() || "");
            setMateria(location.state.materia?.id?.toString() || "");
            setHora(location.state.hora || "");
            setSemana(location.state.semana || "");
            setEditando(true);
        }
    }, [location.state]);

    async function carregarTurmas() {
        try {
            const res = await fetch("http://localhost:3000/turmas", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTurmas(data);
            } else {
                console.error("Resposta inválida de turmas:", data);
                setTurmas([]);
            }
        } catch (err) {
            console.error("Erro ao carregar turmas:", err);
            setTurmas([]);
        }
    }

    async function carregarMaterias() {
        try {
            const res = await fetch("http://localhost:3000/materias", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if (res.status === 401) {
                console.error("Não autorizado! Verifique o token.");
                setMaterias([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setMaterias(data);
            } else {
                console.error("Resposta inválida de matérias:", data);
                setMaterias([]);
            }
        } catch (err) {
            console.error("Erro ao carregar matérias:", err);
            setMaterias([]);
        }
    }

    useEffect(() => {
        carregarTurmas();
        carregarMaterias();
    }, []);

    // Fecha a mensagem após 5 segundos se for sucesso
    useEffect(() => {
        if (
            mensagem.toLowerCase().includes("sucesso") &&
            mensagem.trim() !== ""
        ) {
            const timer = setTimeout(() => setMensagem(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    // ... seu código antes do handleSubmit

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validação dos campos
        const errosTemp = {
            turma: turma.trim() === "",
            materia: materia.trim() === "",
            hora: hora.trim() === "",
            semana: semana.trim() === "",
        };
        setErros(errosTemp);

        if (Object.values(errosTemp).some(Boolean)) {
            setMensagem("Preencha todos os campos corretamente.");
            setTimeout(() => setMensagem(""), 3000);
            return;
        }

        const method = editando ? "PUT" : "POST";

        // Verificar duplicidade como antes
        try {
            const res = await fetch(`http://localhost:3000/horarios`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            if (res.status === 401) {
                setMensagem("Não autorizado! Faça login novamente.");
                return;
            }

            const horariosExistentes = await res.json();

            if (!Array.isArray(horariosExistentes)) {
                setMensagem("Resposta inesperada do servidor.");
                return;
            }

            const conflito = horariosExistentes.find(
                (h) =>
                    h.turma.id === parseInt(turma) &&
                    h.hora === hora &&
                    h.semana === semana &&
                    (!editando || h.id !== parseInt(id))
            );

            if (conflito) {
                setMensagem(
                    "Já existe um horário cadastrado para esta turma, dia e horário."
                );
                return;
            }
        } catch (error) {
            console.error("Erro ao verificar duplicidade:", error);
            setMensagem("Erro ao verificar horários existentes.");
            return;
        }

        // Monta objeto para enviar, agora com turmaId e materiaId (simples)
        const horario = {
            turma: { id: parseInt(turma) },
            materia: { id: parseInt(materia) },
            hora,
            semana,
        };



        const url = editando
            ? `http://localhost:3000/horarios/${id}`
            : "http://localhost:3000/horarios";

        try {
            if (editando) {
                const confirmar = window.confirm(
                    `Deseja realmente atualizar o horário: ${hora}?`
                );
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(horario),
            });

            if (!response.ok) {
                const erroDetalhado = await response.json();
                console.error("Erro do backend:", erroDetalhado);
                setMensagem(erroDetalhado.mensagem || "Erro ao cadastrar o horário.");
                return;
            }

            setMensagem(
                editando
                    ? "Horário atualizado com sucesso!"
                    : "Horário cadastrado com sucesso!"
            );

            if (!editando) {
                setTurma("");
                setMateria("");
                setHora("");
                setSemana("");
                setErros({
                    turma: false,
                    materia: false,
                    hora: false,
                    semana: false,
                });
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div style={{ height: "100vh", overflow: "hidden" }}>
            <PaginaGeral>
                <Form onSubmit={handleSubmit} className="cadastroHorario">
                    <div className="TituloH">
                        <strong> <h2>Horários</h2>  </strong>
                    </div>

                    {mensagem && (
                        <div style={{ position: 'absolute', marginTop: '100px', marginLeft: '230px' }}>
                            <Alert className="alert-animado mt-2 mb-2" variant={
                                mensagem.toLowerCase().includes("sucesso") ? "success" :
                                    mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha") ? "danger" : "warning"
                            }>
                                {mensagem}
                            </Alert>
                        </div>
                    )}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formTurma">
                                <Form.Label style={{ fontWeight: '500' }}>Turma</Form.Label>
                                <Form.Select
                                    value={turma}
                                    onChange={(e) => setTurma(e.target.value)}
                                    isInvalid={erros.turma}
                                    className="inputHorario"
                                >
                                    <option value="">Selecione a turma</option>
                                    {turmas.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.cor}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor, selecione uma turma.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formMateria">
                                <Form.Label style={{ fontWeight: '500' }}>Matéria</Form.Label>
                                <Form.Select
                                    value={materia}
                                    onChange={(e) => setMateria(e.target.value)}
                                    isInvalid={erros.materia}
                                    className="inputHorario"
                                >
                                    <option value="">Selecione a matéria</option>
                                    {materias.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor, selecione uma matéria.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formHora">
                                <Form.Label style={{ fontWeight: '500' }}>Hora</Form.Label>
                                <Form.Select
                                    value={hora}
                                    onChange={(e) => setHora(e.target.value)}
                                    isInvalid={erros.hora}
                                    className="inputHorario"
                                >
                                    <option value="">Selecione o horário</option>
                                    <option>07:00 às 08:00</option>
                                    <option>08:00 às 09:00</option>
                                    <option>09:00 às 10:00</option>
                                    <option>10:00 às 11:00</option>
                                    <option>11:00 às 12:00</option>
                                    <option>13:00 às 14:00</option>
                                    <option>14:00 às 15:00</option>
                                    <option>15:00 às 16:00</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor, selecione um horário.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formSemana">
                                <Form.Label style={{ fontWeight: '500' }}>Dia da Semana</Form.Label>
                                <Form.Select
                                    value={semana}
                                    onChange={(e) => setSemana(e.target.value)}
                                    isInvalid={erros.semana}
                                    className="inputHorario"
                                >
                                    <option value="">Selecione o dia</option>
                                    <option>Segunda-feira</option>
                                    <option>Terça-feira</option>
                                    <option>Quarta-feira</option>
                                    <option>Quinta-feira</option>
                                    <option>Sexta-feira</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor, selecione um dia da semana.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>


                    <div className="d-flex justify-content-between mt-4 margintop">
                        <Button
                            as={Link}
                            to={rotaVoltar}
                            className="botaoPesquisa"
                            variant="secondary"
                        >
                            <IoArrowBackCircle size={20} />  Voltar
                        </Button>

                        <Button
                            as={Link}
                            to="/relatorioHorario"
                            className="botaoPesquisa"
                            variant="secondary"
                            style={{ backgroundColor: '#642ca9', borderColor: '#4f2f7fff' }}>
                            <TbReportSearch size={20} />  Relatórios
                        </Button>

                        <Button
                            className="botaoPesquisa"
                            variant="primary"
                            type="submit"
                            style={{ backgroundColor: '#ffba49', borderColor: '#e09722ff' }}>
                            <TbSend />
                            {editando ? "  Atualizar" : "  Cadastrar"}
                        </Button>
                    </div>
                </Form>
            </PaginaGeral>
        </div>
    );
}
