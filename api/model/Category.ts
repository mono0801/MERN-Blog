import mongoose from "mongoose";

export interface ICategory extends mongoose.Document {
    category: string;
    _doc?: any;
}

const categorySchema = new mongoose.Schema<ICategory>({
    category: { type: String, required: true },
});

const categoryModel = mongoose.model<ICategory>("Category", categorySchema);

export default categoryModel;
