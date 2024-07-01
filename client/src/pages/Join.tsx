import { Link, useNavigate } from "react-router-dom";
import { LogoSpan } from "../styles/components/header.style";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import {
    BlogDescriptSpan,
    SignInputBtn,
    SignInputValue,
} from "../styles/components/sign.style";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { signSchema } from "./yup";
import { fetchJoin } from "../utils/userUtils";
import { IErrMsg, IJoin } from "../utils/interface";
import styled from "styled-components";
import { HiInformationCircle } from "react-icons/hi";
import SocialLogin from "../components/socialLogin/SocialLogin";

interface IForm extends IJoin {
    passwordConfirm: String;
}

const JoinLabel = styled.label``;

const SignUp = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({ resolver: yupResolver<IForm>(signSchema) });
    const [data, setData] = useState<IJoin | null>(null);
    const [errMsg, setErrMsg] = useState<IErrMsg>({ message: "" });
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const signData: IJoin = {
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password,
        };
        setData(signData);
    };

    // TODO E-mail 확인하는 기능 추가
    useEffect(() => {
        if (data != null) {
            setLoading(true);
            setErrMsg({ message: "" });
            fetchJoin(data)
                .then((msg) => {
                    setErrMsg(msg?.data);
                    setLoading(false);
                    if (msg?.response.ok) {
                        navigate("/login");
                    }
                })
                .catch((err) => {
                    setErrMsg(err);
                    setLoading(false);
                });
        }
    }, [data]);

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
                        You can sign up with your E-mail and Password or Social
                        Account.
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
                            <JoinLabel htmlFor="nickname">
                                Your Nickname
                            </JoinLabel>
                            <TextInput
                                {...register("nickname")}
                                id="nickname"
                                type="text"
                                placeholder="Nickname"
                                maxLength={10}
                            />
                            {errors.nickname?.message && (
                                <Alert
                                    className="mt-3 font-semibold"
                                    color={"failure"}
                                    icon={HiInformationCircle}
                                >
                                    {errors.nickname?.message}
                                </Alert>
                            )}
                        </SignInputValue>
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
                        <SignInputValue>
                            <JoinLabel htmlFor="password">
                                Your Password
                            </JoinLabel>
                            <TextInput
                                {...register("password")}
                                id="password"
                                type="password"
                                placeholder="Password"
                                maxLength={12}
                            />
                            {errors.password?.message && (
                                <Alert
                                    className="mt-3 font-semibold"
                                    color={"failure"}
                                    icon={HiInformationCircle}
                                >
                                    {errors.password?.message}
                                </Alert>
                            )}
                        </SignInputValue>
                        <SignInputValue>
                            <JoinLabel htmlFor="passwordConfirm">
                                Password Confirm
                            </JoinLabel>
                            <TextInput
                                {...register("passwordConfirm")}
                                id="passwordConfirm"
                                type="password"
                                placeholder="Password 2"
                                maxLength={12}
                            />
                            {errors.passwordConfirm?.message && (
                                <Alert
                                    className="mt-3 font-semibold"
                                    color={"failure"}
                                    icon={HiInformationCircle}
                                >
                                    {errors.passwordConfirm?.message}
                                </Alert>
                            )}
                        </SignInputValue>

                        <Button
                            gradientDuoTone={"purpleToPink"}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm"></Spinner>
                                    <SignInputBtn className="pl-3">
                                        Loading ...
                                    </SignInputBtn>
                                </>
                            ) : (
                                <SignInputBtn>Sign Up</SignInputBtn>
                            )}
                        </Button>
                        <hr />
                        <SocialLogin />
                    </form>

                    {errMsg.message != "" && (
                        <Alert
                            className="mt-3 font-semibold"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errMsg.message}
                        </Alert>
                    )}

                    <div className="flex gap-2 mt-3">
                        <span>Have an Account?</span>
                        <Link to="/login" className="text-blue-500 font-bold">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
