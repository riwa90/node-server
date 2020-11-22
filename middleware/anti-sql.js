// Requires a json request body.

// Find sql comments (--), ending of a string and closing the statement (')), end statement (;) 
// and String end followed by whitespace ('\s).
let sqlRegex = /--|\'\)|;|\'\s|\'\=/;

let containsSql = function(msgString) {
    return sqlRegex.test(msgString);
}

module.exports = (req, res, next) => {
    let bodyString = JSON.stringify(req.body);
    let urlString = req.originalUrl;
    
    if(containsSql(urlString)) {
        res.status(403).end();
        return;
    }

    if(containsSql(bodyString)) {
        res.status(403).end();
        return;
    }

    next();
}
