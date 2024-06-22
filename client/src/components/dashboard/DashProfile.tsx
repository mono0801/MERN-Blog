import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import React, { FC, useEffect, useRef, useState } from "react";
import DashAccount from "./DashAccount";
import DashPassword from "./DashPassword";
import { app } from "../../firebase";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { Alert } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ITab {
    tab: "profile" | "password" | "upload" | "";
}

const DashProfile: FC<ITab> = ({ tab }): JSX.Element => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    const [imgFile, setImgFile] = useState<globalThis.File | null>(null);
    const [imgFileUrl, setImgFileUrl] = useState<string | null>(null);
    const imgPickerRef = useRef<HTMLInputElement | null>(null);
    const [imgUploadProgress, setImgUploadProgress] = useState<number | null>(
        null
    );
    const [imgUploadError, setImgUploadError] = useState<string | null>(null);

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
                    }
                );
            }
        );
    };

    if (imgUploadProgress == 100) {
        setTimeout(() => setImgUploadProgress(null), 450);
    }

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

            <div className="text-red-500 flex justify-between mt-5 font-bold">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Log Out</span>
            </div>
        </div>
    );
};

export default DashProfile;
