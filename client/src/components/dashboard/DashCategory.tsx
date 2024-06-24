import { Alert, Button, Modal, TextInput } from "flowbite-react";
import {
    SignInputBtn,
    SignInputValue,
} from "../../styles/components/sign.style";
import {
    HiInformationCircle,
    HiOutlineExclamationCircle,
} from "react-icons/hi";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { editCategorySchema } from "../../pages/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCategory, postCategory } from "../../utils/postUtils";

interface IForm {
    category: string;
}

const DashCategory = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IForm>({ resolver: yupResolver<IForm>(editCategorySchema) });

    const [category, setCategory] = useState<string[] | null>(null);
    const [data, setData] = useState<IForm | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectCategory, setSelectCategory] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

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

    const handleCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectCategory(event.currentTarget.textContent);
        setShowModal(true);
    };

    const handleDeleteCategory = async () => {
        setShowModal(false);
        const jsonData = {
            category: selectCategory,
        };
        const response = await fetch("/post/category", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        if (!response.ok) {
            setErrMsg(data);
        } else {
            const categoryArray: string[] = data.map(
                (item: { category: string }) => item.category
            );
            setCategory(categoryArray.sort());
            alert("Delete Category Successfully");
        }
    };

    const handleValid = async (formData: IForm) => {
        setLoading(true);
        if (
            category?.find(function (item) {
                return item === formData.category;
            })
        ) {
            setErrMsg(`${formData.category} is Exist`);
            return setLoading(false);
        } else {
            setData({ category: formData.category });
        }
        setValue("category", "");
    };

    useEffect(() => {
        if (data) {
            postCategory(data?.category).then((msg) => {
                if (msg?.response.status != 200) {
                    setErrMsg(msg?.data);
                } else {
                    const categoryArray: string[] = msg.data.map(
                        (item: { category: string }) => item.category
                    );
                    setCategory(categoryArray.sort());
                    alert("Add Category is Successfully");
                }
            });
        }
        setData(null);
        setLoading(false);
    }, [data]);

    return (
        <div className="max-w-lg mx-auto p-3 w-full px-12">
            <h1 className="my-7 text-center font-semibold text-3xl">
                - Category List -
            </h1>

            <div className="mb-4 grid grid-cols-3 gap-3">
                {category?.map((item) => (
                    <Button
                        gradientDuoTone={"purpleToBlue"}
                        outline={true}
                        className="font-semibold"
                        disabled={
                            loading ||
                            item == "JavaScript" ||
                            item == "React JS"
                        }
                        key={item}
                        onClick={handleCategory}
                    >
                        {item}
                    </Button>
                ))}
            </div>

            <hr />
            <form
                className="flex flex-col mt-4"
                onSubmit={handleSubmit(handleValid)}
            >
                <div className="flex flex-col gap-2">
                    <SignInputValue>
                        <TextInput
                            {...register("category")}
                            id="category"
                            type="text"
                            placeholder={"New Category"}
                            className="mt-1"
                        />
                        {errors?.category?.message && (
                            <Alert
                                className="mt-3 font-semibold"
                                color={"failure"}
                                icon={HiInformationCircle}
                            >
                                {errors.category.message}
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
                        <SignInputBtn>Add Category</SignInputBtn>
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

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                        <h3 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">
                            Are You sure to Delete This Category?
                        </h3>

                        <p className="text-medium mb-4 text-gray-500 dark:text-gray-400">
                            {selectCategory}
                        </p>

                        <div className="flex justify-between">
                            <Button
                                color="failure"
                                onClick={handleDeleteCategory}
                                className="font-semibold"
                            >
                                Yes, I'm Sure
                            </Button>
                            <Button
                                color="success"
                                onClick={() => setShowModal(false)}
                                className="font-semibold"
                            >
                                No, I don't Want
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashCategory;
