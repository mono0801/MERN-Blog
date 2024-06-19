import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser ? (
        <Outlet />
    ) : (
        <>
            {alert("You should Log In First")}
            <Navigate to="/login" />;
        </>
    );
};

export default PrivateRoute;
