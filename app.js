const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');
const path = require("path")
const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const methodOverride = require("method-override")
// const mjml = require ("mjml")

// RENDER HOSTING
// https://www.youtube.com/watch?v=q8GSWGu2roA


// MIDDLEWARE

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))


//DATABASE
//database
const mongoose = require('mongoose');
const { compileFunction } = require("vm");
// const { getMaxListeners } = require("events");
mongoose.connect('mongodb://127.0.0.1:27017/barbersite')
.then( () => {
    console.log("WORKING")
})
.catch(err => {
    console.log("NOT CONNECTED")
})

// phase 1
// 1. navbar completion - done
// 2. change Font - done
// 3. add pricing photos - nearly done
// 4. html form design improvements - done
// 5. complete automated booking email html - done
// COMPLETE

// phase 2
// 1. create crud for bookings - done
// 2. admin login completion - done
// 3. admin dashboard design - view and delete on 1 page, create booking in another

// phase 3
// 1. bcrypt for login page
// 2. automated booking cancelation email - similar to booking email
// 3. css animations
// 4. gallery carousel - not sure of i wanna do this anymore



//haircut booking schema
const barbershopSchema = new mongoose.Schema([{
        name: {
            type:String,
            required: true,
        },
        email: {
            type:String,
            required: true,
        },
        date: Date,
        time: {
            type:String,
            enum: ["10:00", "11:00", "12:00", "13:00","14:00","15:00", "16:00","17:00","18:00"],
        },
        haircut: String
    }                                                                                                                   
])

//haircut booking schema
const adminSchema = new mongoose.Schema([{
    username: {
        type:String,
        unique: true,
        required: true,
    },
    password: {
        type:String,
        required: true,
    }
}                                                                                                                   
])


//models
const bookingHaircut = mongoose.model('bookingHaircut', barbershopSchema);
const adminLogin = mongoose.model('adminLogin', adminSchema);



//ROUTES

// homepage
app.get('/', (req, res) => {
    res.render("index",)
})

// booking haircut
app.post("/booked", async (req, res) => {
    console.log("testing")
    const name = req.body.name
    console.log(req.body.name)
    const email = req.body.email
    console.log(req.body.email)
    var date = req.body.date
    console.log(req.body.date)
    const time = req.body.time
    console.log(req.body.time)
    const haircut = req.body.haircut
    console.log(req.body.haircut)



        // https://www.youtube.com/watch?v=RYEeg6IhzvE - ejs only
        // https://blog.bitsrc.io/integrate-nodemailer-with-ejs-for-email-template-ea2f77aaee2a
        // https://www.youtube.com/watch?v=yN93jHupyp4 - handlebars
        // https://www.youtube.com/watch?v=RnA4TdTGy5I - mailer
        // text: "Hi, thank you form booking your appointment", // plain text body
        // html: `hi${name}, your haircut is on the on ${time}, ${date}`, // html body
        //paste whole html on here
        //look into this https://documentation.mjml.io/#components




    // email sent to email used to book
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'muminsharmarke@gmail.com',
          pass: 'dqfr johj cgfe hnjh ',         
        },
      });

    transporter.sendMail({

        from: '"Sharmarke Mumin" <muminsharmarke@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "4KTrimz", // Subject line
        text: "Hi, thank you form booking your appointment", // plain text body 
        html: `hi ${name}, your haircut is on the on ${time}, ${date}`, // html body// html body
      });

    

    const addHaircutBooking = new bookingHaircut(req.body)
    addHaircutBooking.save()
    res.render("booked", {name, email, date, time, haircut})
})



//   view bookings page
app.get("/dashboard/bookings", async (req, res) => {
    const bookedHaircut = await bookingHaircut.find({})
    console.log(bookingHaircut.find({"email": bookedHaircut.email})
)
        res.render("bookings", {bookedHaircut})
    })

// delete booking
app.delete("/bookings/:id", async (req, res) => {

    const bookedHaircut = await bookingHaircut.find({})
    console.log(bookedHaircut._id)
    console.log(bookedHaircut.email)
    const id = req.params.id
    console.log(id)
    const deleteHaircut = await bookingHaircut.findByIdAndDelete(id)
    console.log("deleted haircut booking below")
    console.log(deleteHaircut)


    //all booked haircuts
    
    // const bookedEmail = await bookingHaircut.findOne({"email": bookedHaircut.email})

    // now add the deleted email nodemailer.
    // const transporter = nodemailer.createTransport({
    //     service: "hotmail",
    //     host: 'smtp-mail.outlook.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: "muminsharmarke@hotmail.com",
    //       pass: "Mumins12",
    //     },
    //   });

      

    //     const info = await transporter.sendMail({

        

    //     from: '"Sharmarke Mumin" <muminsharmarke@hotmail.com>', // sender address
    //     to: `${bookedEmail}`, // list of receivers
    //     subject: "4KTrimz", // Subject line
    //     text: "Hi, thank you form booking your appointment", // plain text body
    //     html: `Sorry, your appointment has been cancelled`, // html body

    // })
    

    res.render("bookings", {bookedHaircut, deleteHaircut, id})
})

// admin login page
app.get("/dashboard/users", (req, res) => {    
    res.render("users")
})
// admin login page
app.get("/dashboard/adminbookings", (req, res) => {    
    res.render("adminbookings")
})

// admin login page
app.get("/admin", (req, res) => {    
    res.render("admin")
})

// dashboard
app.post('/dashboard', async (req, res) => {
    const bookedHaircut = await bookingHaircut.find({})
    const adminUsername = req.body.username
    console.log(req.body.username)
    const adminPassword = req.body.password
    console.log(req.body.password)

    const admin = await adminLogin.findOne({})

    if(admin.username !== adminUsername || admin.password !== adminPassword){
        
        return res.render("loginerror")
    } 
        const name = req.body.username
        console.log(adminUsername)
        console.log(adminPassword)
        
        res.render("dashboard",{adminUsername, adminPassword, admin, name, bookedHaircut})
})
// Delete
app.delete("/dashboard/:id", async (req, res) => {

    const bookedHaircut = await bookingHaircut.find({})
    console.log(bookedHaircut._id)
    console.log(bookedHaircut.email)
    const id = req.params.id
    console.log(id)
    const deleteHaircut = await bookingHaircut.findByIdAndDelete(id)
    console.log("deleted haircut booking below")
    console.log(deleteHaircut)


    //all booked haircuts
    
    // const bookedEmail = await bookingHaircut.findOne({"email": bookedHaircut.email})

    // now add the deleted email nodemailer.
    // const transporter = nodemailer.createTransport({
    //     service: "hotmail",
    //     host: 'smtp-mail.outlook.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: "muminsharmarke@hotmail.com",
    //       pass: "Mumins12",
    //     },
    //   });

    //     const info = await transporter.sendMail({

    //     from: '"Sharmarke Mumin" <muminsharmarke@hotmail.com>', // sender address
    //     to: `${bookedEmail}`, // list of receivers
    //     subject: "4KTrimz", // Subject line
    //     text: "Hi, thank you form booking your appointment", // plain text body
    //     html: `Sorry, your appointment has been cancelled`, // html body

    // })
    

    res.render("dashboard", {bookedHaircut, deleteHaircut, id})
})


// incorrect URL
app.get('*', function(req, res){
    console.log('404ing');
    res.render('404');
  });


// server
app.listen(3000,() => {
    console.log("Server listening on port 3000");
  });


