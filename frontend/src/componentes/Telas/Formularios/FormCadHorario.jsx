import { Alert, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

    const turmaSelecionada = turmas.find(t => t.id === parseInt(turma));
    const materiaSelecionada = materias.find(m => m.id === parseInt(materia));

    const navigate = useNavigate();
    const location = useLocation();

    const rotaVoltar = editando ? "/relatorioHorario" : "/telaHorario";

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

    // Buscar turmas e matérias do backend
    useEffect(() => {
        fetch("http://localhost:3000/turmas")
            .then(res => res.json())
            .then(data => setTurmas(data))
            .catch(err => console.error("Erro ao carregar turmas:", err));

        fetch("http://localhost:3000/materias")
            .then(res => res.json())
            .then(data => setMaterias(data))
            .catch(err => console.error("Erro ao carregar matérias:", err));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!turma || !materia || !hora || !semana) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/horarios`);
            const horariosExistentes = await res.json();
    
            const conflito = horariosExistentes.find(h =>
                h.turma.id === parseInt(turma) &&
                h.hora === hora &&
                h.semana === semana &&
                (!editando || h.id !== parseInt(id))
            );
    
            if (conflito) {
                setMensagem("Já existe um horário cadastrado para esta turma, dia e horário.");
                return;
            }
        } catch (error) {
            console.error("Erro ao verificar duplicidade:", error);
            setMensagem("Erro ao verificar horários existentes.");
            return;
        }


        const horario = {
            id,
            turma: turmaSelecionada,
            materia: materiaSelecionada,
            hora,
            semana
        };
        
        const url = editando
            ? `http://localhost:3000/horarios/${id}`
            : "http://localhost:3000/horarios";
        const method = editando ? "PUT" : "POST";

        try {
            if (editando) {
                const confirmar = window.confirm(`Deseja realmente atualizar o horário: ${horario.hora}?`);
                if (!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(horario)
            });
            if (response.ok) {
                setMensagem(editando
                    ? "Horário atualizado com sucesso!"
                    : "Horário cadastrado com sucesso!");
            } else {
                setMensagem("Erro ao cadastrar o horário.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="cadastroEscola">
            <PaginaGeral>
                <Alert className="mt-2 mb-2 text-center" variant="dark">
                    <h2 className="titulo-alert">
                        {editando ? "Editar Horário" : "Cadastrar Horário"}
                    </h2>
                </Alert>

                {mensagem && (
                    <Alert className="mt-2 mb-2 text-center" variant={
                        mensagem.toLowerCase().includes("sucesso") ? "success" :
                            mensagem.toLowerCase().includes("erro") || mensagem.toLowerCase().includes("preencha")
                                ? "danger" : "warning"
                    }>
                        {mensagem}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formTurma">
                        <Form.Label>Turma</Form.Label>
                        <Form.Select
                            value={turma}
                            onChange={(e) => setTurma(e.target.value)}
                            isInvalid={mensagem && turma.trim().length === 0}
                        >
                            <option value="">Selecione a turma</option>
                            {turmas.map(t => (
                                <option key={t.id} value={t.id}>{t.cor}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, selecione uma turma.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMateria">
                        <Form.Label>Matéria</Form.Label>
                        <Form.Select
                            value={materia}
                            onChange={(e) => setMateria(e.target.value)}
                            isInvalid={mensagem && materia.trim().length === 0}
                        >
                            <option value="">Selecione a matéria</option>
                            {materias.map(m => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, selecione uma matéria.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formHora">
                        <Form.Label>Hora</Form.Label>
                        <Form.Select
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            isInvalid={mensagem && hora.trim().length === 0}
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

                    <Form.Group className="mb-3" controlId="formSemana">
                        <Form.Label>Dia da Semana</Form.Label>
                        <Form.Select
                            value={semana}
                            onChange={(e) => setSemana(e.target.value)}
                            isInvalid={mensagem && semana.trim().length === 0}
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
