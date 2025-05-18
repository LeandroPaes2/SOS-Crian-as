import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
    const [funcionario, setFuncionario] = useState(null);

    useEffect(() => {
        const funcionarioSalvo = localStorage.getItem("funcionario");
        if (funcionarioSalvo) {
          setFuncionario(JSON.parse(funcionarioSalvo));
        }
      }, []);

    const login = (dadosFuncionario) => {
        setFuncionario(dadosFuncionario);
        localStorage.setItem("funcionario", JSON.stringify(dadosFuncionario));
    };

    const logout = () => {
        setFuncionario(null);
        localStorage.removeItem("funcionario");
    };

    return (
        <LoginContext.Provider value={{funcionario, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

