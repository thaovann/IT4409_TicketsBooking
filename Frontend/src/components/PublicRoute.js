// Route này để ngăn ko cho ng dùng truy cập trang login hay register khi đã login thành công

import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const authToken = localStorage.getItem("token"); // Kiểm tra token trong localStorage
    if (authToken) {
        return <Navigate to="/" />; // Điều hướng về home nếu đã đăng nhập
    }
    return children; // Trả về component nếu chưa đăng nhập
};

export default PublicRoute;
