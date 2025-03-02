const mongoose = require('mongoose'); // imporation de mongoose
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    role: {
        type: String,
        enum: ["admin", "client"],
        default: "client"
    },
    user_image: { type: String, required: false, default: 'client.png' },

    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reservation' }],
    etat: Boolean,

}, { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        const user = this;
        user.etat = false;
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.post("save", async function (req, res, next) {
    console.log(" new user was created & saved successfully")
})

userSchema.statics.login = async function name(email, password) {
    
        const user = await this.findOne({email});
        if (user) {

            const auth = await bcrypt.compare(password, user.password)
            if (auth) {
                //if (user.etat === true) {
                    return user ;
                //} else {
                   // throw new Error("Compte desactivé ")
                

            } else {
                throw new Error("password invalid");
            }

        }else {
            throw new Error("email not found ");
        }

   

}

const User = mongoose.model('User', userSchema);
module.exports = User;
