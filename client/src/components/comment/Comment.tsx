import { IComment } from "../../utils/interface";
import { getTimeDiff } from "../../utils/utils";
import { FaThumbsUp } from "react-icons/fa";

const Comment = ({
    comment,
    handleLike,
    active,
}: {
    comment: IComment;
    handleLike: Function;
    active: boolean;
}) => {
    return (
        <div className="flex p-3 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-4">
                <img
                    src={comment.userId.profileUrl}
                    alt={comment.userId.nickname}
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
            </div>

            <div className="flex-1">
                <div className="flex items-center">
                    <span className="font-bold mr-2 pb-1 text-sm truncate">
                        {comment.userId
                            ? comment.userId.nickname
                            : "Deleted Account"}
                    </span>
                    <span className="text-gray-500 font-medium mr-1 pb-1">
                        •
                    </span>
                    <span className="text-gray-500 text-xs">
                        {getTimeDiff(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-400 pb-2">{comment.content}</p>

                <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                    <button
                        type="button"
                        onClick={() => handleLike(comment._id)}
                        className={`text-gray-400 hover:text-blue-500 ${
                            active && "!text-blue-500"
                        }`}
                    >
                        <FaThumbsUp className="text-sm" />
                    </button>
                    <p className="text-gray-400">
                        {comment.likesCount +
                            " " +
                            (comment.likesCount < 2 ? "Like" : "Likes")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comment;
