import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LogIn from "./pages/LogIn";
import Join from "./pages/Join";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import GithubCallback from "./pages/login/Github";
import KakaoCallback from "./pages/login/Kakao";
import NaverCallback from "./pages/login/Naver";
import PrivateRoute from "./components/Protect/PrivateRoute";
import ProtectLogIn from "./components/Protect/ProtectLogIn";
import UploadPost from "./pages/UploadPost";
import OnlyAdmin from "./components/Protect/OnlyAdmin";
import Post from "./pages/Post";
import PostEdit from "./pages/PostEdit";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";

const LoginRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/github" element={<GithubCallback />} />
            <Route path="/kakao" element={<KakaoCallback />} />
            <Route path="/naver" element={<NaverCallback />} />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Project />} />
                <Route path="/search" element={<Search />} />

                <Route path="/post/:id" element={<Post />} />

                <Route element={<ProtectLogIn />}>
                    <Route path="/login/*" element={<LoginRoutes />} />
                    <Route path="/join" element={<Join />} />
                    <Route
                        path="/forgotpassword"
                        element={<ForgotPassword />}
                    />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route element={<OnlyAdmin />}>
                    <Route path="/post/upload" element={<UploadPost />} />
                    <Route path="/post/edit/:postId" element={<PostEdit />} />
                </Route>
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
};

export default App;
