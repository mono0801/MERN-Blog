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
import { logInSchema } from "./yup";
import { fetchLogIn } from "../utils/utils";
import { ILogIn } from "../utils/interface";
import styled from "styled-components";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
    errorReset,
    logInFailure,
    logInStart,
    logInSuccess,
} from "../redux/user/userSlice";
import { AppDispatch, RootState } from "../redux/store";
import SocialLogin from "../components/socialLogin/SocialLogin";

const JoinLabel = styled.label``;

const LogIn = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogIn>({ resolver: yupResolver<ILogIn>(logInSchema) });
    const [data, setData] = useState<ILogIn>({
        email: "",
        password: "",
    });
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error: errMsg } = useSelector(
        (state: RootState) => state.user
    );

    useEffect(() => {
        dispatch(errorReset());
    }, []);

    const handleValid = async (formData: ILogIn) => {
        const signData: ILogIn = {
            email: formData.email,
            password: formData.password,
        };
        setData(signData);
    };

    useEffect(() => {
        if (data.email != "" && data.password != "") {
            dispatch(logInStart());
            fetchLogIn(data)
                .then((msg) => {
                    dispatch(logInFailure(msg?.data.message));
                    if (msg?.response.ok) {
                        dispatch(logInSuccess(msg.data));
                        navigate("/");
                    }
                })
                .catch((err) => {
                    dispatch(logInFailure(err));
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
                                placeholder="******"
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
                                <SignInputBtn>Log In</SignInputBtn>
                            )}
                        </Button>

                        <hr />
                        <SocialLogin />
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
                        <Link to="/join" className="text-blue-500 font-bold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
