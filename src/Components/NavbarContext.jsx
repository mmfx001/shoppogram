// src/Components/NavbarContext.js
import React, { createContext, useContext, useState } from 'react';

// Kontekst yaratamiz
const NavbarContext = createContext();

// Kontekstni taqdim etuvchi komponent
export const NavbarProvider = ({ children }) => {
    const [email, setEmail] = useState(null);

    return (
        <NavbarContext.Provider value={{ email, setEmail }}>
            {children}
        </NavbarContext.Provider>
    );
};

// Kontekstni o'qish uchun xook
export const useNavbar = () => {
    return useContext(NavbarContext);
};
