const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser')
const cors = require('cors')

//db

mongoose.connect(process.env.uri,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB connected'))

mongoose.connection.on('error',err => {
  console.log(`DB connection error: ${err.message}`);
});
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/notes");

app.use(bodyparser.json())
app.use(cookieparser())
app.use(cors());
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",postRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`A node js api is listening on port : ${port}`);
});