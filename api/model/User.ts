import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    nickname: string;
    email: string;
    password: string;
    socialLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileUrl: string;
    admin: boolean;
    _doc?: any;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        nickname: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: function () {
                return !this.socialLogin;
            },
        },
        socialLogin: { type: Boolean, default: false },
        profileUrl: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        },
        admin: { type: Boolean, default: false },
    },
    // 생성 & 업데이트 시간 자동 입력
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
