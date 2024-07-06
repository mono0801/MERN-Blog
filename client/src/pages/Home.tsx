import { Link } from "react-router-dom";
import Ad from "../components/Ad";
import { useEffect, useState } from "react";
import { IPostList } from "../utils/interface";
import { getPostList } from "../utils/postUtils";
import PostCard from "../components/post/PostCard";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { TbLayoutGridFilled } from "react-icons/tb";
import { FaList } from "react-icons/fa";
import PostList from "../components/post/PostList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { toggleLayout } from "../redux/layout/layoutSlice";

const Home = () => {
    const { layout } = useSelector((state: RootState) => state.layout);
    const dispatch = useDispatch<AppDispatch>();
    const [posts, setPosts] = useState<IPostList | null>(null);

    useEffect(() => {
        getPostList("?limit=6").then((msg) => {
            if (msg.response?.ok) {
                setPosts(msg.data);
            } else {
                console.log(msg.data);
            }
        });
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold lg:text-6xl">
                    Welocme To my Blog
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm">
                    Here You'll find a Variety of Post & Tutorials on Topics
                    such as Web Development, Software Engineering, and
                    Programming Languages.
                </p>
                <Link
                    to={"/search"}
                    className="text-xs sm:text-sm text-teal-500 font-bold hover:underline mr-auto"
                >
                    View all Posts
                </Link>
            </div>

            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                {posts && posts.postList.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl font-semibold text-center">
                            Recent Posts
                        </h2>

                        <div className="flex justify-center items-center gap-4 ">
                            <TbLayoutGridFilled
                                onClick={() => dispatch(toggleLayout())}
                                className={`${
                                    layout
                                        ? "text-teal-500 dark:text-white"
                                        : "text-gray-600"
                                } text-3xl cursor-pointer hover:scale-125 transition-all`}
                            />
                            <FaList
                                onClick={() => dispatch(toggleLayout())}
                                className={`${
                                    layout
                                        ? "text-gray-600"
                                        : "text-teal-500 dark:text-white"
                                } text-2xl cursor-pointer hover:scale-125 transition-all`}
                            />
                        </div>

                        {layout ? (
                            <div className="flex flex-wrap gap-4 justify-center">
                                {posts.postList.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        isPost={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 justify-center items-center">
                                {posts.postList.slice(0, 4).map((post) => (
                                    <PostList key={post._id} post={post} />
                                ))}
                            </div>
                        )}

                        {posts.total > 6 && (
                            <div className="flex justify-center text-xl">
                                <IoEllipsisVerticalSharp />
                            </div>
                        )}

                        <Link
                            to={"/search"}
                            className="text-lg text-center text-teal-500 font-bold hover:underline mx-auto"
                        >
                            View all Posts
                        </Link>
                    </div>
                )}
            </div>

            <div className="p-4 mb-4 bg-blue-100 dark:bg-slate-700">
                <Ad />
            </div>
        </div>
    );
};

export default Home;
