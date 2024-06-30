import { useEffect, useState } from "react";
import { getCategory, uploadPost } from "../utils/postUtils";
import {
    Alert,
    Button,
    FileInput,
    Select,
    Spinner,
    TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SignInputBtn } from "../styles/components/sign.style";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { uploadPostSchema } from "./yup";
import { useForm } from "react-hook-form";
import { HiInformationCircle } from "react-icons/hi";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IUpload } from "../utils/interface";
import { useNavigate } from "react-router-dom";
import { quillConfig } from "../utils/reactQuill";

interface IForm {
    title: string;
}

const UploadPost = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [category, setCategory] = useState<string[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([
        "UnCategorized",
    ]);
    const [file, setFile] = useState<File | null>(null);
    const [imgUploadProgress, setImgUploadProgress] = useState<number | null>(
        null
    );
    const [image, setImage] = useState<string | undefined>(undefined);
    const [content, setContent] = useState<string | null>(null);
    const [data, setData] = useState<IUpload | null>(null);

    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({ resolver: yupResolver<IForm>(uploadPostSchema) });

    const handleValid = async (formData: IForm) => {
        if (!content) {
            return setErrMsg("Please Input Content");
        }

        const uploadDate: IUpload = {
            title: formData.title,
            category: selectedCategory,
            image,
            content,
        };
        setData(uploadDate);
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

    const handleSeletCategory = (option: string) => {
        if (selectedCategory.length >= 1 && option == "UnCategorized") {
            return;
        }
        if (!selectedCategory.includes(option) && option != "") {
            setSelectedCategory([...selectedCategory, option]);
        }
    };

    const handleRemoveCategory = (option: string) => {
        if (selectedCategory.length == 1 && option == "UnCategorized") {
            alert("[Option: UnCategorized] is Default");
            return;
        }

        setSelectedCategory(
            selectedCategory.filter((selected) => selected !== option)
        );
    };

    useEffect(() => {
        if (selectedCategory.length == 0) {
            setSelectedCategory([...selectedCategory, "UnCategorized"]);
        } else if (
            selectedCategory.length > 1 &&
            selectedCategory.includes("UnCategorized")
        ) {
            setSelectedCategory(
                selectedCategory.filter(
                    (selected) => selected !== "UnCategorized"
                )
            );
        }
    }, [selectedCategory]);

    const handleUploadImg = async () => {
        try {
            if (!file) {
                setErrMsg("Please Select an Image");
                return;
            }
            setErrMsg(null);
            const storage = getStorage(app);
            const fileName = `post/${currentUser?.nickname}/${
                file.name
            }_${new Date().getTime()}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgUploadProgress(Number(progress.toFixed(0)));
                },
                (_error) => {
                    setErrMsg("Image Upload Failed");
                    setImgUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImgUploadProgress(null);
                            setErrMsg(null);
                            setImage(downloadURL);
                        }
                    );
                }
            );
        } catch (error) {
            setErrMsg("Image Upload Failed");
            setImgUploadProgress(null);
        }
    };

    useEffect(() => {
        if (file) {
            handleUploadImg();
        }
        return;
    }, [file]);

    useEffect(() => {
        if (data) {
            setLoading(true);
            uploadPost(data).then((msg) => {
                if (!msg.response?.ok) {
                    setErrMsg(msg?.data.message);
                    alert(msg?.data.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setErrMsg(null);
                    alert(msg?.data.message);
                    navigate(`/post/${msg.data.post._id}`);
                }
            });
        }
        setLoading(false);
    }, [data]);

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
                    <Select
                        onChange={(e) =>
                            handleSeletCategory(e.target.value as string)
                        }
                    >
                        <option value={""}>{"Select a Category"}</option>
                        {category?.map((item) => (
                            <option
                                value={item}
                                key={item}
                                disabled={
                                    selectedCategory.includes(item) ||
                                    (selectedCategory.length >= 1 &&
                                        item == "UnCategorized")
                                }
                            >
                                {item}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="flex justify-start flex-wrap gap-2">
                    {selectedCategory.map((item) => (
                        <Button
                            gradientDuoTone={"purpleToBlue"}
                            key={item}
                            // outline
                            onClick={() => handleRemoveCategory(item)}
                            className="font-semibold"
                        >
                            {item}
                        </Button>
                    ))}
                </div>

                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput
                        itemType="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFile(e.target.files ? e.target.files[0] : null)
                        }
                    />

                    <Button
                        type="button"
                        gradientDuoTone={"purpleToBlue"}
                        size={"sm"}
                        outline
                        onClick={handleUploadImg}
                        disabled={imgUploadProgress ? true : false}
                    >
                        {imgUploadProgress !== null &&
                        imgUploadProgress !== undefined ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imgUploadProgress || 0}
                                    text={`${imgUploadProgress}%`}
                                />
                            </div>
                        ) : (
                            "Upload Image"
                        )}
                    </Button>
                </div>

                {image && (
                    <img
                        src={image}
                        alt="upload"
                        className="w-full h-72 object-cover"
                    />
                )}

                <ReactQuill
                    theme="snow"
                    placeholder="Write Something..."
                    className="h-96 mb-12"
                    modules={quillConfig.modules}
                    formats={quillConfig.formats}
                    onChange={(value) => {
                        setErrMsg(null);
                        setContent(value);
                    }}
                />

                <Button
                    type="submit"
                    gradientDuoTone={"purpleToPink"}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm"></Spinner>
                            <SignInputBtn className="pl-3">
                                Uploading ...
                            </SignInputBtn>
                        </>
                    ) : (
                        <SignInputBtn>Publish</SignInputBtn>
                    )}
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
                {errMsg && (
                    <Alert
                        className="mt-3 font-semibold"
                        color={"failure"}
                        icon={HiInformationCircle}
                    >
                        {errMsg}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default UploadPost;
