import { Link } from "react-router-dom";
import { IPost } from "../../utils/interface";
import { Button } from "flowbite-react";
import { getTimeDiff } from "../../utils/utils";
import { SignInputValue } from "../../styles/components/sign.style";

const PostCard = ({ post, isPost }: { post: IPost; isPost: boolean }) => {
    // TODO : postCard의 설정값이 실제 브라우저에서 적용 안되는 오류 해결하기
    // TODO : page[home, search] 에서 postCard의 가로 세로 길이 설정하기

    return (
        <div
            className={`group relative w-full border border-teal-500 hover:border-2 ${
                isPost ? "h-[410px]" : null
            } overflow-hidden rounded-lg ${
                isPost ? "sm:w-[360px]" : null
            } transition-all`}
        >
            <Link to={`/post/${post._id}`}>
                <img
                    src={post.image}
                    alt={post.title}
                    className={`${
                        isPost ? "h-[230px]" : null
                    } w-full object-cover ${
                        isPost ? "group-hover:h-[170px]" : null
                    } transition-all duration-300 z-20`}
                />
            </Link>

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
                        <span className="font-bold mr-2 pb-1 text-2xl truncate">
                            {post.userId
                                ? post.userId.nickname
                                : "Deleted Account"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-semibold">•</span>
                    <span className="text-gray-500 font-semibold">
                        {getTimeDiff(post.createdAt)}
                    </span>
                </div>
            </div>

            <div className="px-3 pt-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold pb-1 line-clamp-1">
                        &nbsp;{post.title}
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

            <Link
                to={`/post/${post._id}`}
                className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
            >
                <SignInputValue>Go to Post</SignInputValue>
            </Link>
        </div>
    );
};

export default PostCard;
