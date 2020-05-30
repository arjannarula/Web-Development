var express=require("express"),
	mongoose=require("mongoose"),
	methodoverride=require("method-override"),
	bodyparser=require("body-parser"),
	expresssanitizer=require("express-sanitizer"),
	app=express();
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));
var blogschema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog= mongoose.model("Blog",blogschema);
// Blog.create({
// 	titie:"New Blog Post!",
// 	image:"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
// 	body:"This is a trial version of Blog post"
// })
app.get("/",function(req,res){
	res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
			  if(err){
		console.log("There is an error");
	}
	else{
		res.render("index",{blogs:blogs});
	}
			  })
})
app.get("/blogs/new",function(req,res){
	res.render("new")
})

app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	})
})
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,findblog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("show",{blog:findblog})
		}
	})
})
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,findblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:findblog})
		}
	})
})
app.put("/blogs/:id",function(req,res){
		req.body.blog.body=req.sanitize(req.body.blog.body);

	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundblog){
						   if(err){
		res.redirect("/blogs")
						   }	else{
		res.redirect("/blogs/"+req.params.id);
	}
						   })
	
});
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
})
app.listen(3000,function(){
	
	console.log("Server Started");
})