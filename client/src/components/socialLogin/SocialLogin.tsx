import { Accordion } from "flowbite-react";
import GoogleLogin from "./GoogleLogin";
import GitHubLogin from "./GitHubLogin";
import KakaoLogin from "./KakaoLogin";
import NaverLogin from "./NaverLogin";

const SocialLogin = () => {
    return (
        <Accordion className="mx-10 border-black border-2" collapseAll>
            <Accordion.Panel>
                <Accordion.Title className="flex justify-center h-10 font-semibold">
                    Social LogIn
                </Accordion.Title>
                <Accordion.Content>
                    <div className="flex flex-col gap-3">
                        <GoogleLogin />
                        <hr />
                        <GitHubLogin />
                        <hr />
                        <KakaoLogin />
                        <hr />
                        <NaverLogin />
                    </div>
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
    );
};

export default SocialLogin;
