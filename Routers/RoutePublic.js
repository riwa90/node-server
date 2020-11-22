// Initiering
const express = require('express');
let router = express.Router();
let util = require('./RouterUtil');
let loginUtil = require('../util/appLoginSetup');
let controllers = require('../controller/ControllerCreator');
let {dbcontr} = controllers.getControllers();

// Endpoint för att hämta nuvarande displaymeddelandet.
router
    .route('/api/displaymsg')
    .get(async (req, res) =>{
        let responseMsg = await dbcontr.retrieveDisplayMsg('true');
        let {swedish} = util.parseParameters(req);
        if(util.responseOk(responseMsg)) {
            if(responseMsg.rows == false) {
                util.send200Res(res);
            } else {
                let responseText = responseMsg.rows[0][1] + ";" + responseMsg.rows[0][2];
                if(swedish != "true") {
                    responseText = responseText.split("").map(util.removeSwedishLetters).join("");
                }
                util.send200Res(res, responseText);
            }
        } else {
            util.send500Res(res);
        }
    });

// Endpoint för att lämna visitormsg
router
    .route('/api/visitormsg')
    .post(async (req, res) => {
        let {msg, contact, password} = util.parseParameters(req);
        if(password != "grupp9") {
            res.status(403).end();
        } else if(util.validMessage(msg)) {
            let dbRes = await dbcontr.storeVisitorMsg(msg, contact);
            util.handleResponseWithoutMsg(res, dbRes);
        } else {
            util.send400Res(res);
        }
    })

// Endpoint för att logga ut.
router
    .route('/logout')
    .get(loginUtil.logoutFunction);

module.exports = router;