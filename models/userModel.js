const mongoose = require('mongoose')

const scheme = mongoose.Schema;

const userSchema = new scheme({
    name:{
        type: String,
        required: true,
        minlength:[5, 'Name is too short'],
        maxlength:[15, 'Name is too Long']
    },
    email:{
        type:String,
        required: true
    },
    phoneNumber:{
        type: String,
        required:true,
        unique: true,
        min:[10, 'phone number is too short'],
        max:[13]
    },
    password:{
        type: String,
        required:true,
        minlength:[8,'password is too short!']
    },
    department:{
        type: String,
        enum: ['BCA','CS','IT'],
    
    },
    position:{
        type: String,
        enum:['A','B'],
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    usertype:{
        type:String
    }
    
})
module.exports= mongoose.model('user', userSchema);


