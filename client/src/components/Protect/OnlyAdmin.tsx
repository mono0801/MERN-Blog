import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const OnlyAdmin = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser && currentUser.admin ? <Outlet /> : <Navigate to="/" />;
};

export default OnlyAdmin;
