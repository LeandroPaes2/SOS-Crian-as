import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
    const [funcionario, setFuncionario] = useState(null);
    const [isLogado, setIsLogado] = useState(false);

    useEffect(() => {
        const armazenado =
            localStorage.getItem("funcionario") || sessionStorage.getItem("funcionario");
        if (armazenado) {
            const funcionarioObj = JSON.parse(armazenado);
            setFuncionario(funcionarioObj);
            setIsLogado(true);
        }
    }, []);

    const login = (funcionario, manterConectado) => {
        if (manterConectado) {
            localStorage.setItem("funcionario", JSON.stringify(funcionario));
        } else {
            sessionStorage.setItem("funcionario", JSON.stringify(funcionario));
        }
        setIsLogado(true);
        setFuncionario(funcionario);
};

    const logout = () => {
        setFuncionario(null);
        setIsLogado(false);
        localStorage.removeItem("funcionario");
        sessionStorage.removeItem("funcionario");
    };

    return (
        <LoginContext.Provider value={{funcionario, isLogado, setIsLogado, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

