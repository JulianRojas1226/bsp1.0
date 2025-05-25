
const cierre ={
    cierre:  (req,res) => {
        req.session.destroy(err=>{
            if (err){
                return res.status(500).send("error al cerrar sesion")
            }
            res.redirect("/")
        })
    }
}
export default cierre