import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav>
            {user ? (
                <>
                    <span>Bienvenue, {user.pseudo}</span>
                    <button onClick={logout}>Déconnexion</button>
                </>
            ) : (
                <a href="/login">Connexion</a>
            )}
        </nav>
    );
};

export default Navbar;
