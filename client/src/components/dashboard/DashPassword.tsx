import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { editPasswordSchema } from "../../pages/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import {
    SignInputBtn,
    SignInputValue,
} from "../../styles/components/sign.style";
import { Alert, Button, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";

interface IForm {
    password: string;
}

interface IPassword extends IForm {
    passwordConfirm: String;
}

const DashPassword = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IPassword>({
        resolver: yupResolver<IPassword>(editPasswordSchema),
    });

    const [data, setData] = useState<IForm>({
        password: "",
    });
    const [errMsg, setErrMsg] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const newPassword: IForm = {
            password: formData.password,
        };
        setData(newPassword);
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            <form
                className="flex flex-col"
                onSubmit={handleSubmit(handleValid)}
            >
                <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img
                        src={currentUser?.profileUrl}
                        alt="user"
                        className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
                    />
                </div>

                <div className="flex flex-col gap-2 px-10 mt-4">
                    <SignInputValue>
                        <label htmlFor="password">&nbsp; Your Password</label>
                        <TextInput
                            {...register("password")}
                            id="password"
                            type="password"
                            placeholder="Password"
                            maxLength={10}
                            className="mt-1"
                        />
                        {errors.password?.message && (
                            <Alert
                                className="mt-3"
                                color={"failure"}
                                icon={HiInformationCircle}
                            >
                                {errors.password?.message}
                            </Alert>
                        )}
                    </SignInputValue>
                    <SignInputValue>
                        <label htmlFor="passwordConfirm">
                            &nbsp; Password Confirm
                        </label>
                        <TextInput
                            {...register("passwordConfirm")}
                            id="passwordConfirm"
                            type="password"
                            placeholder="Password Confirm"
                            maxLength={10}
                            className="mt-1"
                        />
                        {errors.passwordConfirm?.message && (
                            <Alert
                                className="mt-3"
                                color={"failure"}
                                icon={HiInformationCircle}
                            >
                                {errors.passwordConfirm?.message}
                            </Alert>
                        )}
                    </SignInputValue>

                    <Button
                        gradientDuoTone={"purpleToBlue"}
                        outline
                        type="submit"
                        className="mt-4"
                    >
                        <SignInputBtn>Edit Password</SignInputBtn>
                    </Button>
                </div>
            </form>

            <div className="text-red-500 flex justify-between mt-5 font-bold px-10">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Log Out</span>
            </div>
        </div>
    );
};

export default DashPassword;
