import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/user/user.route";
import { RequirementRouter } from "./app/modules/requirement/requirement.route";
import { TripDetailRouter } from "./app/modules/tripDetail/tripDetail.route";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running.");
});

// routers
app.use("/users", UserRouter);
app.use("/requirements", RequirementRouter);
app.use("/trip-details", TripDetailRouter);

console.log(process.cwd());

export default app;
