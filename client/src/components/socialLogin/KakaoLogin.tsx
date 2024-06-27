import { Button } from "flowbite-react";
import { SignInputBtn } from "../../styles/components/sign.style";
import { RiKakaoTalkFill } from "react-icons/ri";

const KakaoLogin = () => {
    const handleKaKaoClick = async () => {
        try {
            const response = await fetch("/api/auth/kakao");
            const data = await response.json();
            document.location.href = data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone={"redToYellow"}
            onClick={handleKaKaoClick}
            outline={true}
        >
            <RiKakaoTalkFill className="w-6 h-6 mr-3" />
            <SignInputBtn>Kakao</SignInputBtn>
        </Button>
    );
};

export default KakaoLogin;
