import { useState, useEffect } from 'react';
import { Container, Table, Alert, Button, Form} from 'react-bootstrap';
import PaginaGeral from '../../layouts/PaginaGeral';
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaTurma.css"

export default function RelatorioPresenca() {
    const [presencas, setPresencas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [filtros, setFiltros] = useState({
        materia: '',
        turma: '',
        data: ''
    });
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                // Carrega presenças
                const resPresencas = await fetch('http://localhost:3000/presencas');
                if (!resPresencas.ok) throw new Error('Erro ao carregar presenças');
                const dadosPresencas = await resPresencas.json();
                setPresencas(dadosPresencas);

                // Carrega matérias
                const resMaterias = await fetch('http://localhost:3000/materias');
                const dadosMaterias = await resMaterias.json();
                setMaterias(dadosMaterias);

                // Carrega turmas
                const resTurmas = await fetch('http://localhost:3000/turmas');
                const dadosTurmas = await resTurmas.json();
                setTurmas(dadosTurmas);

            } catch (error) {
                setMensagem(error.message);
            }
        }
        carregarDados();
    }, []);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filtrarPresencas = () => {
        return presencas.filter(presenca => {
            const dataPresenca = new Date(presenca.dataHora).toISOString().split('T')[0];
            const filtroData = filtros.data ? dataPresenca === filtros.data : true;
            
            return (
                (filtros.materia ? presenca.materia.id.toString() === filtros.materia : true) &&
                (filtros.turma ? presenca.turma.id.toString() === filtros.turma : true) &&
                filtroData
            );
        });
    };

    const excluirPresencas = async (presenca) => {
        // Mantenha a mesma função de exclusão que você já tinha
        // ...
    };

    const formatarData = (dataString) => {
        const opcoes = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
    };

    return (
        <div className="topo">
            <PaginaGeral>
                <Container className="form-container mt-4">
                    <Alert className="alert-custom text-center" variant="dark">
                        <h2 className="titulo-alert">Presenças</h2>
                    </Alert>

                    {/* Filtros */}
                    <div className="mb-4">
                        <Form>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <Form.Group controlId="filtroMateria">
                                        <Form.Label>Matéria</Form.Label>
                                        <Form.Select
                                            name="materia"
                                            value={filtros.materia}
                                            onChange={handleFiltroChange}
                                        >
                                            <option value="">Todas matérias</option>
                                            {materias.map(materia => (
                                                <option key={materia.id} value={materia.id}>
                                                    {materia.nome}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group controlId="filtroTurma">
                                        <Form.Label>Turma</Form.Label>
                                        <Form.Select
                                            name="turma"
                                            value={filtros.turma}
                                            onChange={handleFiltroChange}
                                        >
                                            <option value="">Todas turmas</option>
                                            {turmas.map(turma => (
                                                <option key={turma.id} value={turma.id}>
                                                    {turma.cor} - {turma.periodo}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-md-4">
                                    <Form.Group controlId="filtroData">
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="data"
                                            value={filtros.data}
                                            onChange={handleFiltroChange}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>

                    {/* Mantenha o restante do seu código existente */}
                    {mensagem && (
                        <Alert className="text-center" variant={
                            mensagem.toLowerCase().includes("sucesso") ? "success" :
                            mensagem.toLowerCase().includes("erro") ? "danger" : "warning"
                        }>
                            {mensagem}
                        </Alert>
                    )}

                    {filtrarPresencas().length === 0 ? (
                        <Alert variant="info">Nenhuma presença encontrada com os filtros selecionados</Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Matéria</th>
                                    <th>Turma</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarPresencas().map((presenca) => (
                                    <tr key={`${presenca.id}`}>
                                        <td>{formatarData(presenca.dataHora)}</td>
                                        <td>{presenca.materia.nome || 'N/A'}</td>
                                        <td>
                                            {presenca.turma.cor || 'N/A'}
                                            <br />
                                            {presenca.turma.periodo && `(${presenca.turma.periodo})`}
                                        </td>
                                        <td>
                                            {/* Mantenha seus botões de ação existentes */}
                                            <Button
                                                onClick={() => navigate("/cadastroPresenca", {state: {id: presenca.id, materia: presenca.materia, turma: presenca.turma, alunosPresentes: presenca.alunosPresentes, dataHora: presenca.dataHora}})}
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                title="Editar"
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                onClick={() => excluirPresencas(presenca)}
                                                variant="danger"
                                                size="sm"
                                                title="Excluir"
                                            >
                                                🗑️
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    
                    <div>
                        <Button as={Link} to="/telaPresenca" className="botaoPesquisa" variant="secondary">
                            Voltar
                        </Button>
                    </div>
                </Container>
            </PaginaGeral>
        </div>
    );
}