
const express = require("express")

const app = express();
const globalApiErrorHandler = require("./middleware/global-middleware")
const apiroutes = require("./routes/index")
const {PORT} = require("./config/envirment-variable/index")
// Middleware for parsing JSON requests
app.use(express.json());
//middleware for parsing urlencoded requests
app.use(express.urlencoded({ extended: true }));

// Middleware for handling global errors
app.use(globalApiErrorHandler);

// http://localhost:3000/api
app.use('/api', apiroutes);
// app.use('flightService/api', apiroutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});
