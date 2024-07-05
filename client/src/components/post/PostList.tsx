import { Link } from "react-router-dom";
import { IPost } from "../../utils/interface";
import { Button } from "flowbite-react";
import { getTimeDiff } from "../../utils/utils";
import { SignInputValue } from "../../styles/components/sign.style";
import { MdOutlineDoubleArrow } from "react-icons/md";

const PostList = ({ post }: { post: IPost }) => {
    // TODO : 모바일에서 category의 길이 설정하기
    return (
        <div className="max-w-3xl group relative w-full border border-teal-500 hover:border-2 rounded-lg overflow-hidden flex">
            <div className="w-2/3 border-r border-teal-500 group-hover:w-1/3 transition-all duration-300">
                <Link to={`/post/${post._id}`}>
                    <img
                        src={post.image}
                        alt={post.title}
                        className="h-[310px] w-full object-cover"
                    />
                </Link>
            </div>

            <div className="flex flex-col whitespace-nowrap gap-1 w-1/3 group-hover:w-2/3 group-hover:pr-20 transition-all duration-300">
                <div className="flex pl-3 pt-3 text-sm">
                    <div className="flex-shrink-0 mr-2">
                        <img
                            src={
                                post.userId.profileUrl ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt={post.userId.nickname}
                            className="w-10 h-10 rounded-full bg-gray-200"
                        />
                    </div>

                    <div className="flex">
                        <div className="flex items-center">
                            <span className="font-bold mr-2 pb-1 text-2xl">
                                {post.userId
                                    ? post.userId.nickname
                                    : "Deleted Account"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold line-clamp-1">
                            &nbsp;{post.title}
                        </span>
                    </div>

                    <div className="flex px-3 pb-1 items-center gap-2">
                        <span className="text-gray-500 font-semibold">•</span>
                        <span className="text-gray-500 font-semibold">
                            {getTimeDiff(post.createdAt)}
                        </span>
                    </div>

                    <div className="flex flex-wrap pl gap-2 self-start">
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
                </div>
            </div>

            <Link
                to={`/post/${post._id}`}
                className="flex flex-col items-center justify-around border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white text-center py-2 rounded-r-lg m-2 z-10 bottom-0 top-0 absolute right-[-200px] group-hover:right-0 transition-all duration-300"
            >
                <div className="w-16">
                    <SignInputValue>Go</SignInputValue>
                    <SignInputValue>to</SignInputValue>
                    <SignInputValue>Post</SignInputValue>
                </div>
                <MdOutlineDoubleArrow className="text-4xl" />
            </Link>
        </div>
    );
};

export default PostList;
