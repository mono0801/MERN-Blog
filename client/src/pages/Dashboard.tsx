import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashSidebar from "../components/dashboard/DashSidebar";
import DashProfile from "../components/dashboard/DashProfile";
import DashCategory from "../components/dashboard/DashCategory";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DashPost from "../components/dashboard/DashPost";

type TabType = "profile" | "password" | "post" | "users" | "category" | "";

const Dashboard = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [tab, setTab] = useState<TabType>("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get("tab");

        if (tabParam !== "" || tabParam !== null) {
            setTab(tabParam as TabType);
        }
    }, [location.search]);

    if ((tab === "category" || tab === "post") && !currentUser?.admin) {
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                {/* Sidebar */}
                <DashSidebar />
            </div>
            {/* Profile... */}
            {tab && (tab == "profile" || tab == "password") && (
                <DashProfile tab={tab} />
            )}
            {tab === "category" && <DashCategory />}
            {tab === "post" && <DashPost />}
            {tab === "users" && <p>Users</p>}
        </div>
    );
};

export default Dashboard;
