import { useState, useEffect, useCallback } from "react";
import { Form, Button, Alert, Table } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../css/telaTurma.css";

export default function FormCadPresenca() {
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedTurma, setSelectedTurma] = useState('');
    const [presencas, setPresencas] = useState({});
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [editando, setEditando] = useState(false);

    // Carrega dados iniciais para edição
    useEffect(() => {
        if (location.state?.id) {
            setEditando(true);
            setSelectedMateria(location.state.materia.id);
            setSelectedTurma(location.state.turma.id);

            // Atualiza matérias sem duplicatas
            setMaterias(prev => {
                const exists = prev.some(m => m.id === location.state.materia.id);
                return exists ? prev : [...prev, location.state.materia];
            });

            // Atualiza turmas sem duplicatas
            setTurmas(prev => {
                const exists = prev.some(t => t.id === location.state.turma.id);
                return exists ? prev : [...prev, location.state.turma];
            });

            // Preenche presenças
            const presencasIniciais = {};
            location.state.alunosPresentes.forEach(ap => {
                presencasIniciais[ap.aluno.id] = ap.presente;
            });
            setPresencas(presencasIniciais);
        }
    }, [location.state]);
    
    // Carrega matérias ao iniciar
    useEffect(() => {
        async function carregarMaterias() {
            try {
                const res = await fetch('http://localhost:3000/materias');
                const data = await res.json();
                setMaterias(data);
            } catch (error) {
                setMensagem('Erro ao carregar matérias: ' + error.message);
            }
        }
        carregarMaterias();
    }, []);

    // Carrega turmas quando matéria é selecionada
    useEffect(() => {
        async function carregarTurmas() {
            if (selectedMateria) {
                try {
                    const res = await fetch(
                        `http://localhost:3000/presencas/materia/${selectedMateria}/turmas`
                    );
                    const data = await res.json();
                    setTurmas(data);
                } catch (error) {
                    setMensagem('Erro ao carregar turmas: ' + error.message);
                }
            }
        }
        carregarTurmas();
    }, [selectedMateria]);

    // Carrega alunos quando turma é selecionada
    const carregarAlunos = useCallback(async () => {
        if (selectedTurma || editando) {
            try {
                const res = await fetch('http://localhost:3000/alunos');
                const data = await res.json();

                // Mantém presenças existentes
                setPresencas(prevPresencas => {
                    const novasPresencas = { ...prevPresencas };

                    if (!editando) {
                        data.forEach(aluno => {
                            if (!(aluno.id in novasPresencas)) {
                                novasPresencas[aluno.id] = true;
                            }
                        });
                    } else {
                        data.forEach(aluno => {
                            if (!(aluno.id in novasPresencas)) {
                                novasPresencas[aluno.id] = false;
                            }
                        });
                    }
                    return novasPresencas;
                });

                setAlunos(data);
            } catch (error) {
                setMensagem('Erro ao carregar alunos: ' + error.message);
            }
        }
    }, [selectedTurma, editando]); // presencas não é mais necessário

    useEffect(() => {
        carregarAlunos();
    }, [carregarAlunos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedMateria || !selectedTurma) {
            setMensagem('Selecione uma matéria e uma turma');
            return;
        }

        try {
            const alunosPresentes = alunos.map(aluno => ({
                alunoId: aluno.id,
                presente: presencas[aluno.id] || false
            }));

            const url = editando 
                ? `http://localhost:3000/presencas/${location.state.id}`
                : 'http://localhost:3000/presencas';
            
            const method = editando ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    materiaId: selectedMateria,
                    turmaId: selectedTurma,
                    alunos: alunosPresentes
                })
            });

            if (!response.ok) {
                throw new Error(editando 
                    ? 'Erro ao atualizar presenças' 
                    : 'Erro ao registrar presenças');
            }

            setMensagem(editando 
                ? 'Presenças atualizadas com sucesso!' 
                : 'Presenças registradas com sucesso!');
            
            setTimeout(() => navigate('/relatorioPresenca'), 2000);
            
        } catch (error) {
            setMensagem(error.message);
        }
    };

    return (
        <div className="cadastroTurma">
            <PaginaGeral>
                <h2 className="text-center mb-4">
                    {editando ? 'Editar' : 'Cadastrar'}
                </h2>
                
                {mensagem && (
                    <Alert variant={mensagem.includes('sucesso') ? 'success' : 'danger'}>
                        {mensagem}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Form.Group controlId="formMateria">
                                <Form.Label>Matéria</Form.Label>
                                <Form.Select
                                    value={selectedMateria}
                                    onChange={(e) => !editando && setSelectedMateria(e.target.value)}
                                    disabled={editando}
                                    required
                                >
                                    <option value="">Selecione uma matéria</option>
                                    {materias.map(materia => (
                                        <option key={materia.id} value={materia.id}>
                                            {materia.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group controlId="formTurma">
                                <Form.Label>Turma</Form.Label>
                                <Form.Select
                                    value={selectedTurma}
                                    onChange={(e) => !editando && setSelectedTurma(e.target.value)}
                                    disabled={editando}
                                    required
                                >
                                    <option value="">Selecione uma turma</option>
                                    {turmas.map(turma => (
                                        <option key={turma.id} value={turma.id}>
                                            {turma.cor} - {turma.periodo}
                                        </option>
                                    ))}
                                    {turmas.length === 0 && selectedMateria && (
                                        <option disabled>Nenhuma turma encontrada para esta matéria</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>

                    {alunos.length > 0 && (
                        <>
                            <h4 className="mt-4 mb-3">Registro de Presenças</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Aluno</th>
                                        <th>Presente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alunos.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td>{aluno.nome}</td>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={presencas[aluno.id] || false}
                                                    onChange={(e) => setPresencas({
                                                        ...presencas,
                                                        [aluno.id]: e.target.checked
                                                    })}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}

                    <Button as={Link} to="/telaPresenca" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>

                    <Button type="submit" className="botaoPesquisa" variant="primary" disabled={alunos.length === 0}>
                        {editando ? 'Atualizar' : 'Salvar'}
                    </Button>
                </Form>
            </PaginaGeral>
        </div>
    );
}