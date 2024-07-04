import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashSidebar from "../components/dashboard/DashSidebar";
import DashProfile from "../components/dashboard/DashProfile";
import DashCategory from "../components/dashboard/DashCategory";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DashPost from "../components/dashboard/DashPost";
import DashUsers from "../components/dashboard/DashUsers";
import DashAdminComments from "../components/dashboard/DashAdminComments";
import DashUserComments from "../components/dashboard/DashUserComments";
import DashUserOverview from "../components/dashboard/DashUserOverview";
import DashAdminOverview from "../components/dashboard/DashAdminOverview";

type TabType =
    | "profile"
    | "password"
    | "post"
    | "user"
    | "category"
    | "comments"
    | "overview"
    | "";

const Dashboard = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const [tab, setTab] = useState<TabType>("");
    const forAdmin = ["category", "post", "user"];

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get("tab");

        if (tabParam !== "" || tabParam !== null) {
            setTab(tabParam as TabType);
        }

        if (tabParam == "" || tabParam == null) {
            navigate("/dashboard?tab=profile");
        }
    }, [location.search]);

    if (forAdmin.includes(tab) && !currentUser?.admin) {
        navigate("/");
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                {/* Sidebar */}
                <DashSidebar />
            </div>
            {/* Profile... */}
            {(tab == "profile" || tab == "password") && (
                <DashProfile tab={tab} />
            )}
            {tab === "category" && <DashCategory />}
            {tab === "post" && <DashPost />}
            {tab === "user" && <DashUsers />}
            {tab === "comments" &&
                (currentUser?.admin ? (
                    <DashAdminComments />
                ) : (
                    <DashUserComments />
                ))}
            {tab === "overview" &&
                (currentUser?.admin ? (
                    <DashAdminOverview />
                ) : (
                    <DashUserOverview />
                ))}
        </div>
    );
};

export default Dashboard;
