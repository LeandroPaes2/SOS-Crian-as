import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import logo from '../imagens/logo.png';
import "../css/menu.css";
import { useNavigate } from 'react-router-dom';
import { useLogin } from "../../LoginContext.js";
import { IoLogOut } from "react-icons/io5";
import { useState } from "react";

export default function Menu(props) {

    const navigate = useNavigate();
    const { funcionario, logout } = useLogin();
    const [dropdownAberto, setDropdownAberto] = useState(null);

    const handleLogout = async (event) => {
        logout();
        navigate("/");
    }

    const handleMouseEnter = (menu) => {
        setDropdownAberto(menu);
    };

    const handleMouseLeave = () => {
        setDropdownAberto(null);
    };


    return (
        <>
            <Navbar className="menu-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/telaMenu">
                        <img src={logo} style={{ width: "100px" }} />
                    </Navbar.Brand>

                    <Nav>
                        {/* CADASTROS */}
                        <NavDropdown
                            title="Cadastros"
                            id="cadastros-dropdown"
                            show={dropdownAberto === "cadastros"}
                            onMouseEnter={() => handleMouseEnter("cadastros")}
                            onMouseLeave={handleMouseLeave}
                        >
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 2 || funcionario?.nivel === 4) && (
                                <NavDropdown.Item as={Link} to="/cadastroAluno">Atendidos</NavDropdown.Item>
                            )}

                            {[1, 2, 3, 4, 6].includes(funcionario?.nivel) && (
                                <NavDropdown.Item as={Link} to="/cadastroPresenca">Presença</NavDropdown.Item>
                            )}

                            {[3, 1, 5, 2].includes(funcionario?.nivel) && (
                                <>
                                    <NavDropdown.Item as={Link} to="/cadastroListaEspera">Lista de Espera</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/cadastroFuncionario">Funcionários</NavDropdown.Item>
                                </>
                            )}

                            {[1,2].includes(funcionario?.nivel) && (
                                <>
                                    <NavDropdown.Item as={Link} to="/cadastroResponsavel">Responsáveis</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/cadastroEscola">Escolas</NavDropdown.Item>
                                </>
                            )}

                            {[3, 1,2].includes(funcionario?.nivel) && (
                                <NavDropdown.Item as={Link} to="/cadastroFamilia">Famílias</NavDropdown.Item>
                            )}

                            <NavDropdown.Item as={Link} to="/cadastroMateria">Oficinas</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/cadastroHorario">Horários</NavDropdown.Item>

                            <NavDropdown.Item as={Link} to="/cadastroEvento">Eventos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/cadastroTurma">Turmas</NavDropdown.Item>
                        </NavDropdown>

                        {/* RELATÓRIOS */}
                        <NavDropdown
                            title="Relatórios"
                            id="relatorios-dropdown"
                            show={dropdownAberto === "relatorios"}
                            onMouseEnter={() => handleMouseEnter("relatorios")}
                            onMouseLeave={handleMouseLeave}
                        >
                            {[1, 2, 4].includes(funcionario?.nivel) && (
                                <NavDropdown.Item as={Link} to="/relatorioAluno">Atendidos</NavDropdown.Item>
                            )}

                            {[1, 2, 3,4, 6].includes(funcionario?.nivel) && (
                                <NavDropdown.Item as={Link} to="/relatorioPresenca">Presença</NavDropdown.Item>
                            )}

                            {[3, 1, 5, 2].includes(funcionario?.nivel) && (
                                <>
                                    <NavDropdown.Item as={Link} to="/relatorioListaEspera">Lista de Espera</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/relatorioFuncionario">Funcionários</NavDropdown.Item>
                                </>
                            )}

                            {[1,2].includes(funcionario?.nivel) && (
                                <>
                                    <NavDropdown.Item as={Link} to="/relatorioResponsavel">Responsáveis</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/relatorioEscola">Escolas</NavDropdown.Item>
                                </>
                            )}

                            {[3, 1,2].includes(funcionario?.nivel) && (
                                <NavDropdown.Item as={Link} to="/relatorioFamilia">Famílias</NavDropdown.Item>
                            )}

                            {/* Relatórios comuns a todos os níveis */}
                            <NavDropdown.Item as={Link} to="#">Oficinas</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="#">Horários</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="#">Eventos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="#">Turmas</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    {/* PERFIL E SAIR */}
                    <div className="ms-auto d-flex align-items-center gap-2">
                        <Button className="botaoUsuario" title="Acesse seu perfil aqui" as={Link} to="/dadosUsuario">
                            Olá, <strong>{funcionario?.nome || "Visitante"}</strong>
                        </Button>
                        <Button className="botaoSair" size="sm" onClick={handleLogout}>
                            <IoLogOut /> Sair
                        </Button>
                    </div>
                </Container>
            </Navbar>
        </>
    );

}
