import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the Moderator schema
const ModeratorSchema = new mongoose.Schema({
  // Moderator's first name (required)
  firstName: {
    type: String,
    required: true
  },
  // Moderator's last name (required)
  lastName: {
    type: String,
    required: true
  },
  // Unique username with a maximum length of 15 characters (required)
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15
  },
  // Moderator's email must end with '@iitp.ac.in' and be unique (required)
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@iitp\.ac\.in$/
  },
  // Moderator's password with a minimum length of 7 characters, containing at least one uppercase letter, one lowercase letter, and one number (required)
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
  // Full name of the moderator, automatically set as "FirstName LastName"
  fullName: {
    type: String
  },
  // URL or path to the profile image (optional)
  profileImage: {
    type: String
  },
  // Moderator's bio can be a paragraph with a maximum of 70 characters (optional)
  bio: {
    type: String,
    maxlength: 70
  },
  // Moderator role (assigned by admin)
  role: {
    type: String,
    enum: ['moderator'],
    default: 'moderator'
  }
});

// Middleware to hash the password before saving the moderator document
ModeratorSchema.pre('save', async function(next) {
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

// Middleware to set the full name before saving the moderator document
ModeratorSchema.pre('save', function(next) {
  // Concatenate first name and last name to form the full name
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

// Export the Moderator model
module.exports = mongoose.model('Moderator', ModeratorSchema);