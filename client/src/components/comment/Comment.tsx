import { useState } from "react";
import { IComment } from "../../utils/interface";
import { getTimeDiff } from "../../utils/utils";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { SignInputValue } from "../../styles/components/sign.style";
import { editComment } from "../../utils/commentUtils";

const Comment = ({
    comment,
    handleLike,
    active,
    currentUser,
    admin,
    onEdit,
}: {
    comment: IComment;
    handleLike: Function;
    active: boolean;
    currentUser?: number;
    admin?: boolean;
    onEdit: Function;
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(comment.content);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = () => {
        if (!currentUser) {
            return;
        }
        editComment(currentUser, comment._id, editedContent)
            .then((msg) => {
                if (!msg.response?.ok) {
                    return alert(msg.data);
                } else {
                    setIsEditing(false);
                    onEdit(comment, editedContent);
                    alert("Comment is Changed");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="flex p-3 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-4">
                <img
                    src={
                        comment.userId.profileUrl ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
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

                {isEditing ? (
                    <>
                        <Textarea
                            className="mb-2"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 text-xs">
                            <Button
                                type="button"
                                size={"sm"}
                                gradientDuoTone={"purpleToBlue"}
                                onClick={handleSave}
                            >
                                <SignInputValue>Save</SignInputValue>
                            </Button>
                            <Button
                                type="button"
                                size={"sm"}
                                outline
                                gradientDuoTone={"purpleToBlue"}
                                onClick={() => setIsEditing(false)}
                            >
                                <SignInputValue>Cancle</SignInputValue>
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
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
                            {currentUser &&
                                (currentUser.toString() == comment.userId._id ||
                                    admin) && (
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="text-gray-400 hover:text-green-500"
                                    >
                                        Edit
                                    </button>
                                )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comment;
