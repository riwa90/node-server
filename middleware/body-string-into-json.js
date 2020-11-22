module.exports = (req, res, next) => {
    if(typeof(req.body) == "string") {
        req.body = JSON.parse(req.body);
        if(typeof(req.body) == "string") {
            req.body = JSON.parse(req.body);
        }
    }
    next();
}