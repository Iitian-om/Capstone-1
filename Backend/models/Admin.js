import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    // Admin's full name (required)
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Admin's email must be unique and lowercase (required)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /@iitp\.ac\.in$/ // Ensure email ends with '@iitp.ac.in'
    },
    // Admin's password (required)
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate: {
            validator: function(v) {
                return /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
            },
            message: props => `${props.value} is not a valid password!`
        }
    },
    // Role of the admin, can be 'admin' or 'superadmin' (default is 'admin')
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin'
    },
    // Date when the admin account was created (default is the current date)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to hash the password before saving the admin document
adminSchema.pre('save', async function(next) {
    // Check if the password field is modified
    if (!this.isModified('password')) {
        return next();
    }
    // Generate a salt with a factor of 7 to reduce computation time
    const salt = await bcrypt.genSalt(7);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;