import { Link } from "react-router-dom";
import { LogoSpan } from "../styles/components/header.style";
import { Button, Label, TextInput } from "flowbite-react";
import { SignInputBtn, SignInputValue } from "../styles/components/sign.style";

const SignUp = () => {
    return (
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Side */}
                <div className="flex-1">
                    <Link
                        to={"/"}
                        className="sm:text-4xl font-bold dark:text-white"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg text-white">
                            Sellen's
                        </span>
                        <LogoSpan>Blog</LogoSpan>
                    </Link>

                    <p className="text-sm mt-5 font-semibold">
                        This is MERN Stack Blog clone coding.
                        <br />
                        You can sign up with your E-mail and Password or Social
                        Account.
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4">
                        <SignInputValue>
                            <Label value="Your Nickname" htmlFor="nickname" />
                            <TextInput
                                type="text"
                                placeholder="Nickname"
                                id="nickname"
                                name="nickname"
                                required
                            />
                        </SignInputValue>
                        <SignInputValue>
                            <Label value="Your E-mail" htmlFor="email" />
                            <TextInput
                                type="text"
                                placeholder="name@company.com"
                                id="email"
                                name="email"
                                required
                            />
                        </SignInputValue>
                        <SignInputValue>
                            <Label value="Your Password" htmlFor="password" />
                            <TextInput
                                type="text"
                                placeholder="Password"
                                id="password"
                                name="password"
                                required
                            />
                        </SignInputValue>

                        <Button gradientDuoTone={"purpleToPink"} type="submit">
                            <SignInputBtn>Sign Up</SignInputBtn>
                        </Button>
                    </form>

                    <div className="flex gap-2 mt-3">
                        <span>Have an Account?</span>
                        <Link to="/sign-in" className="text-blue-500 font-bold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
