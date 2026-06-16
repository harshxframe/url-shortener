import express from "express"
import dotenv from "dotenv";

dotenv.config();

export const initApp = () =>{
try{
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/health", (req,res) =>{
    res.send("Gell");
})


return app;


}catch(e){
throw Error(e.message);
}

}