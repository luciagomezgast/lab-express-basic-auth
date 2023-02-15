module.exports= (req, res, next)=>{
    if(req.session.currentUser) res.render('main');
    else next()
}