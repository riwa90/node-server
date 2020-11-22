// Initiering
const express = require('express');
let router = express.Router();
let util = require('./RouterUtil');
let controllers = require('../controller/ControllerCreator');
let {dbcontr} = controllers.getControllers();

// '/' endpoint
router
    .route('/')
    .get(async (req, res) => {
        let responseMsg = await dbcontr.retrieveVisitorMsg();
        if(util.responseOk(responseMsg)) {
            util.send200Res(res, responseMsg);
        } else {
            util.send500Res(res);
        }
    })
    .post(async (req, res) => {
        let {msg, contact} = util.parseParameters(req);
        if(util.validMessage(msg)) {
            let dbRes = await dbcontr.storeVisitorMsg(msg, contact);
            util.handleResponseWithoutMsg(res, dbRes);
        } else {
            util.send400Res(res);
        }
    })
    .delete(async (req, res) => {
        let dbRes = await dbcontr.deleteVisitorMsg();
        util.handleResponseWithoutMsg(res, dbRes);
    })
    .put(async (req, res) => {
        let {trash, read} = util.parseParameters(req);
        if(util.validQuery(trash) || util.validQuery(read)) {
            let dbRes = await dbcontr.updateVisitorMsg(trash, read);
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
        let dbRes = await dbcontr.deleteVisitorMsgById(id);
        util.handleResponseWithoutMsg(res, dbRes);
    })
    .put(async (req, res) => {
        let {id, read, trash} = util.parseParameters(req);
        if(util.validQuery(trash) || util.validQuery(read)) {
            let dbRes = await dbcontr.updateVisitorMsgById(id, trash, read);
            util.handleResponseWithoutMsg(res, dbRes);
        } else {
            util.send400Res(res);
        }
    });

module.exports = router;