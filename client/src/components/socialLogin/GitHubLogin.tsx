import { Button } from "flowbite-react";
import { AiFillGithub } from "react-icons/ai";
import { SignInputBtn } from "../../styles/components/sign.style";

const GitHubLogin = () => {
    const handleGitHubClick = async () => {
        try {
            const response = await fetch("/api/auth/github");
            const data = await response.json();
            document.location.href = data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button type="button" color="dark" onClick={handleGitHubClick}>
            <AiFillGithub className="w-6 h-6 mr-2" />
            <SignInputBtn>GitHub</SignInputBtn>
        </Button>
    );
};

export default GitHubLogin;
