import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { fetchGithub } from "../../utils/utils";
import { logInSuccess } from "../../redux/user/userSlice";
import Loading from "../../components/Loading";

const GithubCallback = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
        fetchGithub(code)
            .then((res) => {
                dispatch(logInSuccess(res));
                navigate("/");
            })
            .catch((err) => console.log(err));
    }

    return <Loading string1={"Login Now"} string2={"Don't Reload This Page"} />;
};

export default GithubCallback;
