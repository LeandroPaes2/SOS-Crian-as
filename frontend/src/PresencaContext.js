import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const PresencasContext = createContext();

// Provedor de contexto
export const PresencasProvider = ({ children }) => {
    const [listaDePresencas, setListaDePresencas] = useState([]);

    return (
        <EventosContext.Provider value={{ listaDePresencas, setListaDePresencas }}>
            {children}
        </EventosContext.Provider>
    );
};

// Hook para consumir o contexto
export const usePresencas = () => useContext(PresencasContext);