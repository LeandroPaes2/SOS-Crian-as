import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Table, Row, Col } from 'react-bootstrap';
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

    // Carrega matérias e turmas ao iniciar
    useEffect(() => {
        async function carregarDados() {
            try {
                setCarregando(true);
                
                // Carrega matérias
                const resMaterias = await fetch('http://localhost:3000/materias');
                const dataMaterias = await resMaterias.json();
                setMaterias(dataMaterias);
                
                // Carrega todas as turmas
                const resTurmas = await fetch('http://localhost:3000/turmas');
                const dataTurmas = await resTurmas.json();
                setTurmas(dataTurmas);
                
            } catch (error) {
                setMensagem('Erro ao carregar dados: ' + error.message);
            } finally {
                setCarregando(false);
            }
        }
        carregarDados();
    }, []);

    // Carrega alunos quando turma é selecionada
    useEffect(() => {
        if (selectedTurma) {
            async function carregarAlunos() {
                try {
                    setCarregando(true);
                    const res = await fetch('http://localhost:3000/alunos');
                    const data = await res.json();
                    
                    const presencasIniciais = {};
                    data.forEach(aluno => {
                        presencasIniciais[aluno.numProtocolo] = true;
                    });
                    
                    setAlunos(data);
                    setPresencas(presencasIniciais);
                } catch (error) {
                    setMensagem('Erro ao carregar alunos: ' + error.message);
                } finally {
                    setCarregando(false);
                }
            }
            carregarAlunos();
        }
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
                alunoId: aluno.numProtocolo,
                presente: presencas[aluno.numProtocolo] || false
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
                <Row className="mb-3">
                    <Col md={6}>
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
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId="formTurma">
                            <Form.Label>Turma</Form.Label>
                            <Form.Select
                                value={selectedTurma}
                                onChange={(e) => {
                                    setSelectedTurma(e.target.value);
                                    setAlunos([]);
                                }}
                                disabled={carregando}
                                required
                            >
                                <option value="">Selecione uma turma</option>
                                {turmas.map(turma => (
                                    <option key={turma.id} value={turma.id}>
                                        {turma.cor} - {turma.periodo}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

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
                                    <tr key={aluno.numProtocolo}>
                                        <td>{aluno.nome}</td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={presencas[aluno.numProtocolo] || false}
                                                onChange={(e) => setPresencas({
                                                    ...presencas,
                                                    [aluno.numProtocolo]: e.target.checked
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