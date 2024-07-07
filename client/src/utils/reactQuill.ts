import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

hljs.configure({
    languages: [
        "javascript",
        "ruby",
        "python",
        "java",
        "cpp",
        "kotlin",
        "sql",
        "json",
    ],
});

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
        syntax: {
            highlight: (text: string) => hljs.highlightAuto(text).value,
        },
    },

    formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "link",
        "code-block",
        "color",
        "background",
        "align",
        "list",
        "bullet",
        "indent",
    ],
};
