import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: [
      "https://blood-donation-server-phi.vercel.app",
      "http://localhost:5000",
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Blood Donation Server is Running...",
  });
});

app.use("/", router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
