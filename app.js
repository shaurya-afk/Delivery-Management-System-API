import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import web from "./routes/web.js"
const app = express();
const port = process.env.PORT || '8080';

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json()); // to integrate it with ReactJs -> Later figure out to do with Basics

// load route
app.use("/fedex", web);

app.listen(port, ()=>{
	console.log(`listining on port: ${port}`);
});