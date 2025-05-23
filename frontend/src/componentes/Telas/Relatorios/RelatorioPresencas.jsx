import { useState, useEffect } from 'react';
import { Container, Table, Alert, Button, Spinner } from 'react-bootstrap';
import PaginaGeral from '../../layouts/PaginaGeral';
import { Link, useNavigate } from 'react-router-dom';
import "../../css/telaTurma.css"

export default function RelatorioPresenca() {
    const [presencas, setPresencas] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarPresencas() {
            try {
                const resposta = await fetch('http://localhost:3000/presencas');
                
                if (!resposta.ok) {
                    throw new Error('Erro ao carregar presenças');
                }
                
                const dados = await resposta.json();
                setPresencas(dados);
                setMensagem('');
            } catch (erro) {
                setMensagem(erro.message);
            } finally {
                setCarregando(false);
            }
        }
        carregarPresencas();
    }, []);

    const excluirPresencas = async (presenca) => {
        if (window.confirm(`Deseja realmente excluir a presença de ${presenca.materia.nome}?`)) {
            if (!presenca || !presenca.id) {
                setMensagem("Erro: presença inválida!");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/presencas/${presenca.id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    setMensagem("Presença excluída com sucesso!");
                    setPresencas(presencas.filter(p => p.id !== presenca.id));
                } else {
                    setMensagem("Erro ao excluir a presença.");
                }

                setTimeout(() => {
                    setMensagem("");
                }, 3000);

            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
                setTimeout(() => {
                    setMensagem("");
                }, 3000);
            }
        }
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
                    <h2 className="text-center mb-4">Relatório de Presenças</h2>

                    {mensagem && (
                        <Alert
                            className="text-center"
                            variant={
                                mensagem.toLowerCase().includes("sucesso")
                                    ? "success"
                                    : mensagem.toLowerCase().includes("erro")
                                        ? "danger"
                                        : "warning"
                            }
                        >

                            {mensagem}
                        </Alert>
                    )}

                    {presencas.length === 0 ? (
                        <Alert variant="info">Nenhuma presença registrada</Alert>
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
                                {presencas.map(presenca => (
                                    <tr key={presenca.id}>
                                        <td>{formatarData(presenca.dataHora)}</td>
                                        <td>{presenca.materia.nome || 'N/A'}</td>
                                        <td>
                                            {presenca.turma.cor || 'N/A'}
                                            <br />
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => navigate("/cadastroPresenca", {
                                                state: {
                                                    id: presenca.id,
                                                    materia: presenca.materia,
                                                    turma: presenca.turma,
                                                    alunosPresentes: presenca.alunosPresentes
                                                }
                                            })}
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