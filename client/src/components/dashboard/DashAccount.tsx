import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
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
import { updateToken } from "../../redux/user/userSlice";
import { updateAccount } from "../../utils/userUtils";

interface IForm {
    nickname: string;
    email: string;
}

const DashAccount = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({ resolver: yupResolver<IForm>(editAccountSchema) });

    const [data, setData] = useState<IForm | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleValid = async (formData: IForm) => {
        const signData: IForm = {
            nickname: formData.nickname,
            email: formData.email,
        };
        setData(signData);
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        if (data != null) {
            try {
                setLoading(true);
                updateAccount(currentUser?._id!, data.nickname, data.email)
                    .then((msg) => {
                        if (msg?.response.status == 200) {
                            dispatch(updateToken(msg?.data));
                            setLoading(false);
                            setErrMsg(null);
                            alert("User Account updated Successfully");
                        } else {
                            setErrMsg(msg?.data);
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        setErrMsg(err);
                        setLoading(false);
                    });
            } catch (err) {}
        }
    }, [data]);

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(handleValid)}>
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
                    {errors?.nickname?.message && (
                        <Alert
                            className="mt-3 font-semibold"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errors.nickname.message}
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
                    {errors?.email?.message && (
                        <Alert
                            className="mt-3 font-semibold"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errors.email.message}
                        </Alert>
                    )}
                </SignInputValue>

                <Button
                    gradientDuoTone={"purpleToBlue"}
                    outline
                    type="submit"
                    className="mt-4"
                    disabled={loading}
                >
                    <SignInputBtn>Edit Profile</SignInputBtn>
                </Button>

                {errMsg && (
                    <Alert
                        className="mt-3 font-semibold"
                        color={"failure"}
                        icon={HiInformationCircle}
                    >
                        {errMsg}
                    </Alert>
                )}
            </div>
        </form>
    );
};

export default DashAccount;
