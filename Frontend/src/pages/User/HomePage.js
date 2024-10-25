import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const HomePage = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, []);

    return (
        <main className="home-container">
            <div>
                HOME PAGE
            </div>
        </main>
    )
}

export default HomePage;