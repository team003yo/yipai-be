const express = require("express");
const router = express.Router();
const pool = require("../utils/db");
const { checkLogin } = require("../middlewares/authMiddleware");

// GET /api/members
router.get("/", checkLogin, (req, res, next) => {
  // 能夠通過 checkLogin 中間件，表示一定一定有 req.session.member -> 一定是登入後
  res.json(req.session.member);
});
// GET /api/members/orders 使用者的訂單
router.get("/orders", checkLogin, async (req, res, next) => {
  // 能夠通過 checkLogin 中間件，表示一定一定有 req.session.member -> 一定是登入後
  // 安心地使用 req.session.member.id 去資料庫拿這個 id 的訂單
  let [data] = await pool.query(
    "SELECT * FROM user_order JOIN product WHERE user_id=?",
    [req.session.member.users_id]
  );
  res.json(data);
});

// GET  /api/members/userData
router.get("/userData", checkLogin, async (req, res, next) => {
  let [data] = await pool.query(
    "SELECT user_imageHead,user_imagePage,users_name,users_account,users_main_product,users_valid_role,users_aside_picture,users_phone,users_email,users_slogan,users_introduce,users_city,users_township,users_street FROM users WHERE users_id=? ",
    [req.session.member.users_id]
  );
  res.json(data);
});
// GET  http://localhost:3001/api/members/cartAll
router.get("/cartAll", checkLogin, async (req, res, next) => {
  let [data] = await pool.query(
    "SELECT users.users_name, users.users_phone, users.users_city || users.users_township || users.users_street AS send_address, product.id, product.price FROM users INNER JOIN user_order ON users.users_id = user_order.user_id INNER JOIN product ON product.id = user_order.product_id WHERE users_id=? ;",
    [req.session.member.users_id]
  );
  res.json(data);
});


// GET 賣家商品 /api/members/sellerProduct
router.get("/sellerProduct", checkLogin, async (req, res, next) => {
  let [data] = await pool.query("SELECT * FROM product WHERE artist=? ", [
    req.session.member.users_name,
  ]);
  res.json(data);
});
// GET 賣家訂單 /api/members/sellerOrder
router.get("/sellerOrder", checkLogin, async (req, res, next) => {
  let [data] = await pool.query("SELECT * FROM user_order ");
  res.json(data);
});

// PUT /api/members
router.put("/", checkLogin, async (req, res, next) => {
  // console.log("/users/:usersId TO upload ", req.params.usersId);
  let [data] = await pool.query(
    "UPDATE users SET users_name = ? , users_account = ? , users_email = ? ,users_phone = ? WHERE users_id = ?",
    [
      req.body.username,
      req.body.account,
      req.body.email,
      req.body.phone,
      req.body.usersId,
    ]
  );
  console.log(req.body);
  res.json(data);
});
module.exports = router;
