import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getPostList } from "../../utils/postUtils";
import { IPost } from "../../utils/interface";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface ISelectedPost {
    id: string;
    title: string;
}

const DashPost = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<ISelectedPost | null>(
        null
    );
    const [total, setTotal] = useState<number | null>(null);
    const [lastMonthTotal, setLastMonthTotal] = useState<number | null>(null);

    useEffect(() => {
        if (!currentUser?.admin) {
            return;
        }
        getPostList(`?userId=${currentUser?._id}`).then((msg) => {
            if (msg.response?.ok) {
                setUserPosts(msg.data.postList);
                setTotal(msg.data.total);
                setLastMonthTotal(msg.data.lastMonthPostCount);

                if (msg.data.postList.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser?._id]);

    const handleShowMore = () => {
        const startIndex = userPosts.length;

        getPostList(
            `?userId=${currentUser?._id}&startIndex=${startIndex}`
        ).then((msg) => {
            if (msg.response?.ok) {
                setUserPosts((prev) => [...prev, ...msg.data.postList]);

                if (msg.data.postList.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    };

    const handleDeletePost = async () => {
        setShowModal(false);

        try {
            const res = await fetch(`/api/post/${selectedPost?.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser?._id,
                    title: selectedPost?.title,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                alert(data);
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== selectedPost?.id)
                );

                if (total) {
                    setTotal(total - 1);
                }
            }
        } catch (error) {
            console.log(error);
        }
        setSelectedPost(null);
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            <div className="flex justify-around mb-3 font-semibold">
                <span>Post : {total}</span>
                <span>Last Month : {lastMonthTotal}</span>
            </div>

            {currentUser?.admin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {userPosts.map((post) => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-semibold">
                                    <Table.Cell>
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/post/${post._id}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link
                                            to={`/post/${post._id}`}
                                            className="text-gray-900 dark:text-white"
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        {post.category.map((item) => (
                                            <p key={`${item}${post._id}`}>
                                                {item}
                                            </p>
                                        ))}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setSelectedPost({
                                                    id: post._id,
                                                    title: post.title,
                                                });
                                            }}
                                            className="text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link
                                            to={`/post/edit/${post._id}`}
                                            className="text-teal-500 hover:underline"
                                        >
                                            <span>Edit</span>
                                        </Link>
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
                <p>There is no Post Uploaded Yet!</p>
            )}

            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedPost(null);
                }}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                        <h3 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">
                            Are You sure you want to Delete This Post?
                        </h3>

                        <p className="text-medium font-semibold text-gray-500 dark:text-gray-400">
                            Title : {selectedPost?.title}
                        </p>

                        <div className="flex justify-between mt-3">
                            <Button
                                color="failure"
                                onClick={handleDeletePost}
                                className="font-semibold"
                            >
                                Yes, I'm Sure
                            </Button>
                            <Button
                                color="success"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedPost(null);
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

export default DashPost;
