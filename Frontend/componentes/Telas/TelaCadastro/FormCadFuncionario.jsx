/*
import './FormCadFuncionario.css';
import { useState, React, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { alterarFuncionario, gravarFuncionario } from '../../../servicos/servicoFuncionario';
import toast, { Toaster } from 'react-hot-toast';

export default function FormCadFuncionarios(props) {
    const [funcionario, setFuncionario] = useState(
        props.funcionarioSelecionado || { codigo: 0, nome: "", cpf: "", cargo: "", nivel: "" }
    );
    const [formValidado, setFormValidado] = useState(false);

    // Atualiza o estado quando o funcionarioSelecionado mudar
    useEffect(() => {
        setFuncionario(props.funcionarioSelecionado || { codigo: 0, nome: "", cpf: "", cargo: "", nivel: "" });
    }, [props.funcionarioSelecionado]);

    function manipularSubmissao(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                // Cadastrar o funcionário
                gravarFuncionario(funcionario)
                    .then((resultado) => {
                        if (resultado.status) {
                            props.setExibirTabela(true);
                        } else {
                            toast.error(resultado.mensagem);
                        }
                    });
            } else {
                // Editar o funcionário
                alterarFuncionario(funcionario)
                    .then((resultado) => {
                        if (resultado.status) {
                            props.setListaDeFuncionarios(
                                props.listaDeFuncionarios.map((item) =>
                                    item.codigo !== funcionario.codigo ? item : funcionario
                                )
                            );

                            // Resetar o estado para o modo de adição
                            props.setModoEdicao(false);
                            props.setFuncionarioSelecionado({ codigo: 0, nome: "", cpf: "", cargo: "", nivel: "" });

                            // Mostrar a tabela novamente
                            props.setExibirTabela(true);
                        } else {
                            toast.error(resultado.mensagem);
                        }
                    });
            }
        } else {
            setFormValidado(true);
        }
    }

    function manipularMudanca(evento) {
        const { name, value } = evento.target;
        setFuncionario((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <div className="cadastro-wrapper">
                <div className="cadastro-container">
                    <h1>Cadastro de Funcionário</h1>

                    <label>Nome</label>
                    <input type="text" placeholder="Informe o nome completo" id="nome" name="nome"
                        value={funcionario.nome} onChange={manipularMudanca} required />

                    <label>CPF</label>
                    <input type="text" placeholder="000.000.000-00" id="cpf" name="cpf"
                        value={funcionario.cpf} onChange={manipularMudanca} required />

                    <label>Cargo</label>
                    <input type="text" placeholder="Informe o cargo" id="cargo" name="cargo"
                        value={funcionario.cargo} onChange={manipularMudanca} required />

                    <label>Nível de Acesso</label>
                    <input type="text" placeholder="Informe o nível" id="nivel" name="nivel"
                        value={funcionario.nivel} onChange={manipularMudanca} required />
                    <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </div>
            </div>
        </Form>
    );
}*/



/*
import './FormCadFuncionario.css';
import { Button, Spinner, Col, Form, InputGroup,Row, Alert} from 'react-bootstrap';
import { useState, useEffect, React } from 'react';
import ESTADO from '../../../redux/estado.js';
import {useSelector, useDispatch } from 'react-redux';
import { inserirFuncionario, atualizarFuncionario } from '../../../redux/funcionarioReducer.js';

export default function FormCadFuncionarios(props) {
const [funcionario, setFuncionario] = useState(props.funcionarioSelecionado);
const [formValidado, setFormValidado] = useState(false);
const {estado,mensagem,listaDeFuncionarios}=useSelector((state)=>state.funcionario);
const [mensagemExibida, setMensagemExibida]= useState("");
const despachante = useDispatch();

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                //cadastrar o funcionario
                despachante(inserirFuncionario(funcionario));
                setMensagemExibida(mensagem);
                setTimeout(()=>{
                    setMensagemExibida("");
                    setFuncionario({
                        codigo: 0,
                        nome: "",
                        cpf:"",
                        cargo:"",
                        nivel:""
                    });
                    //props.setExibirTabela();
                },5000);
            }
            else {
                despachante(atualizarFuncionario(funcionario));
                setMensagemExibida(mensagem);
                //voltar para o modo de inclusão
                setTimeout(()=>{
                    props.setModoEdicao(false);
                    props.setFuncionarioSelecionado({
                        codigo: 0,
                        nome: "",
                        cpf:"",
                        cargo:"",
                        nivel:""
                    });
                    props.setExibirTabela(true);
                },5000);
            }
     
        }
        else {
            setFormValidado(true);
        }
        evento.preventDefault();
        evento.stopPropagation();
     
     }
     
     function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setFuncionario({ ...funcionario, [elemento]: valor });
     }
     
     
     if(estado==ESTADO.PENDENTE){
        return (
            <div>
                <Spinner animation="border" role="status"></Spinner>
                <Alert variant="primary">{ mensagem }</Alert>
            </div>
        );
     }
     else if(estado==ESTADO.ERRO){
        return(
            <div>
                <Alert variant="danger">{ mensagem }</Alert>
                <Button onClick={() => {
                            props.setExibirTabela(true);
                        }}>Voltar</Button>
            </div>
        );
     }
     else if(estado==ESTADO.OCIOSO){
        return (
            <div>
                <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                 <div className="cadastro-wrapper">
                     <div className="cadastro-container">
                         <h1>Cadastro de Funcionário</h1>
     
                         <label>Nome</label>
                         <input type="text" placeholder="Informe o nome completo" id="nome" name="nome"
                             value={funcionario.nome} onChange={manipularMudanca} required />
     
                         <label>CPF</label>
                         <input type="text" placeholder="000.000.000-00" id="cpf" name="cpf"
                             value={funcionario.cpf} onChange={manipularMudanca} required />
     
                         <label>Cargo</label>
                         <input type="text" placeholder="Informe o cargo" id="cargo" name="cargo"
                             value={funcionario.cargo} onChange={manipularMudanca} required />
     
                         <label>Nível de Acesso</label>
                         <input type="text" placeholder="Informe o nível" id="nivel" name="nivel"
                             value={funcionario.nivel} onChange={manipularMudanca} required />
                         <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                     </div>
                 </div>
             </Form>
            {
                mensagemExibida ? <Alert variant='succeess'>{mensagem}</Alert>:""
            }
            </div>
        );
     }
    
}*/

/*
import React, { useState, useEffect } from "react";
import { Button, Alert, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { inserirFuncionario, atualizarFuncionario } from "../../../redux/funcionarioReducer";
import ESTADO from "../../../redux/estado";
import './FormCadFuncionario.css';

export default function FormCadFuncionarios(props) {
    const [nome, setNome] = useState(props.funcionarioSelecionado?.nome || "");
    const [cpf, setCpf] = useState(props.funcionarioSelecionado?.cpf || "");
    const [cargo, setCargo] = useState(props.funcionarioSelecionado?.cargo || "");
    const [nivel, setNivel] = useState(props.funcionarioSelecionado?.nivel || "");
    const [mensagem, setMensagem] = useState("");
    const [formValidado, setFormValidado] = useState(false);

    const { estado, mensagem: estadoMensagem } = useSelector((state) => state.funcionario);
    const despachante = useDispatch();

    useEffect(() => {
        if (props.funcionarioSelecionado) {
            setNome(props.funcionarioSelecionado.nome);
            setCpf(props.funcionarioSelecionado.cpf);
            setCargo(props.funcionarioSelecionado.cargo);
            setNivel(props.funcionarioSelecionado.nivel);
        }
    }, [props.funcionarioSelecionado]);

    // Função para lidar com a submissão do formulário
    const manipularSubmissao = async (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                // Cadastro de novo funcionário
                const funcionario = { nome, cpf, cargo, nivel };
                try {
                    despachante(inserirFuncionario(funcionario));
                    setMensagem("Funcionário cadastrado com sucesso!");
                    limparCampos();
                } catch (error) {
                    console.error("Erro ao cadastrar:", error);
                    setMensagem("Erro ao cadastrar o funcionário.");
                }
            } else {
                // Edição de funcionário existente
                const funcionarioEditado = { ...props.funcionarioSelecionado, nome, cpf, cargo, nivel };
                try {
                    despachante(atualizarFuncionario(funcionarioEditado));
                    setMensagem("Funcionário atualizado com sucesso!");
                    limparCampos();
                } catch (error) {
                    console.error("Erro ao atualizar:", error);
                    setMensagem("Erro ao atualizar o funcionário.");
                }
            }
        } else {
            setFormValidado(true);
        }
    };

    const limparCampos = () => {
        setNome("");
        setCpf("");
        setCargo("");
        setNivel("");
        setFormValidado(false);
    };

    if (estado === ESTADO.PENDENTE) {
        return (
            <div>
                <Alert variant="info">Carregando...</Alert>
            </div>
        );
    }

    return (
                <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                 <div className="cadastro-wrapper">
                     <div className="cadastro-container">
                         <h1>Cadastro de Funcionário</h1>
     
                         <label>Nome</label>
                         <input type="text" placeholder="Informe o nome completo" id="nome" name="nome"
                             required  value={nome} onChange={(e) => setNome(e.target.value)}/>
     
                         <label>CPF</label>
                         <input type="text" placeholder="000.000.000-00" id="cpf" name="cpf"
                             value={cpf}
                             onChange={(e) => setNome(e.target.value)} required />
     
                         <label>Cargo</label>
                         <input type="text" placeholder="Informe o cargo" id="cargo" name="cargo"
                            value={cargo}
                            onChange={(e) => setNome(e.target.value)} required />
     
                         <label>Nível de Acesso</label>
                         <input type="text" placeholder="Informe o nível" id="nivel" name="nivel"
                             value={nivel}
                             onChange={(e) => setNome(e.target.value)} required />
                         <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                     </div>
                 </div>
             </Form>
    );
}*/



import React, { useState, useEffect } from "react";
import { Button, Alert, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { inserirFuncionario, atualizarFuncionario } from "../../../redux/funcionarioReducer";
import ESTADO from "../../../redux/estado";
import './FormCadFuncionario.css';

export default function FormCadFuncionarios(props) {
    const [nome, setNome] = useState(props.funcionarioSelecionado?.nome || "");
    const [cpf, setCpf] = useState(props.funcionarioSelecionado?.cpf || "");
    const [cargo, setCargo] = useState(props.funcionarioSelecionado?.cargo || "");
    const [nivel, setNivel] = useState(props.funcionarioSelecionado?.nivel || "");
    const [mensagem, setMensagem] = useState("");
    const [formValidado, setFormValidado] = useState(false);

    const { estado, mensagem: estadoMensagem } = useSelector((state) => state.funcionario);
    const despachante = useDispatch();

    useEffect(() => {
        if (props.funcionarioSelecionado) {
            setNome(props.funcionarioSelecionado.nome);
            setCpf(props.funcionarioSelecionado.cpf);
            setCargo(props.funcionarioSelecionado.cargo);
            setNivel(props.funcionarioSelecionado.nivel);
        }
    }, [props.funcionarioSelecionado]);

    // Função para lidar com a submissão do formulário
    const manipularSubmissao = async (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                // Cadastro de novo funcionário
                const funcionario = { nome, cpf, cargo, nivel };
                try {
                    despachante(inserirFuncionario(funcionario));
                    setMensagem("Funcionário cadastrado com sucesso!");
                    limparCampos();
                } catch (error) {
                    console.error("Erro ao cadastrar:", error);
                    setMensagem("Erro ao cadastrar o funcionário.");
                }
            } else {
                // Edição de funcionário existente
                const funcionarioEditado = { ...props.funcionarioSelecionado, nome, cpf, cargo, nivel };
                try {
                    despachante(atualizarFuncionario(funcionarioEditado));
                    setMensagem("Funcionário atualizado com sucesso!");
                    limparCampos();
                } catch (error) {
                    console.error("Erro ao atualizar:", error);
                    setMensagem("Erro ao atualizar o funcionário.");
                }
            }
        } else {
            setFormValidado(true);
        }
    };

    const limparCampos = () => {
        setNome("");
        setCpf("");
        setCargo("");
        setNivel("");
        setFormValidado(false);
    };

    if (estado === ESTADO.PENDENTE) {
        return (
            <div>
                <Alert variant="info">Carregando...</Alert>
            </div>
        );
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <div className="cadastro-wrapper">
                <div className="cadastro-container">
                    <h1>Cadastro de Funcionário</h1>

                    <label>Nome</label>
                    <input
                        type="text"
                        placeholder="Informe o nome completo"
                        id="nome"
                        name="nome"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <label>CPF</label>
                    <input
                        type="text"
                        placeholder="000.000.000-00"
                        id="cpf"
                        name="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />

                    <label>Cargo</label>
                    <input
                        type="text"
                        placeholder="Informe o cargo"
                        id="cargo"
                        name="cargo"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        required
                    />

                    <label>Nível de Acesso</label>
                    <input
                        type="text"
                        placeholder="Informe o nível"
                        id="nivel"
                        name="nivel"
                        value={nivel}
                        onChange={(e) => setNivel(e.target.value)}
                        required
                    />

                    <Button type="submit">{props.modoEdicao ? "Alterar" : "Confirmar"}</Button>
                </div>
            </div>
        </Form>
    );
}

