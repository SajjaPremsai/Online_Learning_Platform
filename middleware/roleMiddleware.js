const roleMiddlware = (allowedRoles)=>{
    return (req, res, next)=>{
        try{
            if(!req.user){
                return res.status(401).json({
                    messgae: "Unauthorized Access"
                })
            }
            if(!allowedRoles.includes(req.user.role)){
                return res.status(403).json({
                    message: "Forbidden Access"
                })
            }
            next();
        }catch(error){
            res.status(500).json({
                error: "Internal Sever Error"
            })
        }
    }
}

export default roleMiddlware
