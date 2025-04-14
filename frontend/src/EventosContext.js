import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const EventosContext = createContext();

// Provedor de contexto
export const EventosProvider = ({ children }) => {
    const [listaDeEventos, setListaDeEventos] = useState([]);

    return (
        <EventosContext.Provider value={{ listaDeEventos, setListaDeEventos }}>
            {children}
        </EventosContext.Provider>
    );
};

// Hook para consumir o contexto
export const useEventos = () => useContext(EventosContext);
