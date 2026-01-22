module.exports.createPost=(req, res, next)=>{
  if (!req.body.title) {
    req.flash("error", "Vui long nhap tieu de san pham");
    const backURL = req.get('referer');
    res.redirect(backURL);
    return;
  }
  next();// la th middle ware, ben B pass thi next moi cho chay sang C
}
