import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import PaginaGeral from '../../layouts/PaginaGeral';
import { Link, useNavigate } from 'react-router-dom';


export default function FormCadPresenca() {
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedTurma, setSelectedTurma] = useState('');
    const [presencas, setPresencas] = useState({});
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    // Carrega matérias ao iniciar
    useEffect(() => {
        async function carregarMaterias() {
            try {
                setCarregando(true);
                const res = await fetch('http://localhost:3000/materias');
                const data = await res.json();
                setMaterias(data);
            } catch (error) {
                setMensagem('Erro ao carregar matérias: ' + error.message);
            } finally {
                setCarregando(false);
            }
        }
        carregarMaterias();
    }, []);

    // Carrega turmas quando matéria é selecionada
    useEffect(() => {
        async function carregarTurmas() {
            if (selectedMateria) {
                try {
                    setCarregando(true);
                    const res = await fetch(`http://localhost:3000/presencas/materia/${selectedMateria}/turmas`);
                    const data = await res.json();
                    setTurmas(data);
                } catch (error) {
                    setMensagem('Erro ao carregar turmas: ' + error.message);
                } finally {
                    setCarregando(false);
                }
            }
        }
        carregarTurmas();
    }, [selectedMateria]);

    // Carrega alunos quando turma é selecionada
    useEffect(() => {
        async function carregarAlunos() {
            if (selectedTurma) {
                try {
                    setCarregando(true);
                    const res = await fetch('http://localhost:3000/alunos');
                    const data = await res.json();
                    
                    const presencasIniciais = {};
                    data.forEach(aluno => {
                        presencasIniciais[aluno.id] = true; // Usar aluno.id em vez de numProtocolo
                    });
                    
                    setAlunos(data);
                    setPresencas(presencasIniciais);
                } catch (error) {
                    setMensagem('Erro ao carregar alunos: ' + error.message);
                } finally {
                    setCarregando(false);
                }
            }
        }
        carregarAlunos();
    }, [selectedTurma]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedMateria || !selectedTurma) {
            setMensagem('Selecione uma matéria e uma turma');
            return;
        }

        try {
            setCarregando(true);
            
            const alunosPresentes = alunos.map(aluno => ({
                alunoId: aluno.id, // Alterado de numProtocolo para id
                presente: presencas[aluno.id] || false
            }));

            const response = await fetch('http://localhost:3000/presencas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    materiaId: selectedMateria,
                    turmaId: selectedTurma,
                    alunos: alunosPresentes
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar presenças');
            }

            setMensagem('Presenças registradas com sucesso!');
            setTimeout(() => navigate('/relatorioPresenca'), 2000);
            
        } catch (error) {
            setMensagem('Erro: ' + error.message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <PaginaGeral>
            <h2 className="text-center mb-4">Cadastro de Presenças</h2>
            
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
                                onChange={(e) => setSelectedMateria(e.target.value)}
                                disabled={carregando}
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
                                onChange={(e) => {
                                    setSelectedTurma(e.target.value);
                                    setAlunos([]);
                                }}
                                disabled={carregando || !selectedMateria}
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

                {carregando && alunos.length === 0 && selectedTurma && (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Carregando alunos...</p>
                    </div>
                )}

                {alunos.length > 0 && (
                    <>
                        <h4 className="mt-4 mb-3">Lista de Alunos</h4>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Aluno</th>
                                    <th>Presente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunos.map(aluno => (
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

                <div className="d-flex justify-content-between mt-4">
                    <Button as={Link} to="/relatorioPresenca" variant="secondary">
                        Voltar
                    </Button>
                    
                    <Button 
                        type="submit" 
                        variant="primary"
                        disabled={carregando || alunos.length === 0}
                    >
                        {carregando ? (
                            <>
                                <Spinner animation="border" size="sm" /> Salvando...
                            </>
                        ) : (
                            'Salvar Presenças'
                        )}
                    </Button>
                </div>
            </Form>
        </PaginaGeral>
    );
}