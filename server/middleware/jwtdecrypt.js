const jwt=require('jsonwebtoken');

const secretKey = 'secret-123';

export const ensureAuthenticated=(req,res,next)=>{
    const user=req.headers['authorization'];
    if(!auth){
        return res.status(403).json({message:'Unauthorized,JWT token is require'});
    }
    try {
        const decoded=jwt.verify(user,secrekey);
        req.user=decoded;
    } catch (error) {
        return req.status(403).json({message:'Unauthorized,JWT token wrong or expired'});
    }
}