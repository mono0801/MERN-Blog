import { Link } from "react-router-dom";
import { LogoSpan } from "../styles/components/header.style";
import { Alert, Button, TextInput } from "flowbite-react";
import {
    BlogDescriptSpan,
    SignInputBtn,
    SignInputValue,
} from "../styles/components/sign.style";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import styled from "styled-components";
import { HiInformationCircle } from "react-icons/hi";
import { emailSchema } from "./yup";
import { generateRandomString, sendReissuePassword } from "../utils/utils";

const JoinLabel = styled.label``;

interface IEmail {
    email: string;
}

const ForgotPassword = () => {
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IEmail>({ resolver: yupResolver<IEmail>(emailSchema) });

    const handleValid = async (formData: IEmail) => {
        const newPassword = generateRandomString(12);

        const res = await fetch("/api/auth/reissue", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: newPassword,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            sendReissuePassword(formData.email, newPassword);
        } else {
            setErrMsg(data.message);
        }

        return alert(data.message);
    };

    return (
        <div className="min-h-screen mt-20 dark:text-white">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* Left Side */}
                <div className="flex-1">
                    <Link to={"/"} className="sm:text-4xl font-bold">
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg text-white">
                            Sellen's
                        </span>
                        <LogoSpan>Blog</LogoSpan>
                    </Link>

                    <BlogDescriptSpan>
                        This is MERN Stack Blog clone coding.
                        <br />
                        You can reissue Password.
                    </BlogDescriptSpan>
                </div>

                {/* Right Side */}
                <div className="flex-1">
                    <form
                        method="POST"
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(handleValid)}
                    >
                        <SignInputValue>
                            <JoinLabel htmlFor="email">Your E-mail</JoinLabel>
                            <TextInput
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                            />
                            {errors.email?.message && (
                                <Alert
                                    className="mt-3 font-semibold"
                                    color={"failure"}
                                    icon={HiInformationCircle}
                                >
                                    {errors.email?.message}
                                </Alert>
                            )}
                        </SignInputValue>

                        <Button gradientDuoTone={"purpleToPink"} type="submit">
                            <SignInputBtn>Reissue password</SignInputBtn>
                        </Button>
                    </form>

                    {errMsg && (
                        <Alert
                            className="mt-3 font-semibold"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errMsg}
                        </Alert>
                    )}

                    <div className="flex gap-2 mt-3">
                        <span>Don't Have an Account?</span>
                        <Link
                            to="/join"
                            className="text-blue-500 font-bold hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className="flex gap-2 mt-3">
                        <span>Have an Account?</span>
                        <Link
                            to="/login"
                            className="text-blue-500 font-bold hover:underline"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
