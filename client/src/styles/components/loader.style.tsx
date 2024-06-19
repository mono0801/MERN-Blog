import styled from "styled-components";

export const LoaderContainer = styled.div`
    min-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const Loader = styled.div`
    width: 5rem;
    padding: 0.6rem;
    margin-top: 10px;

    aspect-ratio: 1;
    border-radius: 50%;
    background: #4880f8;

    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 0.8s infinite linear;

    @keyframes l3 {
        to {
            transform: rotate(1turn);
        }
    }
`;

export const LoadingSpan = styled.p`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 10px;
`;
