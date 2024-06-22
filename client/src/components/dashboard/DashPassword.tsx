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
import { IErrMsg } from "../../utils/interface";

interface IForm {
    password: string;
}

interface IPassword extends IForm {
    passwordConfirm: String;
}

const DashPassword = () => {
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
    const [errMsg, setErrMsg] = useState<IErrMsg>({ message: "" });
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const newPassword: IForm = {
            password: formData.password,
        };
        setData(newPassword);
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(handleValid)}>
            <div className="flex flex-col gap-2">
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
    );
};

export default DashPassword;
