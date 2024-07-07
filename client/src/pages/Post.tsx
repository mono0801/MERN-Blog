import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostList } from "../utils/postUtils";
import { IPost } from "../utils/interface";
import Loading from "../components/Loading";
import { Button, Modal } from "flowbite-react";
import Ad from "../components/Ad";
import CommentSection from "../components/comment/CommentSection";
import PostCard from "../components/post/PostCard";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ISelectedPost {
    id: string;
    title: string;
}

const Post = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<IPost | null>(null);
    const [recentPost, setRecentPost] = useState<IPost[] | null>(null);
    // TODO : error 사용하기
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<ISelectedPost | null>(
        null
    );

    useEffect(() => {
        getPostList(`?postId=${id}`).then((msg) => {
            if (!msg.response?.ok) {
                setError(true);
            } else {
                setPost(msg.data.postList[0]);
                setError(false);
            }
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        getPostList(`?limit=3`).then((msg) => {
            if (!msg.response?.ok) {
                setError(true);
            } else {
                setRecentPost(msg.data.postList);
                setError(false);
            }
            setLoading(false);
        });
    }, []);

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
                setSelectedPost(null);
                alert(data);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {loading ? (
                <Loading
                    string1="Loading Post"
                    string2="Please Wait a Minute"
                />
            ) : (
                post && (
                    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                            {post.title}
                        </h1>

                        <div className="flex gap-2 self-center mt-5">
                            {post.category.map((category) => (
                                <Link
                                    to={`/search?category=${category}`}
                                    key={category}
                                >
                                    <Button color="gray" pill size={"xs"}>
                                        {category}
                                    </Button>
                                </Link>
                            ))}
                        </div>

                        <img
                            src={post.image}
                            alt={post.title}
                            className="mt-10 p-3 max-h-[600px] w-full object-cover"
                        />

                        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
                            <span className="italic">
                                Upload :{" "}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="italic">
                                Update :{" "}
                                {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div
                            className="p-3 max-w-2xl mx-auto w-full post-content border-b border-slate-500 "
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {(currentUser?.admin ||
                            post.userId._id == currentUser?._id + "") && (
                            <div className="flex justify-between p-3 font-semibold">
                                <Link
                                    to={`/post/edit/${post._id}`}
                                    className="text-teal-500 hover:underline"
                                >
                                    <span>Edit</span>
                                </Link>
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
                            </div>
                        )}

                        <div className="max-w-4xl mx-auto w-full mt-3">
                            <Ad />
                        </div>

                        <CommentSection postId={post._id} />

                        <div className="flex flex-col justify-center items-center mb-5">
                            <h1 className="text-xl mt-5">Recent Posts</h1>
                            <div className="mt-5 flex flex-wrap justify-center gap-5">
                                {recentPost &&
                                    recentPost.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            isPost={true}
                                        />
                                    ))}
                            </div>
                        </div>
                    </main>
                )
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
        </>
    );
};

export default Post;
