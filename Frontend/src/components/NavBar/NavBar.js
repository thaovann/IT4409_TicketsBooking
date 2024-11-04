import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./NavBar.css";

const NavBar = () => {
    const user = useSelector((state) => state.auth.login.currentUser);
    //const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Kiểm tra token trong localStorage để cập nhật trạng thái đăng nhập
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     setIsLoggedIn(!!token);
    //     console.log(isLoggedIn);
    // }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        //setIsLoggedIn(false);
    }
    return (
        <nav className="navbar-container">
            <Link to="/" className="navbar-home"> Home </Link>
            {user ? (
                <>
                    <p className="navbar-user">Hi, <span> {user.body?._doc?.FullName || "User"}  </span> </p>
                    <Link to="/login" className="navbar-logout" onClick={handleLogout}> Log out</Link>
                </>
            ) : (
                <>
                    <Link to="/login" className="navbar-login"> Login </Link>
                    <Link to="/register" className="navbar-register"> Register</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;