export const autenticado = (req,res,next)=>{
    if(req.session.usuario){
        console.log(req.session);
    return next()
    }
    res.redirect("/")
    }