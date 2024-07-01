import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { logInSuccess } from "../../redux/user/userSlice";
import { fetchKakao } from "../../utils/userUtils";
import Loading from "../../components/Loading";

const KakaoCallback = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
        fetchKakao(code)
            .then((res) => {
                dispatch(logInSuccess(res));
                navigate("/");
            })
            .catch((err) => console.log(err));
    }

    return <Loading string1={"Login Now"} string2={"Don't Reload This Page"} />;
};

export default KakaoCallback;
