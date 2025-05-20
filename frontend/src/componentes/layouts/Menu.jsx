import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from 'react-router-dom';
import { Button} from "react-bootstrap";
import logo from '../imagens/logo.png';
import "../css/menu.css";
import { useNavigate } from 'react-router-dom';
import { useLogin } from "../../LoginContext.js";

export default function Menu(props){

    const navigate = useNavigate();
    const {funcionario, logout}=useLogin();

    const handleLogout = async (event) => {
        logout();
        navigate("/");
    }

    return(
        <>
            <Navbar className='menu-navbar'>
                <Container>
                <Navbar.Brand  as={Link} to="/telaMenu" href="#home"><img src={logo} style={{width: '100px'}}/></Navbar.Brand>
                <Nav className="me-auto">
                        <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                            {funcionario?.nivel !== "3" && (
                                <>
                                    <NavDropdown.Item href="#" as={Link} to="/telaAluno" >Alunos</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/telaResponsavel" >Responsaveis</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/telaTurma">Turmas</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/telaMateria">Materias</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/telaEscola">Escolas</NavDropdown.Item>
                                    <NavDropdown.Item href="#" as={Link} to="/telaHorario">Horários</NavDropdown.Item>
                                </>
                            )}
                            {funcionario?.nivel !== "2" && (
                            <NavDropdown.Item href="#" >Funcionarios</NavDropdown.Item>
                            )}
                            <NavDropdown.Item href="#" as={Link} to="/telaEvento">Eventos</NavDropdown.Item>
                        </NavDropdown>
                    
                        <NavDropdown title="Relatórios" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Alunos</NavDropdown.Item>
                            <NavDropdown.Item href="#" as={Link} to="/relatorioResponsavel" >Responsaveis</NavDropdown.Item>
                            {funcionario?.nivel !== "2" && (
                            <NavDropdown.Item href="#action/3.1" >Funcionarios</NavDropdown.Item>
                            )}
                            <NavDropdown.Item href="#action/3.1">Turmas</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Materias</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Escolas</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Eventos</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.1">Horários</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#home">Sobre</Nav.Link>
                </Nav>
                <div className='divLogin'>
                    <Button className="botaoUsuario" title='Acesse seu perfil aqui' as={Link} to="/dadosUsuario">Olá, <strong>{funcionario?.nome || 'Visitante'}</strong></Button>
                    <Button className="botaoSair" variant="outline-light" size="sm" onClick={handleLogout}>Sair</Button>
                </div>
                </Container>
            </Navbar>
        </>
    )
}