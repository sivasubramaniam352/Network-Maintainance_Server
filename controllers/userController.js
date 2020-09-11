var User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')



const emailPatt = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const phPatt = /^\d{10}$/
const register = (req, res) => {
    const today = new Date()
    const adminData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        position: req.body.position,
        createdAt: today,
    }
    const userData = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        department: req.body.department,
        createdAt: today,
    }
    if(!phPatt.test(userData.phoneNumber)){
        res.status(400).json({ error: 'ph no must be numeric' })
       
    }
    
   else if ( req.body.phoneNumber.length !== 10) {
        res.status(400).json({ error: 'phno must exactly 10 digits' })
        console.log(req.body.phoneNumber.length)
    }
    else if (!emailPatt.test(userData.email) && userData.email != '') {
        return res.status(400).json({
            success: false,
            message: 'enter valid email'
        })

    }
    else if (typeof req.body.password === 'undefined' || req.body.password === '') {
        return res.status(400).json({
            success: false,
            message: 'enter valid password'
        })
    }

    else if (req.body.password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'password must contain minimum 8 characters'
        })
    }

    else if (typeof req.body.usertype === 'undefined' || req.body.usertype == '') {
        return res.status(400).json({
            success: false,
            message: 'enter valid usertype'
        })

    }


    else {
        User.findOne({ phoneNumber: req.body.phoneNumber })
            .then(user => {
                if (user) {
                    res.status(400).json({ message: 'phone number already taken' })
                } else {
                    console.log('working')
                    User.findOne({
                        email: req.body.email
                    })
                        .then(async user => {

                            if (user) {
                                res.status(400).json({ status: "email already taken" })
                            }
                            else {
                                if (req.body.usertype === 'admin') {
                                    console.log('u r admin')
                                    if(req.body.department){
                                        res.status(400).json({message:"you cant enter department if you are admin"})
                                    }
                                    else{
                                    const salt = await bcrypt.genSalt(10);
                                    adminData.password = await bcrypt.hash(adminData.password, salt);
                                    await User.create(adminData)
                                        .then(doc => {
                                            res.status(200).json({ data: doc })
                                        })
                                        .catch(err => {
                                            res.status(400).json({ error: err, message: "admin not created" })
                                        })
                                    }
                                }
                                else {
                                    console.log('u r user')
                                    if (typeof req.body.department === 'undefined' || req.body.department == '') {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'enter department'
                                        })

                                    }
                                    else {

                                        if(req.body.position){
                                            res.status(400).json({message:"you cant enter position if you are user "})
                                        }
                                        else{
                                        const salt = await bcrypt.genSalt(10);
                                        userData.password = await bcrypt.hash(userData.password, salt);
                                        await User.create(userData)
                                            .then(doc => {
                                                res.status(200).json({ data: doc })
                                            })
                                            .catch(err => {
                                                res.status(400).json({ error: err, message: "admin not created" })
                                            })
                                        }
                                    }
                                }
                            }

                        })
                        .catch(err => {
                            res.status(400).json({ msgL: err, error: "error on finding email" })
                        })
                }
            }).catch(err => {
                res.status(400).json({ msg: err, error: 'err on finding mobile' })
            })
    }


}


const getAll = (req, res) => {
    User.find(req.body)
        .then(doc => {
            return res.json(doc)
        })
        .catch(err => {
            res.json(err)
        })

}

const deleteUser = (req, res) => {
    let addon = req.user
    User.findByIdAndDelete({_id:addon._id})
        .then(user => {
            res.status(200).json({ status: 'success',message:"deleted", doc: user })
        })
        .catch(err => {
            res.json(err)
        })
}

//login
const login = (req, res) => {
    reqRegister = req.body;
    if (reqRegister.phoneNumber) {
        if (reqRegister.phoneNumber.length != 10) {
            return res.status(400).json({
                success: false,
                message: '10 digits needed'
            })

        }
        else if (typeof reqRegister.password === 'undefined' || reqRegister.password === '') {
            return res.status(400).json({
                success: false,
                message: 'enter valid password'
            })
        }
        else {
            User.findOne({ $or: [{ phoneNumber: reqRegister.phoneNumber }, { email: reqRegister.email }] })
                .then(user => {
                    if (user) {
                        if (bcrypt.compareSync(req.body.password, user.password)) {
                            const payload = {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                phoneNumber: user.phoneNumber,
                                position: user.position,
                                department:user.department
                            }
                            let tok = jwt.sign(payload, process.env.SECRET_KEY || 'secretnehvaida', {
                                expiresIn: 14400
                            })
                            res.status(200).json({ status: "success", token: `Bearer ${tok}` })

                        } else {
                            // Passwords don't match
                            res.json({ error: 'Email Or password is wrong' })
                        }
                    } else {
                        res.json({ error: 'User does not exist ' })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })

        }
    }
    else if (reqRegister.email) {
        if (!emailPatt.test(reqRegister.email)) {
            return res.status(400).json({
                success: false,
                message: 'enter valid email'
            })
        }
        
        else if (typeof reqRegister.password === 'undefined' || reqRegister.password === '') {
            return res.status(400).json({
                success: false,
                message: 'enter valid password'
            })
        }
        else {
            User.findOne({ $or: [{ phoneNumber: reqRegister.phoneNumber }, { email: reqRegister.email }] })
                .then(user => {
                    if (user) {
                        if (bcrypt.compareSync(req.body.password, user.password)) {
                            const payload = {
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                phoneNumber: user.phoneNumber,
                                position: user.position,
                                department:user.department
                            }
                            let tok = jwt.sign(payload, process.env.SECRET_KEY || 'secretnehvaida', {
                                expiresIn: 14400
                            })
                            res.status(200).json({ status: "success", token: `Bearer ${tok}` })

                        } else {
                            // Passwords don't match
                            res.json({ error: 'Email Or password is wrong' })
                        }
                    } else {
                        res.json({ error: 'User does not exist ' })
                    }
                })
                .catch(err => {
                    res.send('error: ' + err)
                })

        }
    }
}


const getUser = async(req, res)=>{
    let addon = req.user
    let err, user
 [err, user] =  await to (User.findOne({_id:addon._id} ) )
 if(err){
    return ReE(res, err, 500)
 }
 else if (user){
    return ReS(res, {
        message: 'Successfully Verified.',
        user: user
    }, 200)  
 }
else{
    return ReE(res, {message: 'Invalid OTP! or User.'}, 400)
}
    }

const update = (req, res) =>{
   
    let addon = req.user
    console.log(addon);
   
    User.findOne({_id:addon._id})
    .then(user =>{
        if(user.department){
            if(req.body.position){
                res.status(400).json({message:"u couldnt enter position if you are user"})
            }
            else{
            const userData ={
                name:req.body.name,
                department:req.body.department
            }
            User.updateOne({_id:addon._id}, {$set: userData})
            .then( data =>{
                res.status(200).json({message:data})
            })
            .catch(err =>{
                res.status(200).json({error:err})
            })

        }
        }
       else if(user.position){
        if(req.body.department){
            res.status(400).json({message:"u couldnt enter dept if you are admin"})
        }
        else{
           const adminData={
               name:req.body.name,
               position:req.body.position
           }
           User.updateOne({_id:addon._id}, {$set: adminData})
           .then( data =>{
               res.status(200).json({message:data})
           })
           .catch(err =>{
               res.status(200).json({error:err})
           })
        }}
    })
    .catch(err =>{
        res.status(500).json({msg:"cant find", error:err})
    })


}
module.exports = {
    create: register,
    getAll: getAll,
    getUser:getUser,
    update:update,
    deleteUser: deleteUser,
    login: login
}