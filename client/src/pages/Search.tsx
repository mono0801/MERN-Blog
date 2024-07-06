import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { getCategory, getPostList } from "../utils/postUtils";
import { IPost } from "../utils/interface";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { searchKeywordSchema } from "./yup";
import { SignInputValue } from "../styles/components/sign.style";
import Loading from "../components/Loading";
import PostCard from "../components/post/PostCard";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { TbLayoutGridFilled } from "react-icons/tb";
import { FaList } from "react-icons/fa";
import { toggleLayout } from "../redux/layout/layoutSlice";
import PostList from "../components/post/PostList";

interface ISidebar {
    keyword: string | null;
    sort: string;
    category: string | null;
}

interface IKeyword {
    keyword?: string;
}

const Search = () => {
    const { layout } = useSelector((state: RootState) => state.layout);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<string[] | null>(null);
    const [param, setParam] = useState<ISidebar>({
        keyword: "",
        sort: "desc",
        category: null,
    });
    const [sidebar, setSidebar] = useState<ISidebar>({
        keyword: "",
        sort: "desc",
        category: null,
    });
    const [posts, setPosts] = useState<IPost[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const { register, handleSubmit } = useForm<IKeyword>({
        resolver: yupResolver<IKeyword>(searchKeywordSchema),
    });

    useEffect(() => {
        getCategory().then((msg) => {
            if (msg?.response.status != 200) {
                console.log(msg?.data);
            } else {
                const categoryArray: string[] = msg.data.map(
                    (item: { category: string }) => item.category
                );
                setCategory(categoryArray.sort());
            }
        });
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const keyword = urlParams.get("keyword");
        const sort = urlParams.get("sort");
        const categoryParam = urlParams.get("category");

        if (keyword || sort || categoryParam) {
            setSidebar({
                ...sidebar,
                keyword,
                sort: sort ? sort : "desc",
                category: categoryParam,
            });

            setParam({
                ...sidebar,
                keyword,
                sort: sort ? sort : "desc",
                category: categoryParam,
            });
        }

        setLoading(true);
        getPostList(`?${urlParams.toString()}`).then((msg) => {
            if (!msg.response?.ok) {
                setErrMsg(msg.data as string);
                return setLoading(false);
            } else {
                setPosts(msg.data.postList);
                setLoading(false);

                if (msg.data.postList.length == 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        });
    }, [location.search]);

    const handleValid = ({ keyword }: IKeyword) => {
        const urlParams = new URLSearchParams(location.search);
        if (keyword) {
            setSidebar({ ...sidebar, keyword });
            urlParams.set("keyword", keyword);
        } else {
            urlParams.delete("keyword");
        }

        urlParams.set("sort", sidebar.sort);

        if (sidebar.category) {
            urlParams.set("category", sidebar.category);
        } else {
            urlParams.delete("category");
        }

        navigate(`/search?${urlParams.toString()}`);
    };

    const handleSort = (sort: string) => {
        setSidebar({ ...sidebar, sort });
    };

    const handleCategory = (category: string) => {
        if (category == "") {
            setSidebar({ ...sidebar, category: null });
        } else {
            setSidebar({ ...sidebar, category });
        }
    };

    const handleShowMore = async () => {
        if (!posts) {
            return;
        }
        const startIndex = posts.length;
        const params = new URLSearchParams(location.search);
        params.set("startIndex", startIndex.toString());

        const msg = await getPostList(`?${params.toString()}`);
        if (!msg.response?.ok) {
            return console.log(msg?.data);
        } else {
            setPosts([...posts, ...msg.data.postList]);

            if (msg.data.postList.length == 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="whitespace-nowrap font-semibold">
                        Layout :{" "}
                    </h1>
                    <TbLayoutGridFilled
                        onClick={() => dispatch(toggleLayout())}
                        className={`${
                            layout
                                ? "text-teal-500 dark:text-white"
                                : "text-gray-600"
                        } text-3xl cursor-pointer hover:scale-125 transition-all`}
                    />
                    <FaList
                        onClick={() => dispatch(toggleLayout())}
                        className={`${
                            layout
                                ? "text-gray-600"
                                : "text-teal-500 dark:text-white"
                        } text-2xl cursor-pointer hover:scale-125 transition-all`}
                    />
                </div>

                <form
                    onSubmit={handleSubmit(handleValid)}
                    className="flex flex-col gap-8"
                >
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="keyword"
                            className="whitespace-nowrap font-semibold"
                        >
                            Search :
                        </label>
                        <TextInput
                            {...register("keyword")}
                            placeholder="Search..."
                            id="keyword"
                            type="text"
                            defaultValue={
                                sidebar.keyword ? sidebar.keyword : ""
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sort"
                            className="whitespace-nowrap font-semibold"
                        >
                            Sort :
                        </label>
                        <Select
                            id="sort"
                            defaultValue={sidebar.sort}
                            onChange={(e) => handleSort(e.currentTarget.value)}
                        >
                            <option value={"desc"}>Latest</option>
                            <option value={"asc"}>Oldest</option>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="category"
                            className="whitespace-nowrap font-semibold"
                        >
                            Category :
                        </label>
                        <Select
                            id="category"
                            defaultValue={"Select Category"}
                            onChange={(e) =>
                                handleCategory(e.currentTarget.value)
                            }
                        >
                            <option value={""}>Select Category</option>
                            {category?.map((c) => (
                                <option
                                    key={c}
                                    value={c}
                                    disabled={sidebar.category == c}
                                >
                                    {c}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        outline
                        gradientDuoTone={"purpleToBlue"}
                    >
                        <SignInputValue className="text-lg">
                            Search
                        </SignInputValue>
                    </Button>
                </form>
            </div>

            <div className="w-full">
                <h1 className="text-2xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
                    Posts Result {`(${posts?.length})`} :{" "}
                    {param.keyword && `[Keyword - ${param.keyword}]`}{" "}
                    {param.category && `[Category - ${param.category}]`}
                </h1>

                <div className="p-7 flex flex-wrap gap-4 justify-center">
                    {errMsg && (
                        <Alert
                            className="font-semibold"
                            color={"failure"}
                            icon={HiInformationCircle}
                        >
                            {errMsg}
                        </Alert>
                    )}

                    {!loading && (posts == null || posts.length == 0) && (
                        <p className="text-xl text-gray-500">No Posts Found</p>
                    )}

                    {loading && (
                        <Loading
                            string1="Searching For Post Now"
                            string2="Please a Minute"
                        />
                    )}

                    {!loading &&
                        posts &&
                        (layout
                            ? posts.map((post) => (
                                  <PostCard
                                      key={post._id}
                                      post={post}
                                      isPost={false}
                                  />
                              ))
                            : posts.map((post) => (
                                  <PostList key={post._id} post={post} />
                              )))}

                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="text-teal-500 text-lg hover:underline p-7 w-full"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
