import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getUserList } from "../../utils/userUtils";
import { Button, Checkbox, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IUser } from "../../utils/interface";
import { FaCheck, FaTimes } from "react-icons/fa";

interface ISelectedUser {
    id: string;
    nickname: string;
}

interface IChangedUser extends ISelectedUser {
    tag: "Nickname" | "Profile";
}

const DashUsers = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [users, setUsers] = useState<IUser[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [lastMonthUsers, setLastMonthUsers] = useState<number>(0);

    const [showMore, setShowMore] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<ISelectedUser | null>(
        null
    );

    const [showChangeModal, setShowChangeModal] = useState<boolean>(false);
    const [changedUser, setChangedUser] = useState<IChangedUser | null>(null);
    const [changedUserCheck, setChangedUserCheck] = useState<boolean>(false);

    useEffect(() => {
        if (!currentUser?.admin) {
            return;
        }
        getUserList().then((msg) => {
            if (msg.response?.ok) {
                setUsers(msg.data.users);
                setTotal(msg.data.total);
                setLastMonthUsers(msg.data.lastMonthUserCount);

                if (msg.data.users.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser?._id]);

    const handleShowMore = () => {
        const startIndex = users.length;

        getUserList(`?startIndex=${startIndex}`).then((msg) => {
            if (msg.response?.ok) {
                setUsers((prev) => [...prev, ...msg.data.users]);

                if (msg.data.users.length < 9) {
                    setShowMore(false);
                }
            } else {
                console.log(msg.data);
            }
        });
    };

    const handleDeleteUser = async () => {
        setShowModal(false);

        if (selectedUser?.nickname == import.meta.env.VITE_ADMIN) {
            alert("Admin Can't be Deleted");
            setSelectedUser(null);
            return;
        }

        try {
            const res = await fetch(`/api/users/${selectedUser?.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                alert(data);
                setUsers((prev) =>
                    prev.filter((user) => user._id !== selectedUser?.id)
                );

                if (total) {
                    setTotal(total - 1);
                }
                if (lastMonthUsers && lastMonthUsers > 0) {
                    setLastMonthUsers(lastMonthUsers - 1);
                }
            }
        } catch (error) {
            console.log(error);
        }
        setSelectedUser(null);
    };

    const handleChangeUser = async () => {
        setShowChangeModal(false);
        let params;

        if (changedUser?.nickname == import.meta.env.VITE_ADMIN) {
            alert("Admin Can't be Changed");
            setChangedUser(null);
            return;
        }

        if (changedUser?.tag == "Nickname") {
            params = "nickname=true";
        } else if (changedUser?.tag == "Profile") {
            params = "profile=true";
        } else {
            return alert("Please Choose between Nickname & Profile");
        }

        try {
            const res = await fetch(`/api/users/${changedUser?.id}?${params}`, {
                method: "PUT",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                alert(data);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
        setChangedUserCheck(false);
        setChangedUser(null);
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            <div className="flex justify-around mb-3 font-semibold">
                <span>Post : {total}</span>
                <span>Last Month : {lastMonthUsers}</span>
            </div>

            {currentUser?.admin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Nickname</Table.HeadCell>
                            <Table.HeadCell>Profile</Table.HeadCell>
                            <Table.HeadCell>E-mail</Table.HeadCell>
                            <Table.HeadCell>Social Login</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Delete</span>
                            </Table.HeadCell>
                        </Table.Head>

                        {users.map((user) => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 font-semibold">
                                    <Table.Cell>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {new Date(
                                            user.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>

                                    <Table.Cell className="dark:text-white text-black ">
                                        <span
                                            onClick={() => {
                                                if (user.admin) {
                                                    return alert(
                                                        "Admin Account Can't be Changed"
                                                    );
                                                }
                                                setShowChangeModal(true);
                                                setChangedUser({
                                                    id: user._id,
                                                    nickname: user.nickname,
                                                    tag: "Nickname",
                                                });
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {user.nickname}
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <img
                                            src={user.profileUrl}
                                            alt={user.nickname}
                                            onClick={() => {
                                                if (user.admin) {
                                                    return alert(
                                                        "Admin Account Can't be Changed"
                                                    );
                                                }
                                                setShowChangeModal(true);
                                                setChangedUser({
                                                    id: user._id,
                                                    nickname: user.nickname,
                                                    tag: "Profile",
                                                });
                                            }}
                                            className="w-12 h-12 object-cover bg-gray-500 rounded-full cursor-pointer"
                                        />
                                    </Table.Cell>

                                    <Table.Cell>{user.email}</Table.Cell>

                                    <Table.Cell>
                                        {user.socialLogin ? (
                                            <FaCheck className="text-green-500 text-lg mx-auto" />
                                        ) : (
                                            <FaTimes className="text-red-500 text-lg mx-auto" />
                                        )}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {user.admin ? (
                                            <FaCheck className="text-green-500 text-lg mx-auto" />
                                        ) : (
                                            <FaTimes className="text-red-500 text-lg mx-auto" />
                                        )}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                if (user.admin) {
                                                    return alert(
                                                        "Admin Account Can't be Deleted"
                                                    );
                                                }
                                                setShowModal(true);
                                                setSelectedUser({
                                                    id: user._id,
                                                    nickname: user.nickname,
                                                });
                                            }}
                                            className="text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-medium py-7"
                        >
                            show more
                        </button>
                    )}
                </>
            ) : (
                <p>There is no User Registed Yet!</p>
            )}

            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                        <h3 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">
                            Are You sure you want to Delete This User?
                        </h3>

                        <p className="text-medium font-semibold text-gray-500 dark:text-gray-400">
                            Nickname : {selectedUser?.nickname}
                        </p>

                        <div className="flex justify-between mt-3">
                            <Button
                                color="failure"
                                onClick={handleDeleteUser}
                                className="font-semibold"
                            >
                                Yes, I'm Sure
                            </Button>
                            <Button
                                color="success"
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="font-semibold"
                            >
                                No, I don't Want
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={showChangeModal}
                onClose={() => {
                    setShowChangeModal(false);
                    setChangedUser(null);
                    setChangedUserCheck(false);
                }}
                popup
                size={"md"}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />

                        <h3 className="mb-3 text-lg font-semibold text-gray-500 dark:text-gray-400">
                            {`Are You sure you want to Change This User ${changedUser?.tag}?`}
                        </h3>

                        <p className="text-medium font-semibold text-gray-500 dark:text-gray-400 mb-3">
                            Nickname : {changedUser?.nickname}
                        </p>

                        <div className="flex justify-center items-center gap-2 text-medium font-semibold text-gray-500 dark:text-gray-400">
                            <Checkbox
                                id="accept"
                                onChange={() => {
                                    setChangedUserCheck((prev) => !prev);
                                    console.log(changedUserCheck);
                                }}
                            />
                            <label htmlFor="accept">Checked It</label>
                        </div>

                        <div className="flex justify-between mt-3">
                            <Button
                                color="failure"
                                onClick={handleChangeUser}
                                className="font-semibold"
                                disabled={!changedUserCheck}
                            >
                                Yes, I'm Sure
                            </Button>
                            <Button
                                color="success"
                                onClick={() => {
                                    setShowChangeModal(false);
                                    setChangedUser(null);
                                    setChangedUserCheck(false);
                                }}
                                className="font-semibold"
                            >
                                No, I don't Want
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashUsers;
