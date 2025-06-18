import { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Alert, Container, ButtonGroup, ToggleButton, Row, Col } from "react-bootstrap";import PaginaGeral from "../../layouts/PaginaGeral";
import { Link } from 'react-router-dom';
import FormCadResponsavel from "../Formularios/FormCadResponsavel";
import { useNavigate } from "react-router-dom";
import "../../css/alerts.css";

function dataNova(dataISO) {
    if (!dataISO || typeof dataISO !== 'string') 
        return '';
    const data = dataISO.split('T')[0]; // ou dataISO.slice(0, 10);
    const partes = data.split('-');
    if (partes.length !== 3) 
        return '';
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

export default function RelatorioResponsaveis() {

    const [listaDeResponsaveis, setListaDeResponsaveis] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [pesquisaNome, setPesquisaNome] = useState("");
    const navigate = useNavigate();
    const [editando, setEditando] = useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [ordenarPor, setOrdenarPor] = useState("nome");

    const ordenarOptions = [
        { name: 'Nome', value: 'nome' },
        { name: 'CPF', value: 'cpf' },
    ];

    useEffect(() => {
        const buscarResponsaveis = async () => {
            try {
                const response = await fetch("http://localhost:3000/responsaveis", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) throw new Error("Erro ao buscar responsaveis");

                const dados = await response.json();
                console.log("Dados recebidos do backend:", dados);
                setListaDeResponsaveis(dados); // Atualiza o estado com os dados do backend
            } catch (error) {
                console.error("Erro ao buscar responsaveis:", error);
                setMensagem("Erro ao carregar os responsaveis.");
            }
        };

        buscarResponsaveis();
    }, []);

    const excluirResponsavel = async (responsavel) => {

        if (window.confirm("Deseja realmente excluir o responsavel " + responsavel.nome + responsavel.cpf)) {
            if (!responsavel || !responsavel.cpf || !responsavel.rg || !responsavel.nome || !responsavel.telefone || !responsavel.email || !responsavel.sexo || !responsavel.dtNascimento || !responsavel.estCivil || !responsavel.conjuge || !responsavel.situTrabalho || !responsavel.escolaridade || !responsavel.rendaFamiliar || !responsavel.qtdeTrabalhadores || !responsavel.pensaoAlimenticia || !responsavel.beneficioSocial) {
                //console.log(responsavel.cpf, responsavel.nome, responsavel.telefone);
                setMensagem("Erro: responsavel inválido!");
                setTimeout(() => setMensagem(""), 5000);
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/responsaveis/" + responsavel.cpf, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`, // envia o token no cabeçalho
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    setMensagem("Responsavel excluido com sucesso!");
                    setTimeout(() => setMensagem(""), 3000);
                    setListaDeResponsaveis(listaDeResponsaveis.filter(r => r.cpf !== responsavel.cpf));
                } else {
                    setMensagem("Erro ao excluir o responsavel.");
                    setTimeout(() => setMensagem(""), 3000);
                }
            } catch (error) {
                console.error("Erro ao conectar com o backend:", error);
                setMensagem("Erro de conexão com o servidor.");
            }
        }
        window.location.reload();
    };

    const editarResponsaveis = async (responsavel) => {
        navigate("/cadastroResponsavel", {
            state: {
                cpf: responsavel.cpf,
                rg: responsavel.rg,
                nome: responsavel.nome,
                telefone: responsavel.telefone,
                email: responsavel.email,
                sexo: responsavel.sexo,
                dtNascimento: responsavel.dtNascimento.split("T")[0],
                estCivil: responsavel.estCivil,
                conjuge: responsavel.conjuge,
                situTrabalho: responsavel.situTrabalho,
                escolaridade: responsavel.escolaridade,
                rendaFamiliar: responsavel.rendaFamiliar,
                valorRenda: responsavel.valorRenda,
                qtdeTrabalhadores: responsavel.qtdeTrabalhadores,
                pensaoAlimenticia: responsavel.pensaoAlimenticia,
                valorPensao: responsavel.valorPensao,
                pagadorPensao: responsavel.pagadorPensao,
                beneficioSocial: responsavel.beneficioSocial,
                tipoBeneficio: responsavel.tipoBeneficio,
                valorBeneficio: responsavel.valorBeneficio,
                beneficiario: responsavel.beneficiario
            }
        });
    };

    const responsaveisFiltrados = pesquisaNome
  ? listaDeResponsaveis.filter((responsavel) =>
      responsavel.nome.toLowerCase().includes(pesquisaNome.toLowerCase()) ||
      responsavel.cpf.includes(pesquisaNome)
    )
  : listaDeResponsaveis;

    const responsaveisOrdenados = [...responsaveisFiltrados].sort((a, b) => {
    if (ordenarPor === "nome") {
        return a.nome.toLowerCase().localeCompare(b.nome.toLowerCase());
    } else if (ordenarPor === "cpf") {
        const cpfA = a.cpf.replace(/\D/g, "");
        const cpfB = b.cpf.replace(/\D/g, "");
        return cpfA.localeCompare(cpfB);
    }
    return 0;
    });

    return (
        <>
            <PaginaGeral>

                <div className="TelaD">
                <Container fluid className="py-4">
                    {/* Título */}
                    <div className="bg-light p-4 rounded shadow-sm mb-4">
                        <h2 className="text-center mb-0">📄 Relatório dos Responsáveis</h2>
                    </div>


                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O RESPONSAVEL PELO NOME OU CPF</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control className="formInput" type="text" placeholder="Pesquise o nome ou cpf do responsavel"
                                    value={pesquisaNome}
                                    onChange={(e) => setPesquisaNome(e.target.value)} />
                            </div>
                            <div>
                                <Button className="botaoPesquisa" variant="secondary">
                                    Pesquisar
                                </Button>
                            </div>
                        </InputGroup>
                    </Form.Group>

                    <Col md={4} sm={12}>
                                <Form.Label><strong>Ordenar por:</strong></Form.Label>
                                <ButtonGroup className="w-100">
                                    {ordenarOptions.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`ordenar-${idx}`}
                                            type="radio"
                                            variant="outline-success"
                                            name="ordenar"
                                            value={option.value}
                                            checked={ordenarPor === option.value}
                                            onChange={(e) => setOrdenarPor(e.currentTarget.value)}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Col>
                </Form>
                <br />
                {mensagem && <Alert className="mt-02 mb-02 green text-center" variant={
                    mensagem.includes("sucesso")
                        ? "success"
                        : mensagem.includes("Erro") || mensagem.includes("erro")
                            ? "danger"
                            : "warning"
                }>
                    {mensagem}
                </Alert>}
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>CPF</th>
                                <th>TELEFONE</th>
                                <th>EMAIL</th>
                                <th>SEXO</th>
                                <th>DATA NASCIMENTO</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                responsaveisOrdenados?.map((responsavel) => {

                                    return (
                                        <tr>
                                            <td>{responsavel.nome}</td>
                                            <td>{responsavel.cpf}</td>
                                            <td>{responsavel.telefone}</td>
                                            <td>{responsavel.email}</td>
                                            <td>{responsavel.sexo}</td>
                                            <td>{dataNova(responsavel.dtNascimento)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        onClick={() => editarResponsaveis(responsavel)}
                                                        variant="warning"
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => excluirResponsavel(responsavel)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de responsaveis cadastrados: {listaDeResponsaveis.length}</p>
                    </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Button as={Link} to="/telaMenu" variant="secondary">
                            ⬅️ Voltar
                        </Button>
                    </div>
                </Container>
                </div>
                
            </PaginaGeral>
        </>
    );
}
