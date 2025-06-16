import { useState, useEffect } from "react";
import { Container, Table, Button, Form, InputGroup, Alert } from "react-bootstrap";
import PaginaGeral from "../../layouts/PaginaGeral";
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
        ? listaDeResponsaveis.filter((responsavel) => responsavel.nome.toLowerCase().includes(pesquisaNome.toLowerCase()))
        : listaDeResponsaveis;

    return (
        <>
            <PaginaGeral>

                <p></p>
                <Alert className="alert-custom text-center mt-4 mb-4">
                    <h2 className="titulo-alert">Relatório dos Responsáveis</h2>
                </Alert>

                <Form>
                    <Form.Group className="form" controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontWeight: 400, color: 'white' }}>PESQUISE O RESPONSAVEL PELO NOME</Form.Label>
                        <InputGroup className="divInput">
                            <div>
                                <Form.Control className="formInput" type="text" placeholder="Pesquise o nome do responsavel"
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
                <Container>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>TELEFONE</th>
                                <th>EMAIL</th>
                                <th>SEXO</th>
                                <th>DATA NASCIMENTO</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                responsaveisFiltrados?.map((responsavel) => {

                                    return (
                                        <tr>
                                            <td>{responsavel.nome}</td>
                                            <td>{responsavel.telefone}</td>
                                            <td>{responsavel.email}</td>
                                            <td>{responsavel.sexo}</td>
                                            <td>{dataNova(responsavel.dtNascimento)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <Button onClick={() => editarResponsaveis(responsavel)}
                                                        variant="warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button onClick={() => {
                                                        excluirResponsavel(responsavel);
                                                    }} variant="danger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    <p>Quatidade de responsaveis cadastrados: {listaDeResponsaveis.length}</p>
                </Container>
                <div>
                <Button as={Link} to="/telaMenu" className="botaoPesquisa" variant="secondary">
                        Voltar
                    </Button>
                </div>
            </PaginaGeral>
        </>
    );
}
