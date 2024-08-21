import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./utils/databaseConnection.js";
import { UserRouter } from "./routes/user.routes.js";
import { PostRouter } from "./routes/post.routes.js";
import { MessageRouter } from "./routes/message.routes.js";
configDotenv();
import { app ,server} from "./sockets/socket.js";
const PORT = process.env.PORT || 8000;
import path from "path";
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};
app.use(cors(corsOptions));

const __dirname=path.resolve();
// Routes
console.log(__dirname);

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/post", PostRouter);
app.use("/api/v1/message", MessageRouter);

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})
server.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
  ConnectDB();
});


