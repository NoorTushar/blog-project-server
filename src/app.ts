import express, { Response, Request, Application } from "express";
import cors from "cors";
// import { StudentRoutes } from "./modules/student/student.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(express.raw());
app.use(express.text());
app.use(cors());

// app.use("/api/v1/students", StudentRoutes);

app.get("/", (req: Request, res: Response) => {
   res.send("Hello World. This is me!!!");
});

export default app;
