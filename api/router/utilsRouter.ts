import express from "express";
import { getOverview } from "../controller/utilsController";
import { verifyToken } from "../middleware";

const utilsRouter = express.Router();

utilsRouter.route("/overview").get(verifyToken, getOverview);

export default utilsRouter;
