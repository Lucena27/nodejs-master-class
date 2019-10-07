function log(req, res, next){
    console.log("Loggin :)", req);
    next();
}

module.exports = log;