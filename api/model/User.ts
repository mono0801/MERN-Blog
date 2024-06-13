import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    socialLogin?: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: function () {
                return !this.socialLogin;
            },
        },
        socialLogin: { type: Boolean, default: false },
    },
    // 생성 & 업데이트 시간 자동 입력
    { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
