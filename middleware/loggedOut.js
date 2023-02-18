module.exports= (req, res, next)=>{
    if(req.session.currentUser) res.render('login');
    else next()
}