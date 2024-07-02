import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { RootState } from "../../redux/store";
import { IComment } from "../../utils/interface";
import { getCommentList } from "../../utils/commentUtils";
import Comment from "./Comment";

const CommentSection = ({ postId }: { postId: string }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [comment, setComment] = useState<string>("");
    const [commentList, setCommentList] = useState<IComment[]>([]);
    const [errCommentMsg, setErrCommentMsg] = useState<string | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCommentList(postId).then((msg) => {
            if (!msg.response?.ok) {
                setErrMsg(msg.data as string);
            } else {
                setCommentList(msg.data);
            }
        });
    }, [postId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (comment == "") {
            return alert("Please Fill The Comment");
        }
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
            setErrCommentMsg(null);
            window.location.reload();
        } else {
            setErrCommentMsg(data);
        }
    };

    const handleLike = async (commentId: string) => {
        if (!currentUser) {
            alert("Please Log in First");
            return navigate("/login");
        }
        try {
            const res = await fetch(`/api/comment/like/${commentId}`, {
                method: "PUT",
            });
            if (res.ok) {
                const data: IComment = await res.json();
                setCommentList(
                    commentList.map((comment) =>
                        comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  likesCount: data.likes.length,
                              }
                            : comment
                    )
                );
            }
        } catch (err) {
            console.log(err);
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

                    {errCommentMsg && (
                        <Alert
                            color="failure"
                            className="mt-5"
                            icon={HiInformationCircle}
                        >
                            {errCommentMsg}
                        </Alert>
                    )}
                </form>
            )}

            {errMsg ? (
                errMsg && (
                    <Alert
                        color="failure"
                        className="mt-5"
                        icon={HiInformationCircle}
                    >
                        {errMsg}
                    </Alert>
                )
            ) : commentList.length === 0 ? (
                <p className="text-sm my-5">No Comments Yet!</p>
            ) : (
                <>
                    <div className=" text-medium my-5 flex items-center gap-1">
                        <p className="mr-1">Comments</p>

                        <div className="border border-gray-400 px-2 rounded-sm">
                            <p>{commentList.length}</p>
                        </div>
                    </div>

                    {commentList.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            handleLike={handleLike}
                            active={comment.likes.includes(
                                String(currentUser?._id)
                            )}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
