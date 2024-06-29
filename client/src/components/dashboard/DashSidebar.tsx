import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { logoutSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { TbCategoryPlus } from "react-icons/tb";
import { HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get("tab");

        if (tabParam) {
            setTab(tabParam);
        }
    }, [location.search]);

    const handleLogOut = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = res.json();
            if (!res.ok) {
                console.log(data);
            } else {
                dispatch(logoutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={FaUser}
                            label={currentUser?.admin ? "Admin" : "User"}
                            labelColor="dark"
                            className="font-semibold"
                            as="div"
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=password">
                        <Sidebar.Item
                            active={tab === "password"}
                            icon={RiLockPasswordLine}
                            className="font-semibold"
                            as="div"
                        >
                            Password
                        </Sidebar.Item>
                    </Link>
                    {currentUser?.admin ? (
                        <>
                            <Link to="/dashboard?tab=category">
                                <Sidebar.Item
                                    active={tab === "category"}
                                    icon={TbCategoryPlus}
                                    className="font-semibold"
                                    as="div"
                                >
                                    Category
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=post">
                                <Sidebar.Item
                                    active={tab === "post"}
                                    icon={HiDocumentText}
                                    className="font-semibold"
                                    as="div"
                                >
                                    Post
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=user">
                                <Sidebar.Item
                                    active={tab === "user"}
                                    icon={HiOutlineUserGroup}
                                    className="font-semibold"
                                    as="div"
                                >
                                    User
                                </Sidebar.Item>
                            </Link>
                        </>
                    ) : null}
                    <Sidebar.Item
                        onClick={handleLogOut}
                        icon={LuLogOut}
                        className="cursor-pointer font-semibold"
                    >
                        Log Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
