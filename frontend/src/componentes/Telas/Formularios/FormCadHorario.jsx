import {Alert, Form, Button} from "react-bootstrap";    
import { useState, useEffect } from "react";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function FormCadHorario() {
    const [id, setId] = useState("");
    const [turma, setTurma] = useState("");
    const [materia, setMateria] = useState("");
    const [hora, setHora] = useState("");
    const [semana, setSemana] = useState("");
    const location = useLocation();
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if(location.state && location.state.id && location.state.turma && location.state.materia && location.state.hora && location.state.semana) {
            setId(location.state.id);
            setTurma(location.state.turma);
            setMateria(location.state.materia);
            setHora(location.state.hora);
            setSemana(location.state.semana);
            setEditando(true);
        }
    }, [location.state]);

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        if(!turma || !materia || !hora || !semana) {
            alert("Preencha todos os campos!");
            return;
        }

        const horario = {id, turma, materia, hora, semana};
        const url = editando 
                      ? `http://localhost:3000/horarios/${id}` 
                      : "http://localhost:3000/horarios";
        const method = editando ? "PUT" : "POST";

        try {
            if(editando){
                const confirmar = window.confirm(`Deseja realmente atualizar o horário: ${horario.hora}?`);
                if(!confirmar) return;
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(horario)
            });
            if(response.ok) {
                alert(editando 
                    ? "Horário atualizado com sucesso!" 
                    : "Horário cadastrado com sucesso!");
            } else {
                alert("Erro ao cadastrar o horário.");
            }
        } catch(error) {
            console.error("Erro ao conectar com o backend:", error);
            alert("Erro de conexão com o servidor.");
        }
    }

    return (
        <PaginaGeral>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">
                                    {editando ? "Editar Horário" : "Cadastrar Horário"}
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="turma">Turma:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="turma"
                                            value={turma}
                                            onChange={(e) => setTurma(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="materia">Materia:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="materia"
                                            value={materia}
                                            onChange={(e) => setMateria(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hora">Hora:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="hora"
                                            value={hora}
                                            onChange={(e) => setHora(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="semana">Semana:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="semana"
                                            value={semana}
                                            onChange={(e) => setSemana(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {editando ? "Atualizar" : "Cadastrar"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PaginaGeral>
    );
}