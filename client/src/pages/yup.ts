import * as yup from "yup";

export const logInSchema = yup.object().shape({
    email: yup.string().email().required("Please write E-mail"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 Characters")
        .matches(/^[a-zA-Z0-9!@#$%^*+=-]*$/, "Invalid Password")
        .required("Please write Password"),
});

export const signSchema = logInSchema.shape({
    nickname: yup
        .string()
        .min(2, "Nickname must be at least 2 Characters")
        .required("Please write Nickname"),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref("password")], "Password doesn't Match")
        .min(6, "Password must be at least 6 Characters")
        .matches(/^[a-zA-Z0-9!@#$%^*+=-]*$/, "Invalid Password")
        .required("Please write Password Confirm"),
});
