import { useEffect, useState } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PaginaGeral from '../../componentes/layouts/PaginaGeral';

export default function FormCadPresenca() {
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedTurma, setSelectedTurma] = useState('');
    const [presencas, setPresencas] = useState({});
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/materias')
            .then(res => res.json())
            .then(data => setMaterias(data));
        
        fetch('http://localhost:3000/turmas')
            .then(res => res.json())
            .then(data => setTurmas(data));
    }, []);

    useEffect(() => {
        if (selectedTurma) {
            fetch(`http://localhost:3000/alunos/turma/${selectedTurma}`)
                .then(res => res.json())
                .then(data => {
                    setAlunos(data);
                    const initial = {};
                    data.forEach(a => initial[a.numProtocolo] = true);
                    setPresencas(initial);
                });
        }
    }, [selectedTurma]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const alunosArray = Object.entries(presencas).map(([id, presente]) => ({
            alunoId: parseInt(id),
            presente
        }));

        try {
            await fetch('http://localhost:3000/presencas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    materiaId: parseInt(selectedMateria),
                    turmaId: parseInt(selectedTurma),
                    alunos: alunosArray
                })
            });
            setMensagem('Presenças registradas!');
            setTimeout(() => navigate('/relatorioPresenca'), 2000);
        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            setMensagem('Erro ao registrar!');
        }
    };

    return (
        <PaginaGeral>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Turma</Form.Label>
                {materias.length === 0 ?
                (<FormSelect>
                  <option value="">Não há materias cadastradas</option>
                </FormSelect>):
                (
                  <Form.Select
                      value={selectedMateria}
                      onChange={(e) => setSelectedMateria(e.target.value)}
                  >
                      <option value="">Selecione uma materia</option>
                      {materias.map((materia, index) => (
                      <option key={index} value={materia.nome}>
                          {materia.nome}
                      </option>
                      ))}
                  </Form.Select>
                )
                }
              </Form.Group>
                <Table>
                    <tbody>
                        {alunos.map(aluno => (
                            <tr key={aluno.numProtocolo}>
                                <td>{aluno.nome}</td>
                                <td>
                                    <Form.Check 
                                        checked={presencas[aluno.numProtocolo]}
                                        onChange={e => setPresencas({
                                            ...presencas,
                                            [aluno.numProtocolo]: e.target.checked
                                        })}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button type="submit">Salvar</Button>
            </Form>
        </PaginaGeral>
    );
}