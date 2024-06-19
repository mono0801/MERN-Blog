import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LogIn from "./pages/LogIn";
import Join from "./pages/Join";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import GithubCallback from "./pages/login/Github";
import KakaoCallback from "./pages/login/Kakao";
import NaverCallback from "./pages/login/Naver";

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
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login/*" element={<LoginRoutes />} />
                <Route path="/join" element={<Join />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
};

export default App;
