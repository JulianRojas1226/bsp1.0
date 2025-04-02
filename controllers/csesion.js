import error from "../middwlare/err.js";
const csescion = {
    getsesion: async (req, res) => {
        try {
          res.render("sesion");  
        } catch (err) {
          error.e500(req, res, err);
        }
      },
}
export default csescion