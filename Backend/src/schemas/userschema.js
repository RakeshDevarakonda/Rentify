import mongoose, { Schema } from 'mongoose';

// import validator from 'validator';

const userschema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        // validate: {
        //     validator: validator.isEmail,
        //     message: '{VALUE} is not a valid email address'
        //   }
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: String,
        required: true
    }
});

export const usercollections = mongoose.model('usercollections', userschema);
