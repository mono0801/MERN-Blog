import { useEffect, useState } from "react";
import { getCategory } from "../utils/postUtils";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SignInputBtn } from "../styles/components/sign.style";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { uploadPostSchema } from "./yup";
import { useForm } from "react-hook-form";
import { HiInformationCircle } from "react-icons/hi";

interface IForm {
    title: string;
    hashTags?: string;
}

const UploadPost = () => {
    const [category, setCategory] = useState<string[] | null>(null);
    const [data, setData] = useState<IForm | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IForm>({ resolver: yupResolver<IForm>(uploadPostSchema) });

    const handleValid = async (formData: IForm) => {
        setData(formData);
        console.log(formData);
    };

    useEffect(() => {
        getCategory().then((msg) => {
            if (msg?.response.status != 200) {
                setErrMsg(msg?.data);
            } else {
                const categoryArray: string[] = msg.data.map(
                    (item: { category: string }) => item.category
                );
                setCategory(categoryArray.sort());
            }
        });
    }, []);

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create New Post
            </h1>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(handleValid)}
            >
                <div className="flex flex-col gap-4 sm:flex-row justify-between font-semibold">
                    <TextInput
                        {...register("title")}
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="flex-1"
                    />
                    <Select>
                        <option value={""} disabled>
                            {"Select a Category"}
                        </option>
                        {category?.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </Select>
                </div>

                <TextInput
                    {...register("hashTags")}
                    id="hashTags"
                    type="text"
                    placeholder="HashTags - Separated by Comma or #"
                    className="flex-1 font-semibold"
                />

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput itemType="file" accept="image/*" />

                    <Button
                        type="button"
                        gradientDuoTone={"purpleToBlue"}
                        size={"sm"}
                        outline
                    >
                        Upload Image
                    </Button>
                </div>

                <ReactQuill
                    theme="snow"
                    placeholder="Write Something..."
                    className="h-96 mb-12"
                />

                <Button type="submit" gradientDuoTone={"purpleToPink"}>
                    <SignInputBtn>Publish</SignInputBtn>
                </Button>

                {errors?.title?.message && (
                    <Alert
                        className="mt-3 font-semibold"
                        color={"failure"}
                        icon={HiInformationCircle}
                    >
                        {errors.title.message}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default UploadPost;
