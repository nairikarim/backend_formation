const mongoose = require('mongoose'); // imporation de mongoose
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    role: {
        type: String,
        enum: ["admin", "client", "partenaire"],
        default: "client"
    },
    user_image: { type: String, required: false ,default:'client.png'},
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.post("save",async function(req,res,next){
    console.log(" new user was created & saved successfully")
})
const User = mongoose.model('User', userSchema);
module.exports = User;
