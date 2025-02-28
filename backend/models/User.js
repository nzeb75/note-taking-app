const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
    },
    password: {
        type: String, 
        require: true,
    },
}, {timestamps: true});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(userPassword) {
    return bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);