import { useState, useEffect } from 'react';
import { Table, Alert, Button, Spinner } from 'react-bootstrap';
import PaginaGeral from '../../layouts/PaginaGeral';
import { Link } from 'react-router-dom';

export default function RelatorioPresenca() {
    const [presencas, setPresencas] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(true);

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

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
    };

    return (
        <PaginaGeral>
            <h2 className="text-center mb-4">Relatório de Presenças</h2>

            {mensagem && (
                <Alert variant="danger" className="text-center">
                    {mensagem}
                </Alert>
            )}

            {carregando ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Carregando presenças...</p>
                </div>
            ) : presencas.length === 0 ? (
                <Alert variant="info" className="text-center">
                    Nenhuma presença registrada ainda
                </Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Matéria</th>
                            <th>Turma</th>
                            <th>Alunos Presentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presencas.map(presenca => (
                            <tr key={presenca.id}>
                                <td>{formatarData(presenca.dataHora)}</td>
                                <td>{presenca.materia?.nome || 'N/A'}</td>
                                <td>
                                    {presenca.turma?.cor || 'N/A'}
                                    <br />
                                </td>
                                <td>
                                    {presenca.alunosPresentes
                                        ?.filter(ap => ap.presente)
                                        .map(ap => ap.aluno?.nome || 'N/A')
                                        .join(', ') || 'Nenhum'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <div className="text-center mt-4">
                <Button as={Link} to="/cadastroPresenca" variant="primary">
                    Nova Presença
                </Button>
            </div>
        </PaginaGeral>
    );
}