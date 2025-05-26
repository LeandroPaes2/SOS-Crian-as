import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
    const [funcionario, setFuncionario] = useState(null);
    const [isLogado, setIsLogado] = useState(false);
    const [loading, setLoading] = useState(true);  // novo estado loading

    useEffect(() => {
        const armazenado =
            localStorage.getItem("funcionario") || sessionStorage.getItem("funcionario");
        if (armazenado) {
            const funcionarioObj = JSON.parse(armazenado);
            setFuncionario(funcionarioObj);
            setIsLogado(true);
        }
        setLoading(false);  // terminou o carregamento
    }, []);

    const login = (funcionario, manterConectado) => {
        if (manterConectado) {
            localStorage.setItem("funcionario", JSON.stringify(funcionario));
            localStorage.setItem("token", funcionario.token);
        } else {
            sessionStorage.setItem("funcionario", JSON.stringify(funcionario));
            sessionStorage.setItem("token", funcionario.token);
        }
        setIsLogado(true);
        setFuncionario(funcionario);
    };

    const logout = () => {
        setFuncionario(null);
        setIsLogado(false);
        localStorage.removeItem("funcionario");
        sessionStorage.removeItem("funcionario");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    };

    const atualizarFuncionario = (dadosAtualizados) => {
        setFuncionario(dadosAtualizados);
        if (localStorage.getItem("funcionario")) {
            localStorage.setItem("funcionario", JSON.stringify(dadosAtualizados));
            localStorage.setItem("token", dadosAtualizados.token);  // corrigido para não usar JSON.stringify no token
        } else if (sessionStorage.getItem("funcionario")) {
            sessionStorage.setItem("funcionario", JSON.stringify(dadosAtualizados));
            sessionStorage.setItem("token", dadosAtualizados.token);
        }
    };

    const getToken = () => {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
    };

    return (
        <LoginContext.Provider value={{ funcionario, isLogado, loading, setIsLogado, login, logout, atualizarFuncionario, getToken }}>
            {children}
        </LoginContext.Provider>
    );
};
