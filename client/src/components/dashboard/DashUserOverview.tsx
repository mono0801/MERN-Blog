import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { getOverview } from "../../utils/utils";
import { IOverview } from "../../utils/interface";
import Ad from "../Ad";

const DashUserOverview = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [overview, setOverview] = useState<IOverview | null>(null);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        getOverview().then((msg) => {
            if (msg.response?.ok) {
                setOverview(msg.data);
            } else {
                console.log(msg.data);
            }
        });
    }, [currentUser]);

    return (
        <div className="p-3 md:mx-auto md:my-auto">
            <div className="flex flex-wrap justify-center p-3 gap-4 mb-5">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase font-semibold">
                                Total Users
                            </h3>
                            <p className="text-2xl">{overview?.user.total}</p>
                        </div>

                        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {overview?.user && overview.user.lastMonth > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}
                            {overview?.user.lastMonth}
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
                            <p className="text-2xl">{overview?.post.total}</p>
                        </div>

                        <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {overview?.post && overview?.post.lastMonth > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}

                            {overview?.post?.lastMonth}
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
                            <p className="text-2xl">
                                {overview?.comment.total}
                            </p>
                        </div>

                        <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            {overview?.comment &&
                            overview.comment.lastMonth > 0 ? (
                                <HiArrowNarrowUp />
                            ) : null}
                            {overview?.comment.lastMonth}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl mt-10">
                <Ad />
            </div>
        </div>
    );
};

export default DashUserOverview;
