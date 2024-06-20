# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Client init

```bash
# vite로 생성된 파일에는 nodemodule이 설치되어있지 않다
$ npm i
# Tailwind CSS 설치
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p
$ npm i styled-components
$ npm i --save-dev @types/styled-components
$ npm i react-router-dom
# UI 컴포넌트 디자인 제공 - Tailwind CSS 설치 필요
$ npm i flowbite-react@0.7.0
$ npm i react-icons
$ npm i react-hook-form
# React-Hook-Form에 사용할 Input Schema 설정
$ npm i @hookform/resolvers yup
$ npm i @reduxjs/toolkit react-redux
$ npm i redux-persist @types/redux-persist
$ npm i firebase
$ npm i --save react-circular-progressbar
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default {
    // other rules...
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
    },
};
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Expanding the TailWind CSS & Flowbite-React configuration

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        // TailWind CSS Configuration
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        // Flowbite-React Configuration
        "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        // Flowbite-React Configuration
        require("flowbite/plugin"),
    ],
};
```
