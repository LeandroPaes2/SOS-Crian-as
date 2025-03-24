    // App.js
    import 'bootstrap/dist/css/bootstrap.min.css';
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import TelaGeral from './Telas/TelaGeral/telaGeral';
    import TelaCadastro from './Telas/TelaCadastro/telaCadastro';
    import './App.css'
    import {email,senha} from './Telas/TelaCadastro';
    import TelaLogin from './Telas/TelaLoginADM/TelaLogin';


    function App() {

        const [email, setEmail] = useState(email);
        const [senha, setsenha] = useState(senha);
        if( !(email && senha) )
        {
            const [email, setEmail] = useState('');
            const [senha, setsenha] = useState('');
        }

        return (
            <Router>
                <div className="app-background"> 
                    <Routes>
                        <Route path="/" element={<TelaGeral />} />
                        <Route path="/cadastro" element={<TelaCadastro />} />
                    </Routes>
                </div>
            </Router>
        );
    }

    export default App;