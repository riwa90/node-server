let dbhandler = require('../integration/DbHandler');
let dbcontroller = require('./DbController');
let dbcontr = new dbcontroller(new dbhandler());
let mqtthandler = require('../integration/MQTTHandler');
let mqttcontroller = require('./MQTTController');
let mqttcontr = new mqttcontroller(new mqtthandler());

exports.getControllers = () => {
    return {
        "dbcontr": dbcontr, 
        "mqttcontr": mqttcontr
    }
};
