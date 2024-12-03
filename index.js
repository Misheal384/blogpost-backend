const express = require('express');
const bodyParser = require('body-parser');
const blogRoutes = require('./routes/blogRoutes');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use("/auth", authRoutes);
app.use('/api', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
