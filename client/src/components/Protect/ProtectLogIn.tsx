import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const ProtectLogIn = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser ? (
        <>
            {alert("You should Log out First")}
            <Navigate to="/" />
        </>
    ) : (
        <Outlet />
    );
};

export default ProtectLogIn;
