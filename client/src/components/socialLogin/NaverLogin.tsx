import { Button } from "flowbite-react";
import { SignInputBtn } from "../../styles/components/sign.style";
import { SiNaver } from "react-icons/si";

const NaverLogin = () => {
    const handleNaverClick = async () => {
        try {
            const response = await fetch("/auth/naver");
            const data = await response.json();
            document.location.href = data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            gradientDuoTone={"greenToBlue"}
            onClick={handleNaverClick}
        >
            <SiNaver className="w-4 h-4 mr-4" />
            <SignInputBtn>Naver</SignInputBtn>
        </Button>
    );
};

export default NaverLogin;
