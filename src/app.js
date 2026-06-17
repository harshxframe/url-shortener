import express from "express"
import dotenv from "dotenv";
import generateUrlRouter from "./route/generateUrl.js";
import readUrlRouter from "./route/readUrl.js";

dotenv.config();

export const initApp = () =>{
try{
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/app/v1",generateUrlRouter);
app.use("/",readUrlRouter);
app.get("/health", (req,res) =>{
    res.send("Server health is OK!");
})

return app;
}catch(e){
throw Error(e.message);
}

}