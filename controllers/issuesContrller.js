const Issues = require('../models/issueModel')
const User = require('../models/userModel')

exports.create = (req, res) =>{
   let addon = req.user
   console.log(addon)
    User.findById(addon._id)
    .then(user =>{
        if(user.position){
            res.status(200).json({status:false, message:"Admin cant create issues"})
        }
        else if(user.department){
            let issues = {
                user:addon._id,
                issueType:req.body.issueType,
                Location:req.body.Location,
                description:req.body.description,
                InquiryStatus:req.body.InquiryStatus
            }
            Issues.create(issues)
            .then(data =>{
                res.status(200).json({status:"success", data:data, message:"Issue Created"})
            })
            .catch(err =>{
                res.status(200).json({status:"failed", error: err, message:"failed to create issue" })
            })
        }
    })

   
}

exports.getIssues = (req, res) =>{
    let addon = req.user
    User.findOne({_id:addon._id})
    .then(user =>{
        console.log(user)
        if(user.department){
            console.log('u r user')
            Issues.findOne({user:addon._id})
            .then(doc => {
                res.status(200).json({message:"fetched", doc:doc})
           
            }) .catch(err =>{
                
                res.status(400).json(err)
            })
        }
        else{
            Issues.find({})
            .then(data =>{
                res.status(200).json({message:"fetched", doc:doc})
            })
            .catch(err =>{
                res.status(400).json(err)
            })
        }
    })
}

exports.updateIssues = (req, res) =>{
    let addon = req.user
    User.findOne({_id:addon._id})
    .then(user =>{

        if(user.department){
            const userdata = {
                issueType:req.body.issueType,
                Location:req.body.Location,
                description:req.body.description,
                InquiryStatus:req.body.InquiryStatus
            }
            Issues.updateOne({user:addon._id},{$set:userdata})
            .then(doc => {
                res.status(200).json({message:"updated", doc:doc})
           
            }) .catch(err =>{
                
                res.status(400).json(err)
            })
        }
    else if(user.position){
        const admindata ={
            taskAssignedTo: addon._id,
            InquiryStatus:req.body.InquiryStatus

        }
        Issues.updateOne({user:req.body.user},{$set:admindata})
        .then(doc => {
            res.status(200).json({message:"updated", doc:doc})
       
        }) .catch(err =>{
            res.status(400).json(err)
        })
    }
    }).catch(err =>{
        res.status(500).json(err)
    })
}

exports.userPop = (req, res) =>{
    let addon = req.user
    console.log(addon);
    User.findOne({_id:addon._id})
    
    .then(user =>{

    
        if(user.department){
            Issues.findOne({user:addon._id})
            .populate('taskAssignedTo', ['name', 'position', 'phoneNumber'])
            .then(data =>{
                res.status(200).json({message:"fetched taskAssignedTo", doc:data})
            })
            .catch(err =>{
                res.status(400).json(err)
            })
            
        }
        else if(user.position){
            Issues.find({})
            .populate('user', ['name', 'department', 'phoneNumber'])
            .then(data =>{
                res.status(200).json({message:"fetched user", doc:data})
            })
            .catch(err =>{
                res.status(400).json(err)
            })
        }
}).catch(err =>{
    res.status(500).json(err)
})

}