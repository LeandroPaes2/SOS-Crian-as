import { useState, useEffect, useMemo } from 'react';
import { Table, Alert, Container, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import PaginaGeral from '../../layouts/PaginaGeral';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RelatorioFaltas()
{
    const [faltasPorAluno, setFaltasPorAluno] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [presencas, setPresencas] = useState([]);
    const [filtroAluno, setFiltroAluno] = useState('');
    const [filtroMateria, setFiltroMateria] = useState('');
    const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 
    const [mensagem, setMensagem] = useState('');

    const processarFaltas = (alunosList, presencasList) => {
        const faltasMap = new Map();
        
        // Para cada aluno
        alunosList.forEach(aluno => {
            // Inicializar registro de faltas para o aluno
            faltasMap.set(aluno.id, {
                aluno: aluno,
                faltas: []
            });
        });

        // Para cada registro de presença
        presencasList.forEach(presenca => {
            const materiaId = presenca.materia.id;
            const data = new Date(presenca.dataHora).toLocaleDateString('pt-BR');
            
            // Para cada aluno presente/ausente
            presenca.alunosPresentes.forEach(ap => {
                if (!ap.presente) {
                    // Adicionar falta
                    const alunoId = ap.aluno.id;
                    if (faltasMap.has(alunoId)) {
                        const registro = faltasMap.get(alunoId);
                        registro.faltas.push({
                            materiaId: materiaId,
                            materiaNome: presenca.materia.nome,
                            data: data,
                            turma: presenca.turma.cor
                        });
                        faltasMap.set(alunoId, registro);
                    }
                }
            });
        });

        // Converter para array e ordenar por nome do aluno
        const faltasArray = Array.from(faltasMap.values())
            .filter(item => item.faltas.length > 0)
            .sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome));
        
        setFaltasPorAluno(faltasArray);
    };

    const faltasFiltradas = faltasPorAluno
        .filter(item =>
            (filtroAluno === '' || item.aluno.id.toString() === filtroAluno) &&
            (filtroMateria === '' ||
                item.faltas.some(f => f.materiaId.toString() === filtroMateria))
        )
        .map(item => ({
            ...item,
            faltas: item.faltas.filter(f =>
                filtroMateria === '' || f.materiaId.toString() === filtroMateria
            )
        })
    );

    const contadorFaltas = useMemo(() => {
        let totalFaltas = 0;
        let faltasNaMateria = 0;
        const detalhamento = [];
        
        // 1. Calcular totais baseado nos filtros
        faltasFiltradas.forEach(item => {
            totalFaltas += item.faltas.length;
            
            // Calcular por matéria específica se filtro de matéria estiver ativo
            if (filtroMateria) {
                const faltasMateria = item.faltas.filter(f => 
                    f.materiaId.toString() === filtroMateria
                );
                faltasNaMateria += faltasMateria.length;
            }
        });

        // 2. Preparar detalhamento por matéria para o aluno selecionado
        if (filtroAluno) {
            const alunoFaltas = faltasFiltradas.find(item => 
                item.aluno.id.toString() === filtroAluno
            );
            
            if (alunoFaltas) {
                materias.forEach(materia => {
                    const faltasNestaMateria = alunoFaltas.faltas.filter(f => 
                        f.materiaId === materia.id
                    ).length;
                    
                    if (faltasNestaMateria > 0) {
                        detalhamento.push({
                            materia: materia.nome,
                            quantidade: faltasNestaMateria
                        });
                    }
                });
            }
        } 
        // Se nenhum aluno específico estiver selecionado, mostrar para todos
        else {
            materias.forEach(materia => {
                const faltasNestaMateria = faltasFiltradas.reduce((acc, item) => {
                    return acc + item.faltas.filter(f => 
                        f.materiaId === materia.id
                    ).length;
                }, 0);
                
                if (faltasNestaMateria > 0) {
                    detalhamento.push({
                        materia: materia.nome,
                        quantidade: faltasNestaMateria
                    });
                }
            });
        }

        return {
            total: totalFaltas,
            porMateria: filtroMateria ? faltasNaMateria : 0,
            detalhado: detalhamento.sort((a, b) => b.quantidade - a.quantidade)
        };
    }, [faltasFiltradas, filtroAluno, filtroMateria, materias]);


    useEffect(() => {
        async function carregarDados() {
            try{
                const resAlunos = await fetch('http://localhost:3000/alunos', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const dadosAlunos = await resAlunos.json();
                setAlunos(dadosAlunos);

                const resMaterias = await fetch('http://localhost:3000/materias', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const dadosMaterias = await resMaterias.json();
                setMaterias(dadosMaterias);

                // Carregar presenças
                const resPresencas = await fetch('http://localhost:3000/presencas', {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const dadosPresencas = await resPresencas.json();
                setPresencas(dadosPresencas);

                // Processar faltas
                processarFaltas(dadosAlunos, dadosPresencas);
            }
            catch (error) {
                setMensagem('Erro ao carregar dados: ' + error.message);
            }
        }
        carregarDados();
    }, []);

    

    const gerarPdfEImprimir = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const titulo = "Relatório de Faltas";

        doc.text(titulo, (pageWidth - doc.getTextWidth(titulo)) / 2, 20);

        // Prepara os dados para o PDF
        const data = [];

        // Para cada aluno com faltas
        faltasFiltradas.forEach(item => {
            // Para cada falta do aluno
            item.faltas.forEach(falta => {
                data.push([
                    item.aluno.nome,
                    falta.materiaNome,
                    falta.data,
                    falta.turma
                ]);
            });
        });

        const headers = [["Aluno", "Matéria", "Data", "Turma"]];

        autoTable(doc, {
            startY: 30,
            head: headers,
            body: data,
            styles: { lineWidth: 0.2, lineColor: [0, 0, 0], textColor: 0 },
            headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
        });

        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const printWindow = window.open(pdfUrl);
        printWindow.onload = () => printWindow.print();
    };

    return (
        <div className="topo">
            <PaginaGeral>
                <Container className="form-container mt-4">
                    <Alert className="alert-custom text-center" variant="dark">
                        <h2 className="titulo-alert">Faltas</h2>
                    </Alert>
                    <div className="mb-4 p-3 border rounded bg-light">
                        <Row>
                            <Col md={4} className="text-center">
                                <div className="p-2">
                                    <h5>
                                        {filtroAluno ? 
                                            `Faltas do Aluno` : 
                                            `Total de Faltas`
                                        }
                                    </h5>
                                    <Badge pill bg="danger" className="fs-4">
                                        {contadorFaltas.total}
                                    </Badge>
                                </div>
                            </Col>
                            
                            {filtroMateria && (
                                <Col md={4} className="text-center">
                                    <div className="p-2">
                                        <h5>
                                            {filtroAluno ? 
                                                `Faltas na Oficina` : 
                                                `Faltas nesta Oficina`
                                            }
                                        </h5>
                                        <Badge pill bg="warning" className="fs-4">
                                            {contadorFaltas.porMateria}
                                        </Badge>
                                    </div>
                                </Col>
                            )}
                            
                            <Col md={filtroMateria ? 4 : 8} className="text-center">
                                <div className="p-2">
                                    <h5>
                                        {filtroAluno ? 
                                            `Oficina com Mais Faltas` : 
                                            `Oficina com Mais Faltas`
                                        }
                                    </h5>
                                    {contadorFaltas.detalhado.length > 0 ? (
                                        <div>
                                            <Badge pill bg="secondary" className="fs-6">
                                                {contadorFaltas.detalhado[0].materia}: 
                                                <span className="ms-2">{contadorFaltas.detalhado[0].quantidade}</span>
                                            </Badge>
                                        </div>
                                    ) : (
                                        <span className="text-muted">Nenhuma falta registrada</span>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        
                        {/* Lista detalhada por matéria */}
                        {contadorFaltas.detalhado.length > 0 && (
                            <div className="mt-3">
                                <h6>
                                    {filtroAluno ? 
                                        `Faltas por Oficina:` : 
                                        `Faltas por Oficina:`
                                    }
                                </h6>
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    {contadorFaltas.detalhado.map((item, index) => (
                                        <Badge 
                                            key={index} 
                                            bg={index === 0 ? "danger" : "secondary"}
                                            className="px-3 py-2"
                                        >
                                            {item.materia}: {item.quantidade}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filtros */}
                    <div className="mb-4">
                        <Form>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Form.Group controlId="filtroAluno">
                                        <Form.Label>Aluno</Form.Label>
                                        <Form.Select
                                            value={filtroAluno}
                                            onChange={(e) => setFiltroAluno(e.target.value)}
                                        >
                                            <option value="">Todos os alunos</option>
                                            {alunos.map(aluno => (
                                                <option key={aluno.id} value={aluno.id}>
                                                    {aluno.nome}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6">
                                    <Form.Group controlId="filtroMateria">
                                        <Form.Label>Oficinas</Form.Label>
                                        <Form.Select
                                            value={filtroMateria}
                                            onChange={(e) => setFiltroMateria(e.target.value)}
                                        >
                                            <option value="">Todas Oficinas</option>
                                            {materias.map(materia => (
                                                <option key={materia.id} value={materia.id}>
                                                    {materia.nome}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>

                    {mensagem && (
                        <Alert variant="danger">{mensagem}</Alert>
                    )}

                    {faltasFiltradas.length === 0 ? (
                        <Alert variant="info">Nenhuma falta encontrada com os filtros selecionados</Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Aluno</th>
                                    <th>Faltas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faltasFiltradas.map((item) => (
                                    <tr key={item.aluno.id}>
                                        <td>
                                            <strong>{item.aluno.nome}</strong>
                                            <div>Período: {item.aluno.periodoProjeto}</div>
                                        </td>
                                        <td>
                                            <Table size="sm" className="mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Oficina</th>
                                                        <th>Data</th>
                                                        <th>Turma</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.faltas.map((falta, index) => (
                                                        <tr key={index}>
                                                            <td>{falta.materiaNome}</td>
                                                            <td>{falta.data}</td>
                                                            <td>{falta.turma}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    
                    <div>
                        <Button as={Link} to="/telaMenu" variant="secondary" className="me-2">
                            Voltar
                        </Button>
                        <Button variant="primary" onClick={gerarPdfEImprimir}>
                            Imprimir
                        </Button>
                    </div>
                </Container>
            </PaginaGeral>
        </div>
    );
}