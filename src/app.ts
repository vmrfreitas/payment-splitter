import * as dotenv from "dotenv";
dotenv.config();

import "reflect-metadata";
import * as express from "express";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import { groupRouter } from "./routes/group.routes";
import { participantRouter } from "./routes/participant.routes";
import { expenseRouter } from "./routes/expense.routes";
import { settlementRouter } from "./routes/settlement.routes";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use("/users", userRouter);
    app.use("/groups", groupRouter);
    app.use("/groups", participantRouter);
    app.use("/groups", expenseRouter);
    app.use("/groups", settlementRouter);

    app.get("*",(req: Request, res: Response) => {
        res.status(505).json({ message: "Bad Request"});
    });
    return app;
}