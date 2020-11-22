let validMessage = msg => typeof(msg) === "string" && msg.length <= 150;

exports.validMessage = validMessage;

exports.validContactInfo = contactInfo => {
    if(validMessage(contactInfo)) {
        return contactInfo.length <= 90;
    }
    return false;
}

exports.validQuery = query => {
    return query === "true" || query === "false";
}

exports.parseParameters = req => {   
    return {
        "msg": req.body.msg,
        "contact": req.body.contact,
        "trash": req.query.trash,
        "display": req.query.display,
        "read": req.query.read,
        "swedish": req.query.swedish,
        "id": req.params.id,
        "password": req.body.password
    }
}

exports.responseOk = res => !(res instanceof Error);

exports.handleResponseWithoutMsg = (res, dbRes) => {
    if(this.responseOk(dbRes)) {
        this.send201Res(res);
    } else {
        this.send500Res(res);
    }
}

exports.removeSwedishLetters = letter => {
    if(letter === 'å' || letter === 'ä') {
        return 'a';
    } else if (letter === 'ö') {
        return 'o';
    }
    return letter;
}

exports.send201Res = res => {
    res.status(201).send();
};

exports.send400Res = res => {
    res.status(400).end();
};

exports.send500Res = (res) => {
    res.status(500).send("Service temporarily down.");
}

exports.send200Res = (res, msg) => {
    if(msg) {
        res.status(200).send(msg);
    } else {
        res.status(200).send("No message available.");
    }
}