import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectLogIn = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectLogIn;
