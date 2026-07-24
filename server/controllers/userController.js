import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// Singup a new user


export const signup = async (req, res)=>{
    const { fullName, email, password, bio} = req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message })
    }
}

// Contorller to login a user
export const login = async (req, res)=>{
    try {
        const { email, password} = req.body;
        const userData = await User.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"})
        }

         const token = generateToken(newData._id)

        res.json({success: true, userData, token, message: "Login successfully" })
    } catch (error) {
         console.log(error.message);
        res.json({success: false, message: error.message })
    }
}


// controlller to check is authenticated

export const checkAuth = (req, res)=>{
    res.json({success:true, user: req.user});
}


// controller to update profile details 

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        console.log("Step 1: Request received");

        let updatedUser;

        if (!profilePic) {
            console.log("Step 2: Updating without image");

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName, bio },
                { new: true }
            );
        } else {
            console.log("Step 2: Uploading image");

            const upload = await cloudinary.uploader.upload(profilePic);

            console.log("Step 3: Cloudinary success", upload.secure_url);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    fullName,
                    bio,
                },
                { new: true }
            );

            console.log("Step 4: MongoDB updated");
        }

        res.json({
            success: true,
            user: updatedUser,
        });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}