import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Alert, Button, TextInput } from "flowbite-react";
import {
    SignInputBtn,
    SignInputValue,
} from "../../styles/components/sign.style";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { editAccountSchema } from "../../pages/yup";
import { HiInformationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { IErrMsg } from "../../utils/interface";

interface IForm {
    nickname: String;
    email: String;
}

const DashAccount = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({ resolver: yupResolver<IForm>(editAccountSchema) });

    const [data, setData] = useState<IForm>({
        nickname: "",
        email: "",
    });
    const [errMsg, setErrMsg] = useState<IErrMsg>({ message: "" });
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const signData: IForm = {
            nickname: formData.nickname,
            email: formData.email,
        };
        setData(signData);
    };

    useEffect(() => {}, [data]);

    return (
        <form className="flex flex-col " onSubmit={handleSubmit(handleValid)}>
            <div className="flex flex-col gap-2">
                <SignInputValue>
                    <label htmlFor="nickname">&nbsp; Your Nickname</label>
                    <TextInput
                        {...register("nickname")}
                        id="nickname"
                        type="text"
                        placeholder={currentUser?.nickname}
                        defaultValue={currentUser?.nickname}
                        maxLength={10}
                        className="mt-1"
                    />
                    {errors.nickname?.message && (
                        <Alert
                            className="mt-3"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errors.nickname?.message}
                        </Alert>
                    )}
                </SignInputValue>
                <SignInputValue>
                    <label htmlFor="email">&nbsp; Your Email</label>
                    <TextInput
                        {...register("email")}
                        id="email"
                        type="text"
                        placeholder={currentUser?.email}
                        defaultValue={currentUser?.email}
                        className="mt-1"
                    />
                    {errors.email?.message && (
                        <Alert
                            className="mt-3"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errors.email?.message}
                        </Alert>
                    )}
                </SignInputValue>

                <Button
                    gradientDuoTone={"purpleToBlue"}
                    outline
                    type="submit"
                    className="mt-4"
                >
                    <SignInputBtn>Edit Profile</SignInputBtn>
                </Button>
                {errMsg.message != "" && (
                    <Alert
                        className="mt-3 font-semibold"
                        color={"failure"}
                        icon={HiInformationCircle}
                    >
                        {errMsg.message}
                    </Alert>
                )}
            </div>
        </form>
    );
};

export default DashAccount;
