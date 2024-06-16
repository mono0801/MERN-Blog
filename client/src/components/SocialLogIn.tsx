import { Button } from "flowbite-react";
import { SignInputBtn } from "../styles/components/sign.style";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { IJoinSocial, fetchJoinSocial } from "../utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { logInSuccess } from "../redux/user/userSlice";

const SocialLogIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({ prompt: "select_account" });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const signData: IJoinSocial = {
                nickname: resultsFromGoogle.user.displayName!,
                email: resultsFromGoogle.user.email!,
                profileUrl: resultsFromGoogle.user.photoURL!,
            };
            fetchJoinSocial(signData)
                .then((msg) => {
                    if (msg?.response.ok) {
                        dispatch(logInSuccess(msg.data));
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone={"tealToLime"}
            outline
            onClick={handleGoogleClick}
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            <SignInputBtn>Google</SignInputBtn>
        </Button>
    );
};

export default SocialLogIn;
