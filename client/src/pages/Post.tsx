import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPostList } from "../utils/postUtils";
import { IPost } from "../utils/interface";
import Loading from "../components/Loading";
import { Button } from "flowbite-react";
import Ad from "../components/Ad";
import CommentSection from "../components/comment/CommentSection";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState<IPost | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getPostList(`?postId=${id}`).then((msg) => {
            if (!msg.response?.ok) {
                console.log(msg.data);
                setError(true);
            } else {
                setPost(msg.data.postList[0]);
                setError(false);
            }
            setLoading(false);
        });
    }, [id]);

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
                            className="p-3 max-w-2xl mx-auto w-full post-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <div className="max-w-4xl mx-auto w-full">
                            <Ad />
                        </div>

                        <CommentSection postId={post._id} />
                    </main>
                )
            )}
        </>
    );
};

export default Post;
