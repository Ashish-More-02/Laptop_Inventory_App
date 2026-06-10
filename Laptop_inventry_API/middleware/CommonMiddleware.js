const jwt = require("jsonwebtoken");


// this middleware will check the jwt token for any request and then we can proceed with the request
const checkJWTtoken = async (req,res,next) =>{
    // this will hold the vlaue of auth header 
    const header = req.headers.authorization;
    
    if(!header){
        res.status(401).json({error:"Authorization headers not provided, please provide it with JWT token"});
    }

    // token conatin "Bearer <token_data>"
    const token = header.split(" ")[1];

    if(!token){
        res.status(401).json({error:"auth token not found !"});
    }

    // verify token using jwt.verify() method
    try{
        const UserPayload = jwt.verify(token, process.env.JWT_SECRET);

        // add the payload to the common 'request' object
        // note : UserPayload will only contain what we have put in token while creating it.
        // currently it only have UserId
        req.user = UserPayload;
        next();
    }
    catch(err){
        res.status(401).json({error:"unable to decode jwt token"})
    }
}

module.exports = {
    checkJWTtoken
}