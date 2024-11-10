import { useState } from "react";
import { registerUser } from "../../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
//import "../Register/RegisterPage.css";

const RegisterPage = () => {
    const [FullName, setFullName] = useState('');
    const [IdCard, setIdCard] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Phone, setPhone] = useState('');
    const [Role, setRole] = useState(0);  // Mặc định là 0
    const [Gender, setGender] = useState(0);  // Mặc định là 0 (Nam)
    const [DoB, setDob] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            FullName: FullName,
            IdCard: IdCard,
            Email: Email,
            Password: Password,
            Phone: Phone,
            Role: Role,
            Gender: Gender,
            DoB: DoB
        };
        registerUser(newUser, dispatch, navigate);
    }

    return (
        <section className="register-container">
            <div className="register-title"> Sign up </div>
            <form onSubmit={handleRegister}>
                <label>FULL NAME</label>
                <input type="text" placeholder="Enter your full name" onChange={(e) => setFullName(e.target.value)} />
                <label>ID CARD</label>
                <input type="text" placeholder="Enter your ID CARD" onChange={(e) => setIdCard(e.target.value)} />
                <label>EMAIL</label>
                <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                <label>PASSWORD</label>
                <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <label>PHONE</label>
                <input type="text" placeholder="Enter your phone number" onChange={(e) => setPhone(e.target.value)} />
                <label>ROLE</label>
                {/* <select onChange={(e) => setRole(e.target.value)}>
                    <option value={1}>User</option>
                    <option value={2}>Admin</option>
                </select> */}
                <label>GENDER</label>
                <select onChange={(e) => setGender(e.target.value)}>
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                </select>
                <label>DATE OF BIRTH</label>
                <input type="date" onChange={(e) => setDob(e.target.value)} />
                <button type="submit"> Create account </button>
            </form>
        </section>

    );
}

export default RegisterPage;