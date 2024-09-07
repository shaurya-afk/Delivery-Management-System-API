import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import web from "./routes/web.js"
const app = express();
const port = process.env.PORT || '8080';

import path from 'path';  
import { fileURLToPath } from 'url';  

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);  


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views')); 

app.use(express.json());

app.use(express.urlencoded({ extended: true })); 

// load route
app.use("/fedex", web);

app.listen(port, ()=>{
	console.log(`listining on port: ${port}`);
});