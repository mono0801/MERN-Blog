import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getPostList } from "../../utils/postUtils";
import { IPost } from "../../utils/interface";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPost = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [lastMonthTotal, setLastMonthTotal] = useState<number | null>(null);

    useEffect(() => {
        if (!currentUser?.admin) {
            return;
        }
        getPostList(`?userId=${currentUser?._id}`).then((msg) => {
            if (msg.response?.ok) {
                setUserPosts(msg.data.postList);
                setTotal(msg.data.total);
                setLastMonthTotal(msg.data.lastMonthPostCount);
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser?._id]);

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser?.admin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {userPosts.map((post) => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-semibold">
                                    <Table.Cell>
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link to={`/post/${post._id}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link
                                            to={`/post/${post._id}`}
                                            className="text-gray-900 dark:text-white"
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>

                                    <Table.Cell>
                                        {post.category.map((item) => (
                                            <p key={`${item}${post._id}`}>
                                                {item}
                                            </p>
                                        ))}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span className="text-red-500 hover:underline cursor-pointer">
                                            Delete
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Link
                                            to={`/post/edit/${post._id}`}
                                            className="text-teal-500 hover:underline"
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </>
            ) : (
                <p>There is no Post Uploaded Yet!</p>
            )}
        </div>
    );
};

export default DashPost;
