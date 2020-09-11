const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IssuesSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    issueType:{
        type: String,
        enum:['No Internet', 'Slow Internet', 'System Maintainence']
    },
    Location:{
        type:String,
        enum:['lab-1', 'lab-2', 'lab-3']
        
    },
    description:{
        type:String,
    
    },
    InquiryStatus:{
        type: String,
        enum:['Not Assigned', 'In Progress', 'Assigned'],
        default: 'Not Assigned'
        
    },
    taskAssignedTo:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})

module.exports = mongoose.model('issue', IssuesSchema)