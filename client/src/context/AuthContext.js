import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Vérifier la session
        axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const login = async (email, password) => {
        const res = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
        setUser(res.data.user);
    };

    const logout = async () => {
        await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
