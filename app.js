const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const fs=require("fs");
const session=require("express-session");
const path=require("path");
const ejs=require("ejs");
const nodemailer=require("nodemailer");
const Insta = require('instamojo-nodejs');





const app=express();
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({secret: 'satya',saveUninitialized: true,resave: true}));
mongoose.connect("mongodb://localhost:27017/order_food",{useNewUrlParser:true});


app.use(function(req, res, next)
{ res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
    next(); 
});

//var instamojoMiddleWare=instamojowebhook({ secretKey: '8441d623797b4db9ba9b88b0ff8c4d67'});
var sess;
var name;

var admin=null;


app.get("/logout",function(req,res){
  console.log("ok destroy");
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})




const CustomerSchema=new mongoose.Schema(
{
  fullname:String,
  email:String,
  contact:Number,
  address:String,
  password:String,
  city:String,
  rand:String
})
const Customer=new mongoose.model("Customer",CustomerSchema);

const AdminSchema=new mongoose.Schema({
	fullname:String,
	email:String,
	contact:Number,
	city:String,
	fulladdress:String,

	password:String,
})

const Admin=new mongoose.model("Admin",AdminSchema);


const SupplierSchema=new mongoose.Schema({
	fullname:String,
	email:String,
	contact:Number,
	city:String,
	fulladdress:String,
	password:String
	
})


const Supplier=new mongoose.model("Supplier",SupplierSchema);
const ItembookSchema=new mongoose.Schema({
	fullname:String,
	contact:Number,
	address:String,
	quantity:Number,
	mode:String,
	city:String,
	rest_Name:String,
	cost:Number,
	item_Name:String,
	email:String,
	totalpayment:Number,
	OrderDate:String,
	Ordertime:String,
	payment_id:String,
	payment_status:String,
	processing:String,
	deliveryboycontact:Number
	
})

const Itembook=new mongoose.model("Itembook",ItembookSchema);

const ProcesseditemSchema=new mongoose.Schema({
	Itemid:String,
	rest_name:String,
	checkintime:String,
	checkouttime:String,
	hotelbillid:String,
	Date:Date,
	city:String
})

const Processeditem=new mongoose.model("Processeditem",ProcesseditemSchema);

const DeleteduserSchema=new mongoose.Schema({
	username:String,
	userpassword:String,
	useremail:String,
	usercontact:Number,
	usercity:String,
	userfulladdress:String,
	adminlocation:String,
	deletedDate:Date
	
})

const Deleteduser=new mongoose.model("Deleteduser",DeleteduserSchema);


const OrderHistoryOfUserSchema=new mongoose.Schema({
	username:String,
	item_Name:String,
	rest_name:String,
	orderdate:String,
	ordertime:String,
	location:String,
	email:String,
	item_Id:String
})


const OrderHistoryOfUser=new mongoose.model("OrderHistoryOfUser",OrderHistoryOfUserSchema);

const DeletedsupplierSchema=new mongoose.Schema({
	suppliername:String,
	supplierpassword:String,
	supplieremail:String,
	suppliercontact:Number,
	suppliercity:String,
	supplierfulladdress:String,
	deletedDate:Date
})

const Deletedsupplier=new mongoose.model("Deletedsupplier",DeletedsupplierSchema);

const SuppliersendedItemsSchema=new mongoose.Schema({
	supplierid:String,
	processingitems:[String]
})
const Suppliersendeditems=new mongoose.model("Suppliersendeditems",SuppliersendedItemsSchema);
app.get('/success',function(req,res)
{
	res.render("success");
})

app.get('/error',function(req,res)
{
	res.render("error");
})

app.get('/firstverify',function(req,res){
	res.render('firstverify');
})

app.get('/superadminlogin',function(req,res)
{
	res.render("superadminlogin");
})


app.post('/superadminlogin',function(req,res)
{
	const email=req.body.email;
	const password=req.body.password;

	console.log(email+" "+password);

	if(email==='superadmin@gmail.com' && password==='12345678')
	{   
		sess=req.session;
		sess.email=email;
		sess.name='superadmin'
		res.end('done');
		//return false;
	}
	else
	{
		res.end('sorry');
	}
})


app.get('/superadminwork',function(req,res){

   if(sess.email==='superadmin@gmail.com')
   {
	Customer.find({},function(err,foundlist1){
		if(err){console.log('erro cust super');}
		else
		{
			Supplier.find({},function(err2,foundlist2){
				if(err2){console.log('error sup super');}
				else
				{
					Admin.find({},function(err3,foundlist3){
						if(err3){console.log('error admin super');}
						else
						{
							Itembook.find({},function(err4,foundlist4){
								if(err4){console.log('erro item super');}
								else
								{
									Deletedsupplier.find({},function(err5,foundlist5)
									{
										if(err5){console.log('error deleted supplier super');}
										else
										{
											Deleteduser.find({},function(err6,foundlist6){
												if(err6){console.log('error deleted user super');}
												else
												{
                                                   res.render("superadminwork",{foundlist1,foundlist2,foundlist3,foundlist4,foundlist5,foundlist6});
												}
											})
										  	
										}
									})
									
								}
							})
							
						}
					})
				}
			})
		}
	})



  }
  else
  {
  	 res.write('<h1>Sorry you are not Supposed to access this page withour login</h1>');
  	  res.end('<a href='+'/superadminlogin'+'>Login First</a>');
  }
	
})







app.get('/deliveryboy',function(req,res)
{
	sess=req.session;
	if(sess.email)
	{
		console.log('ssss');
		res.render("deliveryboy",{ses:"todays",yourname:sess.name});
	}
	else
	{ console.log('your are not in session');
      res.render("deliveryboy",{ses:"today"});
	}


})

app.get('/admin',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		console.log('sssss');
		res.render("admin",{ses:"todays",yourname:sess.name});
	}
	else
	{ console.log('your are not in session');
      res.render("admin",{ses:"today"});
	}
})

app.get('/jamshedpur',function(req,res)
{
	sess=req.session;
	if(sess.email)
	{
		res.render('jamshedpur',{ses:"todays",yourname:sess.name})
	}
	else
	{
		res.render('jamshedpur',{ses:"today"})
	}
})



app.get('/patna',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.render("patna",{ses:"todays",yourname:sess.name});
	}
	else
	{
		res.render("patna",{ses:"today"});
	}
})



app.get('/ranchi',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.render("ranchi",{ses:"todays",yourname:sess.name});
	}
	else
	{
		res.render("ranchi",{ses:"today"});
	}
})




app.get('/varanasi',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.render("varanasi",{ses:"todays",yourname:sess.name});
	}
	else
	{
		res.render("varanasi",{ses:"today"});
	}
})




app.get('/',function(req,res)
{
	//console.log('value is '+customerdetail(sess));
	sess=req.session;
	if(sess.email)
	{
		console.log('sssss');
		Itembook.find({email:sess.email},function(err,foundlist){
			if(err){console.log('error OrderHistoryOfUser');}
			else
			{
				res.render("home",{ses:"todays",yourname:sess.name,foundlist});
			}
		})
		
	}
	else
	{ console.log('your are not in session');
      res.render("home",{ses:"today"});
	}
})





app.get('/features',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.render("features",{ses:"todays",yourname:sess.name});
	}
	else
	{
		console.log('you are not in session');
		res.render("features",{ses:"today"});
	}
})










app.post('/loginDelivery',function(req,res){
	const email=req.body.emaild;
	const city=req.body.select_menud;
	const password=req.body.passwordd;
	console.log(email+" "+city+" "+password);

	Supplier.findOne({email:email,city:city},function(err,foundlist){
		if(err){console.log('error in supp');}
		else if(!foundlist)
		{
			res.write('<h1>User with this data do not exist</h1>');
            res.end('<a href='+'/deliveryboy'+'>Back</a>');
		}
		else if(foundlist.password!=password)
		{
			res.write('<h1>wrong email and password</h1>');
            res.end('<a href='+'/deliveryboy'+'>Back</a>');
		}
		else
		{
			sess=req.session;
			sess.email=req.body.email;
			sess.name=foundlist.fullname;
			Suppliersendeditems.find({supplierid:foundlist.id},function(err,foundlist2){
				if(err){console.log('error');}
				else
				{
					res.render("deliveryboyWork",{ses:"todays",yourname:sess.name,location:city,foundlist,foundlist2});
				}
			})
			
		}
	})
})















app.post('/customerLogin',function(req,res){
	const email1=req.body.email1;
	const password1=req.body.password1;
	sess=req.session;
	
	console.log(sess.email+" "+password1);
	 
     

	Customer.findOne({email:email1},function(error,foundlist){
		if(error){console.log('there is error');}
		else if(!foundlist)
		{
			console.log('customer with this email do not exist');
		}
		else if(foundlist.password!=password1)
		{         
            res.end('notmatched');

		}
		else if(foundlist.rand!=0)
		{
			res.end('verify');
		}
		else
		{
			console.log('logged in'+sess.email+"sdf");

			sess.email=req.body.email1;
			sess.name=foundlist.fullname;
			res.end('success');
		}
	})

	
})
















app.post('/adminlogin',function(req,res){
	//console.log("xya");
	const email=req.body.email;
	const city=req.body.select_menu;
	const password=req.body.password;
	sess=req.session;
	console.log(email+" "+city+" "+password);
    
	Admin.findOne({email:email,city:city,password:password},function(err,foundlist){
		if(err){console.log('there is some error');}
		else if(!foundlist)
		{  
			res.end('sorry');
		}
		else
		{   
			sess.email=req.body.email;
			sess.name=foundlist.fullname;
			if(city==='ranchi')
			{
				res.end('success1');
			}

			else if(city==='varanasi')
			{
				res.end('success2');
			}

			else if(city==='jamshedpur')
			{
				res.end('success3');
			}

			if(city==='patna')
			{
				res.end('success4');
			}

			
		}
	})
})














app.post('/verifyCustomer',function(req,res)
{
	const email=req.body.email;
	const password3=req.body.password3;
	console.log(email+" "+password3);

	Customer.findOne({email:email},function(err,foundlist)
	{
		if(err){console.log('there might be some error');}
		else if(foundlist.rand===password3)
		{ 
			//console.log(foundlist.rand);
			foundlist.rand="gjg";
			console.log(foundlist.rand);
			sess=req.session;
			sess.email=email;
			console.log(foundlist.fullname);
			sess.name=foundlist.fullname;
			Customer.findOneAndUpdate({email:email},{rand:0},function(err,foundlist){
				if(err){console.log(error)}
					else
					{

					}
			})
           res.end('verified')
		}
		else
		{  // console.log(foundlist.rand);
			res.end('wrong');
		}
	})
})
















app.post('/setitemstatus',function(req,res){
	id=req.body.id12;
	status=req.body.select_menustatus;
	location=req.body.location;
   deliverycontact=req.body.deliverycontact;

	console.log(id+" "+status+" "+location+deliverycontact);

	if (id.match(/^[0-9a-fA-F]{24}$/))
    {
  	   Itembook.findOne({_id:id,city:location},function(err,foundlist)
       {
         if(err){console.log(err);}
         else if(!foundlist)
           {
             console.log('soryy');
             res.write('<h1>Sorry you have entered wrong id</h1>');
           //res.end('<a href='+'/'+'>Login</a>');
           }
        else
             {   
            //console.log(foundlist.fullname);
           //foundlist.processing='delivered';
               Itembook.findOneAndUpdate({_id:id},{processing:status,deliveryboycontact:deliverycontact},function(err,foundlist5){
             	if(err){console.log('er');}
             	else
             	{
         	     	console.log('processed');
         	     	res.write('<h1>successfully setted</h1>');
             	}
               })
             }
       })
    }
  else
  {
     console.log('soryy');
       res.write('<h1>Sorry you have entered wrong id</h1>');
  }
})
















app.post('/sendid',function(req,res){
	const supplierid=req.body.idx;
	const itemsid=req.body.itemsid;
	const location=req.body.loc;
	console.log(supplierid+" "+itemsid+" "+location);

	Supplier.findOne({_id:supplierid,city:location},function(err,foundlist){
		if(err)
		{
		   res.write('<h1>Some error is there</h1>');
		   res.end('<a href='+'/admin'+'>back</a>');
        }
		else if(!foundlist)
		{
              res.write('<h1>Supplier with this id did not exist</h1>');
              //res.end('<a href='+'/'+'>Login</a>');
		}
		else
		{
			Suppliersendeditems.findOneAndUpdate({supplierid:supplierid},{$push: {processingitems: itemsid}},function(err,foundlist2){
				if(err){
					console.log('error ')
				}
				else if(!foundlist2)
				{
					var newitems=Suppliersendeditems({
            	    supplierid:supplierid,
                 	processingitems:itemsid
                    })
                    newitems.save();

				}
			})
            
             res.write('<h1>Successfull done</h1>');
              res.end('<a href='+'/Ranchiadminwork'+'>back</a>');
		}
		
	})
})









app.post('/deliveryboyProcessitem',function(req,res){
	const checkintime=req.body.checkintime;
	const checkouttime=req.body.checkouttime;
	const id=req.body.id8;
	const location=req.body.location;
	const restaurantName=req.body.rest_name;
	const hotelbillid=req.body.hotelbillid;
	const supplierid=req.body.supplierid;
	console.log(supplierid)
	var today=new Date();
    var t1=today.toLocaleDateString()
    console.log(t1);

	
	if (id.match(/^[0-9a-fA-F]{24}$/))
   {
  	Itembook.findOne({_id:id,city:location},function(err,foundlist)
     {
        if(err){console.log(err);}
        else if(!foundlist)
        {
          console.log('soryy');
          res.write('<h1>Sorry you have entered wrong id</h1>');
           //res.end('<a href='+'/'+'>Login</a>');
        }
      else
       {
        //console.log(foundlist.fullname);
        //foundlist.processing='delivered';
         Itembook.findOneAndUpdate({_id:id},{processing:"delivered"},function(err,foundlist5){
         	if(err){console.log('er');}
         	else
         	{
         		console.log('processed');
         		Suppliersendeditems.findOne({supplierid:supplierid},function(err,foundlist6){
         			if(err){console.log('error in finding')}
         				else
         				{
         					//sconsole.log(foundlist6.processingitems);
         					for(var i=0;i<foundlist6.processingitems.length;i++)
         					{
         						if(foundlist6.processingitems[i]==id)
         						{
         							console.log(foundlist6.processingitems[i]);
         							foundlist6.processingitems.splice(i,1);
         							var newarray=foundlist6.processingitems;
         							console.log(newarray);

         							Suppliersendeditems.findOneAndUpdate({supplierid:supplierid},{processingitems: newarray},function(err,doc){
                                          if(err){console.log('error in updatng');}
         							})


         						}
         					}
         				}

         		})

         	}
         })
         var newprocessed=Processeditem({
         	Itemid:id,
         	checkintime:checkintime,
         	checkouttime:checkouttime,
         	city:location,
         	hotelbillid:hotelbillid,
         	rest_name:restaurantName,
         	Date:t1
         })

         newprocessed.save();
       
          
       }
    })
  }
  else
  {
     console.log('soryy');
       res.write('<h1>Sorry you have entered wrong id</h1>');
  }


})





app.post('/deliveryboySeeItem',function(req,res)
{

	const id=req.body.button;
	console.log(id+"ssa");
	if (id.match(/^[0-9a-fA-F]{24}$/))
   {
  	Itembook.findOne({_id:id},function(err,foundlist)
     {
        if(err){console.log(err);}
        else if(!foundlist)
        {
          console.log('soryy');
          res.write('<h1>Sorry you have entered wrong id</h1>');
           //res.end('<a href='+'/'+'>Login</a>');
        }
      else
       {
        //console.log(foundlist.fullname);
        res.render("detail",{foundlist});
       }
    })
  }
  else
  {
     console.log('soryy');
       res.write('<h1>Sorry you have entered wrong id</h1>');
  }
	
})











app.post('/deleteUser',function(req,res){
	console.log('done');
	const id=req.body.id1;
	const adminlocation=req.body.locationsup;
     var today=new Date();
     var t1=today.toLocaleDateString()
     console.log(t1);
  if (id.match(/^[0-9a-fA-F]{24}$/))
  {
  	Customer.findOneAndRemove({_id:id},function(err,foundlist)
     {
        if(err){console.log(err);}
        else if(!foundlist)
        {
          console.log('soryy');
          res.end('sorry');
        }
      else
       {
       	var newdeleteduserhistory=new Deleteduser({
       		username:foundlist.fullname,
	        userpassword:foundlist.password,
	        useremail:foundlist.email,
	        usercontact:foundlist.contact,
	        usercity:foundlist.city,
	        userfulladdress:foundlist.address,
	        adminlocation:adminlocation,
	        deletedDate:t1
	
       	})

       	newdeleteduserhistory.save();
        console.log(foundlist.fullname);
        res.end('done');
       }
    })
  }
  else
  {
    res.end('sorry');
  }
	
})





app.post('/deleteAdminbyId',function(req,res){
	console.log('done');
	const id=req.body.id3;
	

  if (id.match(/^[0-9a-fA-F]{24}$/))
  {
  	Admin.findOneAndRemove({_id:id},function(err,foundlist)
     {
        if(err){console.log(err);}
        else if(!foundlist)
        {
          console.log('soryy');
          res.end('sorry');
        }
      else
       {
        console.log(foundlist.fullname);
        res.end('done');
       }
    })
  }
  else
  {
    res.end('sorry');
  }
	
})







app.post('/deleteSupplier',function(req,res){
	console.log('done');
	const id=req.body.id2;
     var today=new Date();
     var t1=today.toLocaleDateString()
     console.log(t1);
  if (id.match(/^[0-9a-fA-F]{24}$/))
  {
  	Supplier.findOneAndRemove({_id:id},function(err,foundlist)
     {
        if(err){console.log(err);}
        else if(!foundlist)
        {
          console.log('soryy');
          res.end('sorry');
        }
      else
       {
        console.log(foundlist.fullname);

        var newdeletedsupplierhistory=new Deletedsupplier({
        	suppliername:foundlist.fullname,
	        supplierpassword:foundlist.password,
	        supplieremail:foundlist.email,
	        suppliercontact:foundlist.contact,
	        suppliercity:foundlist.city,
	        supplierfulladdress:foundlist.fulladdress,
	        deletedDate:t1
        })

        newdeletedsupplierhistory.save();
        res.end('done');
       }
    })
  }
  else
  {
    res.end('sorry');
  }
	
})












app.post('/addSupplier',function(req,res){
	
	const fullname=req.body.fullname2;
	const contact=req.body.contact2;
	const address=req.body.address2;
	const password=req.body.password2;
	const email=req.body.email2;
	const location=req.body.location2;
	 
   // console.log("xya");
	console.log(fullname+" "+contact+" "+address+" "+password+" "+email+" "+location);

	Supplier.findOne({email:email},function(err,foundlist){
		if(err){console.log('there is error in supplier');}
		else if(!foundlist)
		{
			var transporter = nodemailer.createTransport(
            {
              service: 'gmail',
              auth: 
              {
                user: 'jeesatyapal@gmail.com',
                pass: 77060544195
               }
            });

	        mailOptions = 
               {
                 from: 'jeesatyapal@gmail.com',
                 to: email,
                 subject: "Welcome to viveko food order online",
                   html : "Hello, Your  password for viveko food order online is  is <br>"+password,
                 };

           transporter.sendMail(mailOptions, function(error, info)
            {
              if (error)
                {
                 console.log(error);
                 res.end('error');
                } 
                else 
                 {

                  console.log("show");
                  console.log('Email sent: ' + info.response);
                    
	                 var newSupplier=Supplier(
	                   {
	                    	fullname:fullname,
	                     	contact:contact,
	                    	fulladdress:address,
	                    	password:password,
	                       	email:email,
	                       	city:location
	                    })
	                  newSupplier.save();
                         
                   }
            }); 
           res.render('success');
		}

		else
		{
			res.write('<h1>This email has alreaddy been taken</h1>');
           res.end('<a href='+'/'+'>Login</a>');
		}

		
	})


    
})



app.post('/addAdmin',function(req,res){
	
	const fullname=req.body.fullname1;
	const email=req.body.email1;
	const city=req.body.select_menu;
	const fulladdress=req.body.address1;
	const contact=req.body.contact1;
	const password=req.body.password1;

	console.log(fullname+" "+email+" "+city+" "+fulladdress+" "+contact+" "+password);
	Admin.findOne({email:email},function(err,foundlist){
		if(err){res.end('error');}
		else if(!foundlist)
		{
          var transporter = nodemailer.createTransport(
            {
              service: 'gmail',
              auth: 
              {
                user: 'jeesatyapal@gmail.com',
                pass: 77060544195
               }
            });

	        mailOptions = 
               {
                 from: 'jeesatyapal@gmail.com',
                 to: email,
                 subject: "Welcome to viveko food order online",
                   html : "Hello, Your  password for viveko food order online is  is <br>"+password,
                 };
           var t;
           transporter.sendMail(mailOptions, function(error, info)
            {

              if (error)
                {
                	
                	//res.redirect('/https://www.google.com');
                   console.log(error);
                   //res.render("demo",{value:1});
                   //  res.end('errorinsent');
                } 
                else 
                 {
                    console.log('show');
                  console.log('Email sent: ' + info.messageId);
                   
                     var newAdmin=Admin(
	                   {
	                    	fullname:fullname,
	                     	contact:contact,
	                    	fulladdress:fulladdress,
	                    	password:password,
	                       	email:email,
	                       	city:city
	                    })
	                  newAdmin.save();
	                  res.end('success');
	                     
                        
                   }
               }); 
          
             res.end('success')
             
              // res.end('success');
		}
		else
		{
			res.end('found');
		}
	})

})






app.post('/customerRegister',function(req,res){
	const fullname=req.body.fullname2;
	const contact=req.body.contact2;
	const address=req.body.address2;
	const password=req.body.password2;
	const email=req.body.email2;
	const city=req.body.city2;
    var rand=Math.floor((Math.random() * 10000) + 54.3);
	console.log(fullname+" "+contact+" "+address+" "+password+" "+email);

	Customer.findOne({email:email},function(err,foundlist)
	{
		if(err){console.log('there is error');}
		else if(!foundlist)
		{
			var transporter = nodemailer.createTransport(
               {
                  service: 'gmail',
                   auth: {
                   user: 'jeesatyapal@gmail.com',
                   pass: 77060544195
                }
               });

	           mailOptions = 
                 {
                      from: 'jeesatyapal@gmail.com',
                        to: email,
                       subject: "verify",
                      html : "Hello, Your one time password is </br> OTP "+ rand +"</br><img src='cid:batman'/>" ,
                      attachments:[
                     {
                       filename: 'emailit.jpg',
                           path:__dirname+'/emaiit.jpg',
                           cid:'batman'
                     }]
    
                 };

             transporter.sendMail(mailOptions, function(error, info)
              {
                  if (error)
                  {
                   console.log(error);
                   res.end('error');
                  } 
                 else 
                    {
                    console.log("show");
                    console.log('Email sent: ' + info.response);
                     var newCustomer=Customer(
	                    {
	                    	fullname:fullname,
	                     	contact:contact,
	                    	address:address,
	                    	password:password,
	                       	email:email,
	                       	city:city,
	                       	rand:rand
	                    })
	                  newCustomer.save();
	                 
                         
                   }
               });
              res.end('success');
		  }
		  else
		  {
             res.end('sorry');
		  }
	})
	 
})
























app.post('/search',function(req,res){
	const location=req.body.select_menu;
	console.log(location);
	  if(location==='jamshedpur')
	  {
        res.end('jamshedpur')
	  }

	  if(location==='varanasi')
	  {
          res.end('varanasi')
	  }

	  if(location==='ranchi')
	  {
         res.end('ranchi')
	  }

	  if(location==='patna')
	  {
        res.end('patna')
	  }
})










app.post('/booknow',function(req,res){

	const data=req.body.button;
	console.log(data);
	var result = data.split(" ");
	console.log(result[2]);
	sess=req.session;
	if(sess.email)
	{
      res.render("booknow",{email:sess.email,result});
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
	}

})






app.get('/congrats_offline_book',function(req,res){
	console.log(citem_name+" "+cquantity+" "+crest_name+" "+cbill+" "+cpaymentcharge+" "+ctotalbill);
	if( citem_name && cquantity && crest_name && cbill && cpaymentcharge && ctotalbill)
	{
	res.render("congrats_offline_book",{citem_name,cquantity,crest_name,cpaymentcharge,cbill,ctotalbill});
  	console.log("payment cod");
  	citem_name=null;
    cquantity=null;
    crest_name=null;
    cbill=null;
    cpaymentcharge=null;
    ctotalbill=null;
	}
	else
    { 
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
  
})


app.get('/successfulpaymentonline',function(req,res){
	if(ofullname && ocontact && oaddress && oquantity && oemail && req.query.payment_id &&req.query.payment_status)
	{
		  var newbooking=Itembook({
	         fullname:ofullname,
	         contact:ocontact,
	         address:oaddress,
	         quantity:oquantity,
	         mode:omode,
	         city:ocity,
	         rest_Name:orest_name,
	         cost:ocost,
	         item_Name:oitem_name,
	         email:oemail,
	         OrderDate:odate,
	         Ordertime:otime,
	         payment_id:req.query.payment_id,
             payment_status:req.query.payment_status,
	            })

	      newbooking.save();

	

	          
	         ofullname=null;
	         
              ocontact=null;
              oaddress=null;
             oquantity=null;
             omode=null;
             ocity=null;
             orest_name=null;
             ocost=null;
             oitem_name=null;
             oemail=null;
             otime=null;
             odate=null;
	      res.render("successfulpaymentonline");
	}
	else
    { 
        console.log(req.query.payment_id);
        res.write('<h1>You are not Authorisesd to acceess this page</h1>');
        res.end('<a href='+'/'+'>Go back to Main Page</a>');
    }
})


















var ofullname=null;
var ocontact=null;
var oaddress=null;
var oquantity=null;
var omode=null;
var ocity=null;
var orest_name=null;
var ocost=null;
var oitem_name=null;
var oemail=null;
var otime=null;
var odate=null;
var oparticularitem_ID=null;


var citem_name=null;
var cquantity=null;
var crest_name=null;
var cbill=null;
var cpaymentcharge=null;
var ctotalbill=null;
app.post('/finalsubmission',function(req,res){
	const fullname=req.body.fullname3;
	const contact=req.body.contact3;
	const address=req.body.address3;
	const quantity=req.body.items3;
	const mode=req.body.radio;
	const city=req.body.city;
	const rest_name=req.body.rest_name;
	const cost=req.body.cost;
	const item_name=req.body.item_name;
	const email=req.body.email3;
    console.log('hi satya'+" "+item_name+" "+email+" ");
     var today=new Date();
     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
     var t1=today.toLocaleDateString()
     console.log(t1);
	console.log(email);
    var bill=cost*quantity;
    var finalbill=bill+20;
    var maillist=[email,'prempaljee111@gmail.com']
	if(mode==='cash_on_delivery')
	{
	      var transporter = nodemailer.createTransport(
               {
                  service: 'gmail',
                   auth: {
                   user: 'jeesatyapal@gmail.com',
                   pass: 770605441956
                }
               });

	          maillist.forEach(function (to, i , array) {
	          	  var msg = {
                      from: "******", // sender address
                      subject: "ORDER ITEM ✔", // Subject line
                      html:"Hello This is to inform that <h1>Mr. "+fullname+" </h1>has ordered the item <h1>"+item_name+" </h1> for the resturant <h1>"
                      +rest_name+ "</h1> and the bill is <h1>"+finalbill+"</h1>",// plaintext body
                      cc: "*******"    
    //  html: "<b>Hello world ✔</b>" // html body
                       }
                    msg.to = to;
 
                   transporter.sendMail(msg, function (err) {
                   if (err) { 
                         console.log('Sending to ' + to + ' failed: ' + err);
                         return;
                      } 
                      else { 
                     console.log('Sent to ' + to);
                       }

                if (i === maillist.length - 1) { msg.transport.close(); }
                   });
                 });

                 var newbooking=Itembook({
	                   	fullname:fullname,
	                    contact:contact,
	                    address:address,
	                    quantity:quantity,
	                    mode:mode,
	                    city:city,
	                    rest_Name:rest_name,
	                    cost:cost,
	                    item_Name:item_name,
	                    email:email,
	                    totalpayment:bill,
	                    OrderDate:t1,
	                    Ordertime:time,
	                  })
                       
                      
	                  newbooking.save();
                        

	            var newhistoryofuser=OrderHistoryOfUser({
	            	username:fullname,
	                item_Name:item_name,
	                rest_name:rest_name,
	                orderdate:t1,
	                ordertime:time,
	                location:city,
	                email:email,
	                
	            })   

	            newhistoryofuser.save();   
              
               citem_name=item_name;
               cquantity=quantity;
               crest_name=rest_name;
               cbill=bill;
               cpaymentcharge=20;
              ctotalbill=bill+20;
		   res.render("demo",{value:1});
	    
      
	}

	if(mode==='Online_payment')
	{
            ofullname=fullname;
            ocontact=contact;
            oaddress=address;
            oquantity=quantity;
            omode:mode;
            ocity=city;
            orest_name=rest_name;
            ocost=cost;
            oitem_name=item_name;
            oemail=email;
            otime=time;
            odate=t1;

            Insta.setKeys("e94079733b1bc454c6f80b9fe49892a7","febbce517aadfe67fb04dee8706228ae");
            var data = new Insta.PaymentData();
            data.purpose=item_name;
            data.amount=quantity*cost;
            data.currency                = 'INR';
            data.buyer_name              = fullname
            data.email                   = sess.email;
            data.phone                   = contact;
            data.send_sms                = true
            data.send_email              = true
            data.allow_repeated_payments = false
            //data.webhook                 ="http://localhost:5000/success"
            data.redirect_url            = "http://localhost:4000/successfulpaymentonline";

            Insta.createPayment(data, function(error, response) 
            {
             if (error)
               {
                 console.log('invalid phone no');
               }
              else 
              {
               var obj = JSON.parse(response);
              // console.log(obj);
                 
                 	res.redirect(obj.payment_request.longurl);
                   console.log(obj.payment_request.longurl);
                 
                
              }
            });
	}
})






























/////////////////////////////////////////////////admin work pannel///////////////////////////

app.get('/Ranchiadminwork',function(req,res)
{
	const city='ranchi';
	sess=req.session;
	if(sess.email)
	{
		Admin.findOne({email:sess.email},function(err2,foundlist){
			if(err2){console.log('error admin');}
			else if(foundlist)
			{

                  Itembook.find({city:city},function(err,foundlist1)
                  {
		          	if(err){console.log('there is some error in itemsbooks');}
			        else
			         {
			         	Customer.find({},function(err,foundlist2)
			         	{
				    	 if(err){console.log('theer is error in coustoemr');}
				     	 else
					      {
					      	Supplier.find({city:city},function(err3,foundlist3)
					      	{
					      		if(err3){console.log('errror supplier');}
					      		else
					      		{
					      			Processeditem.find({city:city},function(err,foundlist4)
					      			{
					      				if(err){console.log('errro processed');}
					      				else
					      				{
					      					res.render("Ranchiadminwork",{location:city,ses:"todays",yourname:sess.name,foundlist1,foundlist2,foundlist3,foundlist4});
					      				}
					      			})
					      		
					      		}
					      	})
					    	
					      }
				        })
			          }
		          })
                   
			}
			else
			{
			   res.write('<h1>Sorry You are Not Authorised to access this page.</h1>');
               res.end('<a href='+'/admin'+'>Back</a>');	
			} 
		})
		
	}

	else
	{
		res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
	}
})












app.get('/Varanasiadminwork',function(req,res)
{
	const city='varanasi';
	sess=req.session;
	if(sess.email)
	{
		Admin.findOne({email:sess.email},function(err2,foundlist){
			if(err2){console.log('error admin');}
			else if(foundlist)
			{

                  Itembook.find({city:city},function(err,foundlist1)
                  {
		          	if(err){console.log('there is some error in itemsbooks');}
			        else
			         {
			         	Customer.find({},function(err,foundlist2)
			         	{
				    	 if(err){console.log('theer is error in coustoemr');}
				     	 else
					      {
					      	Supplier.find({city:city},function(err3,foundlist3)
					      	{
					      		if(err3){console.log('errror supplier');}
					      		else
					      		{
					      			Processeditem.find({city:city},function(err4,foundlist4){
					      				if(err4){console.log('error processed');}
					      				else
					      				{
					      					res.render("Varanasiadminwork",{location:city,ses:"todays",yourname:sess.name,foundlist1,foundlist2,foundlist3,foundlist4});
					      				}
					      			})
					      			
					      		}
					      	})
					    	
					      }
				        })
			          }
		          })
                   
			}
			else
			{
			   res.write('<h1>Sorry You are Not Authorised to access this page.</h1>');
               res.end('<a href='+'/admin'+'>Back</a>');	
			} 
		})
		
	}

	else
	{
		res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
	}
})














app.get('/Patnaadminwork',function(req,res)
{
	const city='patna';
	sess=req.session;
	if(sess.email)
	{
		Admin.findOne({email:sess.email},function(err2,foundlist){
			if(err2){console.log('error admin');}
			else if(foundlist)
			{

                  Itembook.find({city:city},function(err,foundlist1)
                  {
		          	if(err){console.log('there is some error in itemsbooks');}
			        else
			         {
			         	Customer.find({},function(err,foundlist2)
			         	{
				    	 if(err){console.log('theer is error in coustoemr');}
				     	 else
					      {
					      	Supplier.find({city:city},function(err3,foundlist3)
					      	{
					      		if(err3){console.log('errror supplier');}
					      		else
					      		{
					      			Processeditem.find({city:city},function(err4,foundlist4){
					      				if(err4){console.log("error processd");}
					      				else
					      				{
					      				  res.render("Patnaadminwork",{location:city,ses:"todays",yourname:sess.name,foundlist1,foundlist2,foundlist3,foundlist4});	
					      				}
					      			})
					      			
					      		}
					      	})
					    	
					      }
				        })
			          }
		          })
                   
			}
			else
			{
			   res.write('<h1>Sorry You are Not Authorised to access this page.</h1>');
               res.end('<a href='+'/admin'+'>Back</a>');	
			} 
		})
		
	}

	else
	{
		res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
	}
})















app.get('/Jamshedpuradminwork',function(req,res)
{
	const city='jamshedpur';
	sess=req.session;
	if(sess.email)
	{
		Admin.findOne({email:sess.email},function(err2,foundlist){
			if(err2){console.log('error admin');}
			else if(foundlist)
			{

                  Itembook.find({city:city},function(err,foundlist1)
                  {
		          	if(err){console.log('there is some error in itemsbooks');}
			        else
			         {
			         	Customer.find({},function(err,foundlist2)
			         	{
				    	 if(err){console.log('theer is error in coustoemr');}
				     	 else
					      {
					      	Supplier.find({city:city},function(err3,foundlist3)
					      	{
					      		if(err3){console.log('errror supplier');}
					      		else
					      		{
					      			Processeditem.find({city:city},function(err4,foundlist4){
					      				if(err){console.log('error processed');}
					      				else
					      				{
					      					res.render("Jamshedpuradminwork",{location:city,ses:"todays",yourname:sess.name,foundlist1,foundlist2,foundlist3,foundlist4});
					      				}
					      			})
					      			
					      		}
					      	})
					    	
					      }
				        })
			          }
		          })
                   
			}
			else
			{
			   res.write('<h1>Sorry You are Not Authorised to access this page.</h1>');
               res.end('<a href='+'/admin'+'>Back</a>');	
			} 
		})
		
	}

	else
	{
		res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/admin'+'>Login</a>');
	}
})


///////////////////////////////////////////////////////////////////////////////////////////

let port=process.env.PORT;
if(port==null||port==""){
  port=4000;
}

app.listen(port,function() //this is the dynamic port which heroku will define on go
{
   console.log("server has started listening on  port 4000");
});