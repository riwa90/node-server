/**
 * Controller for all MTTQ-calls
 */
class MQTTController {
    constructor(mqttHandler) {
        this.mqttHandler = mqttHandler;
    }

    publish(msg){
        this.mqttHandler.publishOneMessage(msg);
    }
    sub(){
        this.mqttHandler.sub();
    }

    statusOnDevice(){
        return this.mqttHandler.deviceConnected();
    }
}

module.exports = MQTTController;