import mongoose from 'mongoose';
// Import bcrypt for password hashing
import bcrypt from 'bcryptjs';

// Define the User schema
const UserSchema = new mongoose.Schema({
  // User's first name (required)
  firstName: {
    type: String,
    required: true
  },
  // User's last name (optional, defaults to an empty string)
  lastName: {
    type: String,
    default: ''
  },
  // Unique username with a users and moderstor files and  maximum length of 15 characters (required)
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15
  },
  // User's email must end with '@iitp.ac.in' and be unique (required)
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@iitp\.ac\.in$/
  },
  // User's password with a minimum length of 7 characters, containing at least one uppercase letter, one lowercase letter, and one number (required)
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
  // Role of the user, can be 'user' or 'teacher' (default is 'user')
  // Note: Official roles ('moderator', 'manager') are not assigned by users
  role: {
    type: String,
    enum: ['user', 'teacher'],
    default: 'user'
  },
  // Full name of the user, automatically set as "FirstName LastName"
  fullName: {
    type: String
  },
  // URL or path to the profile image (optional)
  profileImage: {
    type: String
  },
  // User's bio can be a paragraph with a maximum of 70 characters (optional)
  bio: {
    type: String,
    maxlength: 70
  },
  // Official roles for moderator and manager (not visible to users on registartion time)
  // This role is not assigned by users, only by the system or official Team.
  officialRole: {
    type: String,
    enum: ['moderator', 'manager'],
    default: null
  },
  // Admin role only for the most powerful user(HEAD of APP), only one person can hold this role at a time (not visible to users via registration)
  // This role is not assigned by users, only by the system.
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Middleware to hash the password before saving the user document
UserSchema.pre('save', async function(next) {
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

// Middleware to set the full name before saving the user document
UserSchema.pre('save', function(next) {
  // Concatenate first name and last name to form the full name
  this.fullName = this.lastName ? `${this.firstName} ${this.lastName}` : this.firstName;
  next();
});
// Store the user in the database
const User = mongoose.model('User', UserSchema);
// Export the User model
export default User;