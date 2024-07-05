import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { LogoSpan } from "../styles/components/header.style";
import {
    BsDribbble,
    BsFacebook,
    BsGithub,
    BsInstagram,
    BsTwitter,
} from "react-icons/bs";

const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link
                            to={"/"}
                            className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg text-white">
                                Sellen's
                            </span>
                            <LogoSpan>Blog</LogoSpan>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="/about"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    Sellen's Blog
                                </Footer.Link>
                                <Footer.Link
                                    href="https://mono0801.github.io/ReactJS-NetFlixClone/"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    NetFlix Clone
                                </Footer.Link>
                                <Footer.Link
                                    href="https://nomadcoder-youtube-clone-2024.fly.dev/"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    YouTube Clone
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="FOLLOW US" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://github.com/mono0801"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link href="#">Discord</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="LEGAL" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href="#">
                                    Terms &amp; Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        href="#"
                        by="Sellen's blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:jsutify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon
                            target="blank"
                            href="https://github.com/mono0801"
                            icon={BsGithub}
                        />
                        <Footer.Icon href="#" icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterComponent;
