import {
    Loader,
    LoaderContainer,
    LoadingSpan,
} from "../styles/components/loader.style";

const Loading = () => {
    return (
        <LoaderContainer>
            <LoadingSpan className="dark:text-white">Login Now</LoadingSpan>
            <LoadingSpan className="dark:text-white">
                Don't Reload This Page
            </LoadingSpan>
            <Loader />
        </LoaderContainer>
    );
};

export default Loading;
