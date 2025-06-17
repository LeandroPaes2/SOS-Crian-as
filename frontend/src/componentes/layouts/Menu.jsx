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
            <Navbar className='menu-navbar'>
                <Container>
                    <Navbar.Brand as={Link} to="/telaMenu" href="#home"><img src={logo} style={{ width: '100px' }} /></Navbar.Brand>
                    <Nav>
                        <NavDropdown title="Cadastros" id="basic-nav-dropdown" show={dropdownAberto === "cadastros"} onMouseEnter={() => handleMouseEnter("cadastros")} onMouseLeave={handleMouseLeave}>
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 4 || funcionario?.nivel == 3) && (

                                <NavDropdown.Item href="#" as={Link} to="/cadastroAluno" >Alunos</NavDropdown.Item>

                            )}

                            {(funcionario?.nivel === 4) && (<NavDropdown.Item href="#" as={Link} to="/telaListaEspera" >Lista de Espera</NavDropdown.Item>)}

                            {(funcionario?.nivel === 6 || funcionario?.nivel === 5 || funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
                                <NavDropdown.Item href="#" >Funcionarios</NavDropdown.Item>
                            )}
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 2) && (
                                <>
                                    <NavDropdown.Item href="#" as={Link} to="/cadastroMateria">Oficinas</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/cadastroHorario">Horários</NavDropdown.Item>
                                </>
                            )}
                            {funcionario?.nivel !== 4 && (
                                <NavDropdown.Item as={Link} to="/cadastroEvento">Eventos</NavDropdown.Item>
                            )}
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 2) && (
                                <NavDropdown.Item href="#" as={Link} to="/cadastroTurma">Turmas</NavDropdown.Item>
                            )}
                            <NavDropdown.Item href="#" as={Link} to="/cadastroResponsavel" >Responsaveis</NavDropdown.Item>

                            <NavDropdown.Item href="#" as={Link} to="/cadastroEscola">Escolas</NavDropdown.Item>

                            <NavDropdown.Item href="#" as={Link} to="/cadastroFamilia">Familias</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Relatórios" id="basic-nav-dropdown" show={dropdownAberto === "relatorios"} onMouseEnter={() => handleMouseEnter("relatorios")}
                            onMouseLeave={handleMouseLeave}>
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 4 || funcionario?.nivel == 3) && (
                                <NavDropdown.Item href="#action/3.1">Alunos</NavDropdown.Item>
                            )}
                            {(funcionario?.nivel === 6 || funcionario?.nivel === 5 || funcionario?.nivel === 3 || funcionario?.nivel === 4) && (
                                <NavDropdown.Item href="#action/3.1" >Funcionarios</NavDropdown.Item>
                            )}
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 2) && (
                                <>
                                    <NavDropdown.Item href="#action/3.1">Oficinas</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.1">Horários</NavDropdown.Item>
                                </>
                            )}
                            {funcionario?.nivel !== 4 && (
                                <NavDropdown.Item href="#action/3.1">Eventos</NavDropdown.Item>
                            )}
                            {(funcionario?.nivel === 1 || funcionario?.nivel === 2) && (
                                <NavDropdown.Item href="#action/3.1">Turmas</NavDropdown.Item>
                            )}
                            <NavDropdown.Item href="#" as={Link} to="/relatorioResponsavel" >Responsaveis</NavDropdown.Item>

                            <NavDropdown.Item href="#action/3.1">Escolas</NavDropdown.Item>

                            <NavDropdown.Item href="#action/3.1">Familias</NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link href="#home">Sobre</Nav.Link> */}
                    </Nav>
                    <div className='ms-auto d-flex align-items-center gap-2'>
                        <Button className="botaoUsuario" title='Acesse seu perfil aqui' as={Link} to="/dadosUsuario">Olá, <strong>{funcionario?.nome || 'Visitante'}</strong></Button>
                        <Button className="botaoSair" size="sm" onClick={handleLogout}><IoLogOut />Sair</Button>
                    </div>
                </Container>
            </Navbar>
        </>
    )
}
