import { AppDataSource } from "./data-source";
import * as express from "express";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import { groupRouter } from "./routes/group.routes";
import { participantRouter } from "./routes/participant.routes";
import { expenseRouter } from "./routes/expense.routes";

const app = express();
app.use(express.json());
const {PORT = 3000} = process.env;
app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use("/groups", participantRouter);
app.use("/groups", expenseRouter);

app.get("*",(req: Request, res: Response) => {
    res.status(505).json({ message: "Bad Request"});
});

AppDataSource.initialize().then(async () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    console.log("Data source initialized.");
}).catch(error => console.log(error))
