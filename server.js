const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const db = require("./database/createDataBase.js");
 require("dotenv").config();
const app = express();
const port = process.env.PORT || 3004;
const cors = require("cors");
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin:  'https://ethiopian-missing-person-sys.web.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(function(req,res,next){
    res.locals.errors=[];

    next();
})

app.use("/api/admin",require("./routes/policeOfficerAdminRoute/policeOfficerAdminRoute"));
app.use("/api/police/root",require("./routes/routesForRootAdmin/rootAdminRoute"));
app.use("/api/police",require("./routes/loginRoute/loginRoute"));
app.use("/api/post",require("./routes/postRoute/postRoute"));
app.use("/api/report",require("./routes/reportRoute/reportRoute"));
app.use("/api/message",require("./routes/messageRoute/messageRoute"));
app.use("/api/setting",require("./routes/settingRoute/settingRoute"));
app.use("/api/criminals",require("./routes/criminalsRoute/criminalsRoute"));
app.use("/api/notification",require("./routes/notificationRoute/notificationRoute"));

app.use("/api/country",require("./routes/countryRoute/countryRoute"));
app.get('/',(req,res)=>{
    const result = db.testConnection();
    res.status(200).json({message:"works", connectionResult:result});
})
app.use("/api/test",require("./routes/test/routeTest"));
app.use(errorHandler);

const sendDailyRequests = require("./utils/requestSenderEveryDay.js");
setInterval(sendDailyRequests, 12*60*60*1000); // 12 hours in milliseconds

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});