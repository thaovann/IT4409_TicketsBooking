import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const userRole = JSON.parse(localStorage.getItem("role"));  // lấy role người dùng tại localStorage
    if (userRole !== role) {
        return <Navigate to="/" />     // navigate về home nếu ko đủ quyền 
    }
    return children;    // trả về component nếu đủ quyền
};

export default ProtectedRoute;