import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

const CommentSection = ({ postId }: { postId: string }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [comment, setComment] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (comment.length > 200) {
            return alert("Comment is too Long");
        }

        const res = await fetch("/api/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: currentUser?._id,
                postId,
                content: comment,
            }),
        });
        const data = await res.json();

        if (res.ok) {
            setComment("");
            setErrMsg(null);
        } else {
            setErrMsg(data);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                    <p>Signed in as : </p>
                    <Link
                        to={"/dashboard?tab=profile"}
                        className="text-s text-cyan-600 flex gap-1 items-center"
                    >
                        <img
                            src={currentUser.profileUrl}
                            alt={currentUser.nickname}
                            className="h-7 w-7 object-cover rounded-full"
                        />
                        <p className="hover:underline">
                            @{currentUser.nickname}
                        </p>
                    </Link>
                </div>
            ) : (
                <div className="text-sm text-teal-500 my-5 flex gap-1">
                    You must Log In to Comment&nbsp;
                    <Link to={"/login"} className="text-blue-500 underline">
                        Log In
                    </Link>
                </div>
            )}

            {currentUser && (
                <form
                    onSubmit={handleSubmit}
                    className="border border-teal-500 rounded-md p-3"
                >
                    <Textarea
                        placeholder="Add a Comment..."
                        rows={3}
                        maxLength={200}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />

                    <div className="flex justify-between items-center mt-5">
                        <p className="text-gray-500 text-sm">
                            {200 - comment.length} Characters Remaining
                        </p>
                        <Button
                            outline
                            gradientDuoTone={"purpleToBlue"}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>

                    {errMsg && (
                        <Alert
                            color="failure"
                            className="mt-5"
                            icon={HiInformationCircle}
                        >
                            {errMsg}
                        </Alert>
                    )}
                </form>
            )}
        </div>
    );
};

export default CommentSection;
