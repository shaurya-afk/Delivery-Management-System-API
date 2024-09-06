import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import web from "./routes/web.js"
const app = express();
const port = process.env.PORT || '8080';

import path from 'path';  // Add this import
import { fileURLToPath } from 'url';  // Add this import

const __filename = fileURLToPath(import.meta.url);  // Add this line
const __dirname = path.dirname(__filename);  // Add this line


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));  // Add this line

app.use(express.json()); // to integrate it with ReactJs -> Later figure out to do with Basics

app.use(express.urlencoded({ extended: true }));  // Add this line

// load route
app.use("/fedex", web);

app.listen(port, ()=>{
	console.log(`listining on port: ${port}`);
});