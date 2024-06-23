import { editPasswordSchema } from "../../pages/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import {
    SignInputBtn,
    SignInputValue,
} from "../../styles/components/sign.style";
import { Alert, Button, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { updatePassword } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { updateToken } from "../../redux/user/userSlice";

interface IForm {
    currentPassword: string;
    password: string;
}

interface IPassword extends IForm {
    passwordConfirm: string;
}

const DashPassword = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IPassword>({
        resolver: yupResolver<IPassword>(editPasswordSchema),
    });

    const [data, setData] = useState<IForm | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const password: IForm = {
            currentPassword: formData.currentPassword,
            password: formData.password,
        };
        setData(password);
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        if (data != null) {
            try {
                setLoading(true);
                updatePassword(
                    currentUser?._id!,
                    data.currentPassword,
                    data.password
                )
                    .then((msg) => {
                        if (msg?.response.status == 200) {
                            dispatch(updateToken(msg?.data));
                            setLoading(false);
                            setErrMsg(null);
                            alert("User Password updated Successfully");
                            setValue("currentPassword", "");
                            setValue("password", "");
                            setValue("passwordConfirm", "");
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
                    <label htmlFor="currentPassword">
                        &nbsp; Current Password
                    </label>
                    <TextInput
                        {...register("currentPassword")}
                        id="currentPassword"
                        type="password"
                        placeholder="Current Password"
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
                    <label htmlFor="password">&nbsp; New Password</label>
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

export default DashPassword;
