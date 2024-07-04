import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IComment } from "../../utils/interface";
import { deleteComment, getDashboardComment } from "../../utils/commentUtils";
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";

interface ISelectedComment {
    id: string;
    userId: string;
    comment: string;
}

const DashUserComments = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [comments, setComments] = useState<IComment[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] =
        useState<ISelectedComment | null>(null);

    useEffect(() => {
        if (!currentUser) {
            return;
        }
        getDashboardComment(`?userId=${currentUser._id}`).then((msg) => {
            if (msg.response?.ok) {
                setComments(msg.data.comments);

                if (msg.data.comments.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser?._id]);

    const handleShowMore = () => {
        const startIndex = comments.length;

        getDashboardComment(`?startIndex=${startIndex}`).then((msg) => {
            if (msg.response?.ok) {
                setComments((prev) => [...prev, ...msg.data.comments]);

                if (msg.data.comments.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        if (
            !currentUser ||
            !selectedComment ||
            currentUser._id + "" != selectedComment.userId
        ) {
            return;
        }

        deleteComment(currentUser?._id, selectedComment?.id)
            .then((msg) => {
                if (!msg.response?.ok) {
                    console.log(msg.data);
                } else {
                    alert(msg.data);
                    setComments((prev) =>
                        prev.filter(
                            (comment) => comment._id !== selectedComment?.id
                        )
                    );
                }
            })
            .catch((error) => console.log(error));

        setSelectedComment(null);
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser && comments.length > 0 ? (
                <>
                    <Table hoverable striped className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                            <Table.HeadCell>Post</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Delete</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {comments.map((comment) => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-semibold">
                                    <Table.Cell>
                                        {new Date(
                                            comment.createdAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {new Date(
                                            comment.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>{comment.content}</Table.Cell>

                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <FaThumbsUp
                                                className={`text-sm ${
                                                    comment.likesCount > 0
                                                        ? "text-blue-500"
                                                        : "text-gray-400"
                                                }`}
                                            />
                                            {comment.likesCount}
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell className="hover:underline">
                                        <Link
                                            to={`/post/${comment.postId._id}?commentId=${comment._id}`}
                                        >
                                            {comment.postId.title.length > 25
                                                ? comment.postId.title.slice(
                                                      0,
                                                      25
                                                  ) + " ..."
                                                : comment.postId.title}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setSelectedComment({
                                                    id: comment._id,
                                                    userId: comment.userId._id,
                                                    comment: comment.content,
                                                });
                                            }}
                                            className="text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-medium py-7"
                        >
                            show more
                        </button>
                    )}
                </>
            ) : (
                <p>There is no Comment Yet!</p>
            )}

            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedComment(null);
                }}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                        <h3 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">
                            Are You sure you want to Delete This Comment?
                        </h3>

                        <p className="text-medium font-semibold text-gray-500 dark:text-gray-400">
                            Comment : {selectedComment?.comment}
                        </p>

                        <div className="flex justify-between mt-3">
                            <Button
                                color="failure"
                                onClick={handleDeleteComment}
                                className="font-semibold"
                            >
                                Yes, I'm Sure
                            </Button>
                            <Button
                                color="success"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedComment(null);
                                }}
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

export default DashUserComments;
