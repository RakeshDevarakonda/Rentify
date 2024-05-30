export const routecheckcontoller=(req,res,next)=>{
    try {
        res.send("authorized");
      } catch (error) {
        console.log(error);
      }
}