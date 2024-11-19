import express from "express";
import { db } from "./bd/bd";
import { getCoursesRouter } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser.json());

app.use("/courses", getCoursesRouter());
app.use("/__tests__", getTestsRouter(db));
