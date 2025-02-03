import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setUser(jwtDecode(token));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const getToken = () => {
        return localStorage.getItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, getToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
