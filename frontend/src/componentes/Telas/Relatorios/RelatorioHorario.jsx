import { useState, useEffect, use } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaTurma.css";

export default function RelatorioHorario() {

    const [listadeHorarios, setListadeHorarios] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [pesquisaTurma, setPesquisaTurma] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        const buscarHorarios = async () => {
            
            try {
                const response = await fetch("http://localhost:3000/horarios", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Erro ao buscar horários");
                const data = await response.json();
                setListadeHorarios(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao carregar horários:", err);
                setMensagem("Erro ao carregar horários.");
            }
        };

        buscarHorarios();
    }, []);



    useEffect(() => {

        const buscarTurmas = async () => {
            try {
                const res = await fetch("http://localhost:3000/turmas", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                if (!res.ok) throw new Error("Erro ao buscar turmas");
                const data = await res.json();
                setTurmas(data);
            } catch (err) {
                console.error("Erro ao carregar turmas:", err);
                setTurmas([]);
            }
        };

        const buscarMaterias = async () => {
            try {
                const res = await fetch("http://localhost:3000/materias", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
                if (!res.ok) throw new Error("Erro ao buscar matérias");
                const data = await res.json();
                setMaterias(data);
            } catch (err) {
                console.error("Erro ao carregar matérias:", err);
                setMaterias([]);
            }
        };

        // CHAMADAS CORRETAS AQUI 👇
        buscarTurmas();
        buscarMaterias();
    }, []);


    const excluirHorario = async (horario) => {
        console.log("Tentando excluir:", horario);
        if (window.confirm("Deseja realmente excluir o horário" + horario.hora)) {
            if (!horario || !horario.id) {
                setMensagem("Erro ao excluir o horário.");
                return;
            }
            try {
                const res = await fetch(`http://localhost:3000/horarios/${horario.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });
                if (res.ok) {
                    setListadeHorarios(listadeHorarios.filter(h => h.id !== horario.id));
                    setMensagem("Horário excluído com sucesso!");
                } else {
                    setMensagem("Erro ao excluir o horário.");
                }

                setTimeout(() => {
                    setMensagem("");
                }, 3000);

            } catch (error) {
                console.error(error);
                setMensagem("Erro de conexão com o servidor.");

                setTimeout(() => {
                    setMensagem("");
                }, 3000);

            }
        }
    };

    const editarHorario = (horario) => {
        navigate("/cadastroHorario", {
            state: {
                id: horario.id,
                turma: horario.turma,
                materia: horario.materia,
                hora: horario.hora,
                semana: horario.semana
            }
        });
    };

    return (
                <PaginaGeral>
                    <div className="TelaD">
                    <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório de Horários</h2>
                    </div>

                        {/*<Form className="mt-4">
                            <Form.Group controlId="formPesquisaNome">
                                <Form.Label>Pequise a turma pelo nome</Form.Label>
                                <InputGroup>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Digite o nome da turma..." 
                                        value={pesquisaTurma} 
                                        onChange={(e) => setPesquisaTurma(e.target.value)}/>
                                    <Button variant="secondary">Pesquisar</Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>*/}

                        {mensagem && (
                            <Alert
                                className="text-center"
                                variant={
                                    mensagem.toLowerCase().includes("sucesso")
                                        ? "success"
                                        : mensagem.toLowerCase().includes("erro")
                                            ? "danger"
                                            : "warning"
                                }>
                                {mensagem}
                            </Alert>
                        )}

                        {turmas.map(turma => (
                            <div key={turma.id} className="mb-5">
                                <h4 className="mb-3 text-dark text-center" >Turma: {turma.cor}</h4>
                                <Table responsive bordered className="text-center align-middle">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "100px" }}>Horários</th>
                                            <th>Domingo</th>
                                            <th>2ª Feira</th>
                                            <th>3ª Feira</th>
                                            <th>4ª Feira</th>
                                            <th>5ª Feira</th>
                                            <th>6ª Feira</th>
                                            <th>Sábado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            "07:00 às 08:00",
                                            "08:00 às 09:00",
                                            "09:00 às 10:00",
                                            "10:00 às 11:00",
                                            "11:00 às 12:00",
                                            "13:00 às 14:00",
                                            "14:00 às 15:00",
                                            "15:00 às 16:00"
                                        ].map(horarioPadrao => (
                                            <tr key={horarioPadrao}>
                                                <td>{horarioPadrao}</td>
                                                {[
                                                    "Domingo",
                                                    "Segunda-feira",
                                                    "Terça-feira",
                                                    "Quarta-feira",
                                                    "Quinta-feira",
                                                    "Sexta-feira",
                                                    "Sábado"
                                                ].map(dia => {
                                                    const item = listadeHorarios.find(horario =>
                                                        horario.turma.id === turma.id &&
                                                        horario.hora === horarioPadrao &&
                                                        horario.semana === dia
                                                    );
                                                    return (
                                                        <td key={dia}>
                                                            {item ? (
                                                                <>
                                                                    <div>
                                                                        {materias.find(m => m.id === item.materia?.id)?.nome}
                                                                    </div>
                                                                    <div className="d-flex justify-content-center gap-1 mt-1">
                                                                        <Button size="sm" variant="success" onClick={() => editarHorario(item)}>✎</Button>
                                                                        <Button size="sm" variant="danger" onClick={() => excluirHorario(item)}>🗑</Button>
                                                                    </div>
                                                                </>
                                                            ) : null}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ))}


                        <div>
                            <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">Voltar</Button>
                        </div>
                    </Container>
                    </div>
                </PaginaGeral>
           
    );
}