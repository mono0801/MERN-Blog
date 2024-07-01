import { IComment } from "../../utils/interface";
import { getTimeDiff } from "../../utils/utils";

const Comment = ({ comment }: { comment: IComment }) => {
    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img
                    src={comment.userId.profileUrl}
                    alt={comment.userId.nickname}
                    className="w-10 h-10 rounded-full bg-gray-200"
                />
            </div>

            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className="font-bold mr-2 text-sm truncate">
                        {comment.userId
                            ? comment.userId.nickname
                            : "Deleted Account"}
                    </span>
                    <span className="text-gray-500 font-medium mr-1">•</span>
                    <span className="text-gray-500 text-xs">
                        {getTimeDiff(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-400 pb-2">{comment.content}</p>
            </div>
        </div>
    );
};

export default Comment;
