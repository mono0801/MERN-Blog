import hljs from "highlight.js";
// TODO: React-Quill의 Code-Block 설정하기
// TODO: 위즈윅 대체제 찾기

export const quillConfig = {
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote", "link"],
            ["code-block"],
            [{ color: [] }, { background: [] }, { align: [] }],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["clean"],
        ],
    },

    formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "link",
        "script",
        "color",
        "background",
        "align",
        "list",
        "bullet",
        "indent",
    ],
};
