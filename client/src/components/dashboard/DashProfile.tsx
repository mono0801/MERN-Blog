import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import DashAccount from "./DashAccount";
import DashPassword from "./DashPassword";
import { app } from "../../firebase";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    errorReset,
    logoutSuccess,
    updateToken,
} from "../../redux/user/userSlice";
import { updateProfile } from "../../utils/utils";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { SignInputBtn } from "../../styles/components/sign.style";

interface ITab {
    tab: "profile" | "password" | "upload" | "category" | "";
}

const DashProfile: FC<ITab> = ({ tab }): JSX.Element => {
    const { currentUser, error } = useSelector(
        (state: RootState) => state.user
    );
    const dispatch = useDispatch<AppDispatch>();

    const [imgFile, setImgFile] = useState<globalThis.File | null>(null);
    const [imgFileUrl, setImgFileUrl] = useState<string | null>(null);
    const imgPickerRef = useRef<HTMLInputElement | null>(null);
    const [imgUploadProgress, setImgUploadProgress] = useState<number | null>(
        null
    );
    const [imgUploadError, setImgUploadError] = useState<string | null>(null);
    const [profile, setProfile] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [deleteAccountBtn, setDeleteAccountBtn] = useState<boolean>(true);

    useEffect(() => {
        dispatch(errorReset());
    }, []);

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file;
        if (e.target.files) {
            file = e.target.files[0];
        }
        if (file && file.type.startsWith("image/")) {
            setImgFile(file);
            setImgFileUrl(URL.createObjectURL(file));
        } else {
            setImgUploadError(
                "You must Upload Image (File must be less than 2MB)"
            );
        }
    };

    useEffect(() => {
        if (imgFile) {
            uploadImg(imgFile);
        }
    }, [imgFile]);

    const uploadImg = async (img: File) => {
        /* service firebase.storage {
            match /b/{bucket}/o {
              match /{allPaths=**} {
                allow read;
                allow write: if
                request.resource.size < 2 * 1024 * 1024 &&
                request.resource.contentType.matches('image/.*')
              }
            }
          } */
        setImgUploadError(null);
        const storage = getStorage(app);
        const fileName = `${currentUser?.nickname}/${
            img.name
        }_${new Date().getTime()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImgUploadProgress(Number(progress.toFixed(0)));
            },
            (_error) => {
                setImgUploadError(
                    "Could not Upload Image (File must be less than 2MB)"
                );
                setImgUploadProgress(null);
                setImgFile(null);
                setImgFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadUrl: string) => {
                        setImgFileUrl(downloadUrl);
                        setProfile(downloadUrl);
                    }
                );
            }
        );
    };

    if (imgUploadProgress == 100) {
        setTimeout(() => setImgUploadProgress(null), 450);
    }
    useEffect(() => {
        if (loading) {
            return;
        }
        if (profile != null) {
            try {
                setLoading(true);
                updateProfile(currentUser?._id!, profile)
                    .then((msg) => {
                        if (msg?.response.status == 200) {
                            dispatch(updateToken(msg?.data));
                            setLoading(false);
                            setImgUploadError(null);
                            alert("User Profile updated Successfully");
                        } else {
                            setImgUploadError(msg?.data);
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        setImgUploadError(err);
                        setLoading(false);
                    });
            } catch (err) {}
        }
    }, [profile]);

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/users/delete/${currentUser?._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error: any) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleDeleteConfirm = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        if (event.target.value === currentUser?.email) {
            setDeleteAccountBtn(false);
        } else {
            setDeleteAccountBtn(true);
        }
    };

    const handleLogOut = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                dispatch(logoutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full px-12">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

            <form className="flex flex-col">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImgChange}
                    ref={imgPickerRef}
                    hidden
                />

                <div
                    className="w-32 h-32 mb-4 relative self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => imgPickerRef.current?.click()}
                >
                    {imgUploadProgress !== null &&
                        imgUploadProgress !== undefined && (
                            <CircularProgressbar
                                value={imgUploadProgress || 0}
                                text={`${imgUploadProgress}%`}
                                strokeWidth={5}
                                styles={{
                                    root: {
                                        width: "100%",
                                        height: "100%",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                    },
                                    path: {
                                        stroke: `rgba(62,152,199, ${
                                            imgUploadProgress / 100
                                        })`,
                                    },
                                }}
                            />
                        )}

                    <img
                        src={imgFileUrl || currentUser?.profileUrl}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-8 bord[lightgray] ${
                            imgUploadProgress &&
                            imgUploadProgress < 100 &&
                            "opacity-60"
                        }`}
                    />
                </div>
            </form>

            {imgUploadError && (
                <Alert className="font-semibold mb-4" color={"failure"}>
                    {imgUploadError}
                </Alert>
            )}

            {tab === "profile" && <DashAccount />}
            {tab === "password" && <DashPassword />}

            {currentUser?.admin && (
                <Link to={"/uploadpost"}>
                    <Button
                        type="button"
                        gradientDuoTone={"purpleToPink"}
                        className="w-full mt-4"
                    >
                        <SignInputBtn>Upload Post</SignInputBtn>
                    </Button>
                </Link>
            )}

            <div className="text-red-500 flex justify-between mt-5 font-bold">
                <span
                    onClick={() => {
                        setShowModal(true);
                        setDeleteAccountBtn(true);
                    }}
                    className="cursor-pointer"
                >
                    Delete Account
                </span>
                <span onClick={handleLogOut} className="cursor-pointer">
                    Log Out
                </span>
            </div>

            {error && (
                <Alert className="font-semibold mb-4" color={"failure"}>
                    {error}
                </Alert>
            )}

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
                            Are You sure you want to Delete your Account?
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Please Enter Your E-mail
                        </p>
                        <p className="mb-2 text-xs font-light text-gray-500 dark:text-gray-400">
                            {currentUser?.email}
                        </p>

                        <TextInput
                            onInput={handleDeleteConfirm}
                            id="deleteConfirm"
                            type="email"
                            placeholder={currentUser?.email}
                            required
                            className="mb-5"
                        />

                        <div className="flex justify-between">
                            <Button
                                color="failure"
                                onClick={handleDeleteUser}
                                className="font-semibold"
                                disabled={deleteAccountBtn}
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

export default DashProfile;
