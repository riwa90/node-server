// Initiering
const express = require('express');
let router = express.Router();
let util = require('./RouterUtil');
let controllers = require('../controller/ControllerCreator');
let {dbcontr, mqttcontr} = controllers.getControllers();

// '/' endpoint
router
    .route('/')
    .get(async (req, res) => {
        let responseMsg = await dbcontr.retrieveDisplayMsg();
        if(util.responseOk(responseMsg)) {
            util.send200Res(res, responseMsg);
        } else {
            util.send500Res(res);
        }
    })
    .post(async (req, res) => {
        let {msg} = util.parseParameters(req);
        if(util.validMessage(msg)) {
            let dbRes = await dbcontr.storeDisplayMsg(msg);
            util.handleResponseWithoutMsg(res, dbRes);
            if(util.responseOk(dbRes)) {
                mqttcontr.publish(msg);
            }
        } else {
            util.send400Res(res);
        }
    })
    .delete(async (req, res) => {
        let dbRes = await dbcontr.deleteDisplayMsg();
        util.handleResponseWithoutMsg(res, dbRes);
    })
    .put(async (req, res) => {
        let {trash, display} = util.parseParameters(req);
        if(util.validQuery(trash) || util.validQuery(display)) {
            let dbRes = await dbcontr.updateDisplayMsg(trash, display);
            util.handleResponseWithoutMsg(res, dbRes);
        } else {
            util.send400Res(res);
        }
    });

// '/id' endpoint
router
    .route('/:id')
    .delete(async (req, res) => {
        let {id} = util.parseParameters(req);
        let dbRes = await dbcontr.deleteDisplayMsgById(id);
        util.handleResponseWithoutMsg(res, dbRes);
    })
    .put(async (req, res) => {
        let {id, display, trash} = util.parseParameters(req);
        if(util.validQuery(trash) || util.validQuery(display)) {
            let dbRes = await dbcontr.updateDisplayMsgById(id, trash, display);
            util.handleResponseWithoutMsg(res, dbRes);
        } else {
            util.send400Res(res);
        }
    });
    
module.exports = router;