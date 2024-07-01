import { Button } from "flowbite-react";
import { SignInputValue } from "../styles/components/sign.style";

const Ad = () => {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="font-semibold flex flex-col flex-1 justify-center">
                <h2 className="text-2xl">
                    Want to Explore more about My Project?
                </h2>
                <p className="text-gray-500 my-2">
                    Chenckout these resources with GitHub Project
                </p>
                <Button
                    gradientDuoTone={"purpleToPink"}
                    className="rounded-tl-xl rounded-bl-none"
                >
                    <a href="https://github.com/mono0801" target="blank">
                        <SignInputValue>Sellen's Github Project</SignInputValue>
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src="https://miro.medium.com/v2/resize:fit:1100/1*CWFkh5z8oa6dZfn5_gkKKQ.jpeg" />
            </div>
        </div>
    );
};

export default Ad;
