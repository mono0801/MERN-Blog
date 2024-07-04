import { useEffect, useState } from "react";
import { IPost } from "../utils/interface";

import { getPostList } from "../utils/postUtils";
import { Link } from "react-router-dom";

const Home = () => {
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [lastMonthTotal, setLastMonthTotal] = useState<number | null>(null);
    const [showMore, setShowMore] = useState<boolean>(true);

    useEffect(() => {
        getPostList().then((msg) => {
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
    }, []);

    const handleShowMore = () => {
        const startIndex = userPosts.length;

        getPostList(`?startIndex=${startIndex}`).then((msg) => {
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

    return (
        <div>
            <div className="flex justify-around my-3 pb-2 border-b-2 border-gray-500">
                <p>Totla : {total}</p>
                <p>LastMonth : {lastMonthTotal}</p>
            </div>

            <div className="flex flex-col justify-center gap-2 mb-4">
                {userPosts
                    ? userPosts.map((post) => (
                          <Link
                              to={`/post/${post._id}`}
                              key={post._id}
                              className="hover:underline"
                          >
                              <p className="line-clamp-1">{post.title}</p>
                          </Link>
                      ))
                    : null}
            </div>

            {showMore && (
                <button
                    onClick={handleShowMore}
                    className="w-full text-teal-500 self-center text-medium py-7"
                >
                    show more
                </button>
            )}
        </div>
    );
};

export default Home;
