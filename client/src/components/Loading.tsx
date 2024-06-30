import React from "react";
import {
    Loader,
    LoaderContainer,
    LoadingSpan,
} from "../styles/components/loader.style";

interface ISpan {
    string1: string;
    string2: string;
}

const Loading: React.FC<ISpan> = ({ string1, string2 }) => {
    return (
        <LoaderContainer>
            <LoadingSpan className="dark:text-white">{string1}</LoadingSpan>
            <LoadingSpan className="dark:text-white">{string2}</LoadingSpan>
            <Loader />
        </LoaderContainer>
    );
};

export default Loading;
