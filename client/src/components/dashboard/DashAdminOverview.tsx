import { useEffect, useState } from "react";
import { ICommentList, IPostList, IUserList } from "../../utils/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getUserList } from "../../utils/userUtils";
import { getPostList } from "../../utils/postUtils";
import { getDashboardComment } from "../../utils/commentUtils";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import { SignInputValue } from "../../styles/components/sign.style";

const DashAdminOverview = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [users, setUsers] = useState<IUserList | null>(null);
    const [posts, setPosts] = useState<IPostList | null>(null);
    const [comments, setComments] = useState<ICommentList | null>(null);

    useEffect(() => {
        if (!currentUser?.admin) {
            return;
        }

        getUserList("?limit=5&admin=true").then((msg) => {
            if (msg.response?.ok) {
                setUsers(msg.data);
            } else {
                console.log(msg.data);
            }
        });

        getPostList("?limit=5").then((msg) => {
            if (msg.response?.ok) {
                setPosts(msg.data);
            } else {
                console.log(msg.data);
            }
        });

        getDashboardComment("?limit=5").then((msg) => {
            if (msg.response?.ok) {
                setComments(msg.data);
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser]);

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap justify-center p-3 gap-4">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase font-semibold">
                                Total Users
                            </h3>
                            <p className="text-2xl">{users?.total}</p>
                        </div>

                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {users && users.lastMonthUserCount > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}
                            {users?.lastMonthUserCount}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase font-semibold">
                                Total posts
                            </h3>
                            <p className="text-2xl">{posts?.total}</p>
                        </div>

                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {posts && posts.lastMonthPostCount > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}

                            {posts?.lastMonthPostCount}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase font-semibold">
                                Total Comments
                            </h3>
                            <p className="text-2xl">{comments?.total}</p>
                        </div>

                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {comments && comments.lastMonthCommentsCount > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}
                            {comments?.lastMonthCommentsCount}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between py-3 px-2 text-sm font-semibold">
                        <h1 className="text-center p-2 text-lg mr-10">
                            Recent Users
                        </h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to={"/dashboard?tab=user"}>
                                <SignInputValue>See All</SignInputValue>
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable striped>
                        <Table.Head>
                            <Table.HeadCell>Profile</Table.HeadCell>
                            <Table.HeadCell>Nickname</Table.HeadCell>
                        </Table.Head>

                        {users &&
                            users.users.map((user) => (
                                <Table.Body key={user._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={user.profileUrl}
                                                alt={user.nickname}
                                                className="w-10 h-10 rounded-full bg-gray-500"
                                            />
                                        </Table.Cell>
                                        <Table.Cell className="font-semibold">
                                            {user.nickname}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between py-3 px-2 text-sm font-semibold">
                        <h1 className="text-center p-2 text-lg mr-1">
                            Recent Comments
                        </h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to={"/dashboard?tab=comments"}>
                                <SignInputValue>See All</SignInputValue>
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable striped>
                        <Table.Head>
                            <Table.HeadCell>Nickname</Table.HeadCell>
                            <Table.HeadCell>Comment</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>

                        {comments &&
                            comments.comments.map((comment) => (
                                <Table.Body
                                    key={comment._id}
                                    className="divide-y"
                                >
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="font-semibold">
                                            {comment.userId.nickname}
                                        </Table.Cell>
                                        <Table.Cell className="w-96">
                                            <p className="line-clamp-2">
                                                {comment.content}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center gap-2">
                                                <FaThumbsUp
                                                    className={`text-sm ${
                                                        comment.likesCount > 0
                                                            ? "text-blue-500"
                                                            : "text-gray-400"
                                                    }`}
                                                />
                                                {comment.likesCount}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between py-3 px-2 text-sm font-semibold">
                        <h1 className="text-center p-2 text-lg mr-1">
                            Recent Posts
                        </h1>
                        <Button outline gradientDuoTone={"purpleToPink"}>
                            <Link to={"/dashboard?tab=post"}>
                                <SignInputValue>See All</SignInputValue>
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable striped>
                        <Table.Head>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>

                        {posts &&
                            posts.postList.map((post) => (
                                <Table.Body key={post._id} className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-14 h-10 rounded-md bg-gray-500"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{post.title}</Table.Cell>
                                        <Table.Cell>
                                            {post.category
                                                .slice(0, 4)
                                                .map((item) => (
                                                    <p
                                                        key={`${item}_${post._id}`}
                                                        className="mb-1"
                                                    >
                                                        {item}
                                                    </p>
                                                ))}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashAdminOverview;
