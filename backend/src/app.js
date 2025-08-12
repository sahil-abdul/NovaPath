import express from "express";
import cookieParer from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParer());
app.use(express.static("public"));

//importing routers
import UserRouter from "./routes/users.routes.js";
import VedioRouter from "./routes/video.route.js";
import tweetRouter from "./routes/Tweet.routes.js";
import subscriptionRoute from "./routes/subscription.routes.js";
import playlistRoute from "./routes/playlist.routes.js";
import likeRoutes from "./routes/like.routes.js";
import healthCheckRoute from "./routes/healthCheck.routes.js";
import commentRoute from "./routes/comments.routes.js"

//calling the routes
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/video", VedioRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/healthcheck", healthCheckRoute);
app.use("/api/v1/comment", commentRoute);

export { app };
