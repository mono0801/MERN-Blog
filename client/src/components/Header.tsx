import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LinkP, LogoSpan } from "../styles/components/header.style";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/theme/themeSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { logoutSuccess } from "../redux/user/userSlice";
import { TbCategoryPlus } from "react-icons/tb";
import {
    HiAnnotation,
    HiChartPie,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { searchKeywordSchema } from "../pages/yup";

interface IKeyword {
    keyword?: string;
}

const Header = () => {
    const location = useLocation();
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { theme } = useSelector((state: RootState) => state.theme);
    const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm<IKeyword>({
        resolver: yupResolver<IKeyword>(searchKeywordSchema),
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const keyword = urlParams.get("keyword");

        if (keyword) {
            setSearchKeyword(keyword);
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

    const handleValid = (keyword: IKeyword) => {
        navigate(`/search?keyword=${keyword.keyword}`);
    };

    return (
        <Navbar className="border-b-2">
            <Link
                to={"/"}
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg text-white">
                    Sellen's
                </span>
                <LogoSpan>Blog</LogoSpan>
            </Link>

            <form onSubmit={handleSubmit(handleValid)}>
                <TextInput
                    {...register("keyword")}
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                    defaultValue={searchKeyword ? searchKeyword : ""}
                />
            </form>

            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>

            <div className="flex gap-3 md:order-2">
                <Button
                    className="w-12 h-10 hidden sm:inline"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </Button>

                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser.profileUrl}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm font-semibold">
                                {currentUser.nickname}
                            </span>
                            <span className="block text-xs font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={"/dashboard?tab=profile"}>
                            <Dropdown.Item icon={FaUser}>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Link to={"/dashboard?tab=overview"}>
                            <Dropdown.Item icon={HiChartPie}>
                                Dashboard
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Link to={"/dashboard?tab=password"}>
                            <Dropdown.Item icon={RiLockPasswordLine}>
                                Password
                            </Dropdown.Item>
                        </Link>
                        {currentUser?.admin && (
                            <>
                                <Dropdown.Divider />
                                <Link to={"/dashboard?tab=category"}>
                                    <Dropdown.Item icon={TbCategoryPlus}>
                                        Category
                                    </Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Link to={"/dashboard?tab=post"}>
                                    <Dropdown.Item icon={HiDocumentText}>
                                        Post
                                    </Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Link to={"/dashboard?tab=user"}>
                                    <Dropdown.Item icon={HiOutlineUserGroup}>
                                        User
                                    </Dropdown.Item>
                                </Link>
                            </>
                        )}
                        <Dropdown.Divider />
                        <Link to={"/dashboard?tab=comments"}>
                            <Dropdown.Item icon={HiAnnotation}>
                                Comments
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item icon={LuLogOut} onClick={handleLogOut}>
                            Log Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to={"/login"}>
                        <Button outline gradientDuoTone={"purpleToBlue"}>
                            <LinkP>Log In</LinkP>
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to={"/"}>
                        <LinkP>Home</LinkP>
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to={"/about"}>
                        <LinkP>About</LinkP>
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={"div"}>
                    <Link to={"/projects"}>
                        <LinkP>Project</LinkP>
                    </Link>
                </Navbar.Link>
                {!currentUser && (
                    <Navbar.Link active={path === "/join"} as={"div"}>
                        <Link to={"/join"}>
                            <LinkP>Sign In</LinkP>
                        </Link>
                    </Navbar.Link>
                )}
                {currentUser?.admin && (
                    <Navbar.Link active={path === "/post/upload"} as={"div"}>
                        <Link to={"/post/upload"}>
                            <LinkP>Upload</LinkP>
                        </Link>
                    </Navbar.Link>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
