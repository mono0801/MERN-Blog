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

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* TODO URL 깔끔하게 정리하기 */}
                <Route path="/login" element={<LogIn />} />
                <Route path="/login/github" element={<GithubCallback />} />
                <Route path="/login/kakao" element={<KakaoCallback />} />
                <Route path="/login/naver" element={<NaverCallback />} />

                <Route path="/join" element={<Join />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
            </Routes>
            <FooterComponent />
        </BrowserRouter>
    );
};

export default App;
