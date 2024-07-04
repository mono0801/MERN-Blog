import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import {
    HiInformationCircle,
    HiOutlineExclamationCircle,
} from "react-icons/hi";
import { RootState } from "../../redux/store";
import { IComment } from "../../utils/interface";
import { deleteComment, getCommentList } from "../../utils/commentUtils";
import Comment from "./Comment";

const CommentSection = ({ postId }: { postId: string }) => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const [query, setQuery] = useState<string>("");

    const [comment, setComment] = useState<string>("");
    const [commentList, setCommentList] = useState<IComment[]>([]);
    const [errCommentMsg, setErrCommentMsg] = useState<string | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [deletedComment, setDeletedComment] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const param = searchParams.get("commentId");

        if (param !== null) {
            setQuery(param);
        }
    }, [location.search]);

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

    const handleEdit = (comment: IComment, editedContent: string) => {
        setCommentList(
            commentList.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    };

    const handleDelete = () => {
        setShowModal(false);
        if (!currentUser || !deletedComment) {
            return;
        }
        deleteComment(currentUser._id, deletedComment).then((msg) => {
            if (!msg.response?.ok) {
                return alert(msg.data);
            } else {
                setCommentList(
                    commentList.filter(
                        (comment) => comment._id !== deletedComment
                    )
                );
                alert(msg.data);
            }
        });
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
                            currentUser={currentUser?._id}
                            admin={currentUser?.admin}
                            onEdit={handleEdit}
                            onDelete={(commentId: string) => {
                                setShowModal(true);
                                setDeletedComment(commentId);
                            }}
                            query={query}
                        />
                    ))}
                </>
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
                            Are You sure to Delete This Comment?
                        </h3>

                        <div className="flex justify-between">
                            <Button
                                color="failure"
                                onClick={handleDelete}
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

export default CommentSection;
