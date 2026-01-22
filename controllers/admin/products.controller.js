const Product = require("../../models/product.model")

const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
// [GET] /admin/products
module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false
  }
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = searchHelper(req.query)


  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //Pagination
  const countProduct = await Product.countDocuments(find);
  let objectPagination = paginationHelper({
    limitItems: 4,
    currentPage: 1

  },
    req.query,
    countProduct
  );
  //End Pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort({ position: "desc" });
  res.render("admin/pages/products/index", {
    pageTitle: "Trang san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });

}
// [GET] /admin/products/trash
module.exports.trash = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: true
  }
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = searchHelper(req.query)


  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //Pagination
  const countProduct = await Product.countDocuments(find);
  let objectPagination = paginationHelper({
    limitItems: 4,
    currentPage: 1

  },
    req.query,
    countProduct
  );
  //End Pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort({ position: "desc" });
  res.render("admin/pages/products/trash", {
    pageTitle: "Trang san pham da bi xoa",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });

}
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", 'Cập nhật trạng thái sản phẩm thành công');

  const backURL = req.get('referer');
  res.redirect(backURL);

};
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    //case nay la type cua cai select
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date()
        });
      req.flash("success", `Delete thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-forever":
      await Product.deleteMany({ _id: { $in: ids } },
      );
      req.flash("success", `Delete vĩnh viễn thành công ${ids.length} sản phẩm!`);
      break;
    case "recover-item":
      await Product.updateMany({ _id: { $in: ids } },
        {
          deleted: false,
          deletedAt: null
        }
      );
      req.flash("success", `Khôi phục thành công ${ids.length} sản phẩm!`);
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id);
        // console.log(position);
        await Product.updateOne({ _id: id }, {
          position: position
        });
      }
      break;
    default:
      break;
  }
  const backURL = req.get('referer');
  res.redirect(backURL);
};

// [DELETE] /admin/products/deleted:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // Xoa vinh vien san pham trong database
  // await Product.deleteOne({_id: id});
  // Xoa mem, cap nhat lai truogn delete la duoc
  await Product.updateOne({ _id: id },
    {
      deleted: true,
      deletedAt: new Date()//Lay ra thoi gian xoa
    },

  );


  // back ve trang truoc khi chap nhan thao tac
  const backURL = req.get('referer');
  res.redirect(backURL);

};
// [DELETE] /admin/products/delete:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // Xoa vinh vien san pham trong database
  // await Product.deleteOne({_id: id});
  // Xoa mem, cap nhat lai truogn delete la duoc
  await Product.deleteOne({ _id: id },
    {
      deleted: true,
      deletedAt: new Date()//Lay ra thoi gian xoa
    },

  );


  // back ve trang truoc khi chap nhan thao tac
  const backURL = req.get('referer');
  res.redirect(backURL);

};
// [DELETE] /admin/products/delete-forever:id
module.exports.deleteForever = async (req, res) => {
  const id = req.params.id;
  await Product.deleteOne({ _id: id });
  // back ve trang truoc khi chap nhan thao tac
  const backURL = req.get('referer');
  res.redirect(backURL);

}
module.exports.recoverItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, {
    deleted: false,
    deletedAt: null
  })
}
//tu code them trang khoi phuc san pham cho nho
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Tao moi san pham",
  })
}
// [Post] /admin/products/create
module.exports.createPost = async (req, res) => {
  
  
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);

  req.body.discountPercentage = parseInt(req.body.discountPercentage);

  if (req.body.position === "") {
    const countProduct = await Product.countDocuments({});
    req.body.position = countProduct + 1;
    console.log(countProduct);
  } else {
    req.body.position = parseInt(req.body.position);
  }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}
// [GET] /admin/products/edit/:id
module.exports.edit = async (req,res)=>{
  try{
    const find = {
    deleted: false,
    _id: req.params.id
  };
  const product = await Product.findOne(find);
  res.render("admin/pages/products/edit",{
    pageTitle:"Edit product page",
    product:product
    //truyen bien vao day de co the dung dc ben pug view
  })
  }
  catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);

  req.body.discountPercentage = parseInt(req.body.discountPercentage);

  
  req.body.position = parseInt(req.body.position);
  
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try{
    await Product.updateOne({
      //tim den ban ghi muon update
      _id:req.params.id,

    },
      //data chung ta muon update
      req.body
    )
    req.flash("success","Cập nhật thành công");
  }
  catch (error){
    req.flash("error","Cập nhật thất bại");
  }
  const backURL = req.get("referer");
  res.redirect(backURL);
  
}

// [GET] /admin/products/details/:id
module.exports.details = async (req,res)=>{
  try{
    const find = {
    _id: req.params.id,
    deleted:false
  }
  const product = await Product.findOne(find);
  res.render(
    "admin/pages/products/details",{
      pageTitle:product.title,
      product:product
    }
  )
  }
  catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
    req.flash("error","Khong tim thay chi tiet sp")
  }
}