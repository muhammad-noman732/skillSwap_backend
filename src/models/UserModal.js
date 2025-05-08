const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    googleId: {
        type: String,
        unique: true,
        sparse: true,
      },

      password: {
        type: String,
        required: function() {
          return !this.googleId; // Password required only for non-Google auth
        }
      },
    
    bio:{
        type:String,
    },
    location:{
        type: String,
        required: true
    },
        
})

const User = mongoose.model('User' , userSchema);
module.exports = User ;