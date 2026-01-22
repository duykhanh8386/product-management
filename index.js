// 1) Load biến môi trường
require("dotenv").config();

// 2) Import thư viện core
const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

// 3) Import middleware session/flash
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

// 4) Import DB + mongoose
const database = require("./config/database");
const { default: mongoose } = require("mongoose");

// 5) Import config hệ thống + routes
const systemConfig = require("./config/system");
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.router");

// 6) Khởi tạo app
const app = express();

// 7) Kết nối database
database.connect(); // (tuỳ dự án: có thể là MySQL / Mongo / config riêng)
mongoose.connect(process.env.MONGO_URL); // kết nối MongoDB bằng MONGO_URL trong .env

// 8) Cấu hình port
const port = process.env.PORT || 3000;

// 9) Middleware: method override (hỗ trợ PUT/DELETE từ form)
app.use(methodOverride("_method"));

// 10) Biến dùng chung cho view
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// 11) Middleware: parse form data (application/x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: false }));

// 12) View engine: Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// 13) Cookie + Session + Flash messages
app.use(cookieParser("DOAKSDASOFA"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // 60 giây
  })
);
app.use(flash());

// 14) Static files
app.use(express.static(`${__dirname}/public`));

// 15) Routes
routeClient(app);
routeAdmin(app);

// 16) Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
