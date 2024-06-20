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
import { useState } from "react";

interface IForm {
    nickname: String;
    email: String;
}

const DashProfile = () => {
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
    const [errMsg, setErrMsg] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleValid = async (formData: IForm) => {
        const signData: IForm = {
            nickname: formData.nickname,
            email: formData.email,
        };
        setData(signData);
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
                        <label htmlFor="nickname">&nbsp; Your Nickname</label>
                        <TextInput
                            {...register("nickname")}
                            id="nickname"
                            type="text"
                            placeholder="Nickname"
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
                            placeholder="Email"
                            defaultValue={currentUser?.email}
                            maxLength={10}
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
                </div>
            </form>

            <div className="text-red-500 flex justify-between mt-5 font-bold px-10">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Log Out</span>
            </div>
        </div>
    );
};

export default DashProfile;
