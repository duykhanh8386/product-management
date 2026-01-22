  // [GET] /products

  const Product = require("../../models/product.model")
  module.exports.index= async (req,res)=>{
    
    const products = await Product.find({
      status:"active",
      deleted: false
    });

    products.forEach(item=>{
      item.priceNew = (item.price *(100-item.discountPercentage)/100).toFixed(0);
    })
      res.render("client/pages/products/index",{
        pageTitle: "Danh sach san pham",
        products:products
      })
  }
  //[GET] /products/:slug
    module.exports.detail= async (req,res)=>{
    
      try{
        const find = {
          slug: req.params.slug,
          deleted:false,
          status:"active"
        };
        const product = await Product.findOne(find);
        res.render("client/pages/products/detail",{
          pageTitle: product.title,
          product:product
        })
      }
      catch(error){
        res.redirect(`products`)
      }
      
  }
