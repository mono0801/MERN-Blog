import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { MdDriveFolderUpload } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { logoutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";

const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get("tab");

        if (tabParam) {
            setTab(tabParam);
        }
    }, [location.search]);

    const handleLogOut = async () => {
        try {
            const res = await fetch("/auth/logout", {
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
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === "profile"}
                            icon={FaUser}
                            label={"User"}
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
                            className="font-semibold mt-2"
                            as="div"
                        >
                            Password
                        </Sidebar.Item>
                    </Link>
                    <Link to="/dashboard?tab=upload">
                        <Sidebar.Item
                            active={tab === "upload"}
                            icon={MdDriveFolderUpload}
                            className="font-semibold mt-2"
                            as="div"
                        >
                            Upload
                        </Sidebar.Item>
                    </Link>
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
