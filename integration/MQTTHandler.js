//IBM-SETTINGS
let Client = require('ibmiotf').IotfApplication
const ORG_ID = "t0rlt9";
const ACCESS_TOKEN = "HUEP1)@55r-CG!Fi)m";
const IBM_DOMAIN = "internetofthings.ibmcloud.com";
const IBM_APP_ID = "webbApplication";
const IBM_AUTH_KEY = "a-t0rlt9-6j2qahxcpl";
const TYPE = "shared";
const DEFAULT_DEVICE_ID = "0";
const DEFAULT_DEVICE_TYPE = "IBM-KTH";
const MESSAGE_FROM_WEBBAPP = "MESSAGE_FROM_WEBBAPP";
const MESSAGE_FORMAT = "JSON";
const QOS_LEVEL = "1";
//Logging
const winston = require('winston');


const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: './logs/MQTTHandler.log'
        })
    ]
};

//Creates config for IBM connection
const configIBM  = {
    "org": ORG_ID,
    "id": IBM_APP_ID,
    "auth-key": IBM_AUTH_KEY,
    "auth-token": ACCESS_TOKEN,
    "type" : TYPE,
    "DeviceType": DEFAULT_DEVICE_TYPE,
    "DeviceID": DEFAULT_DEVICE_ID
};

//Creates new client
let appClient =  new Client(configIBM);

//Creates logger.
const logger = winston.createLogger(logConfiguration);


function convertPayloadToJSON(payload){
    if(payload)
        return JSON.parse(payload);
}


/**
 * Handles MQTT Requests
 *
 * EXAMPLE ON HOW TO USE
 * ( DEFAULT_DEVICE_TYPE = IBM_KTH
 *   DEFAULT_DEVICE_ID = 0 )
 * let MQTTHandler = require('./_PATH_TO_/MQTTHandler');
 * let appClient = new MQTTHandler();
 *
 * Subscribe and retrieve messages
 *    appClient.sub(function(result){
 *      console.log(result);
 *    });
 *
 *
 * Publish messages
 *  appClient.publish("message_to_publish");
 */
class MQTTHandler {
    constructor() {

        appClient.connect();
        let time = this.getCurrentTimeString();
        logger.info({
            METHOD: 'MQTTHandler(constructor)',
            DATE: this.getCurrentDateString(),
            TIME: this.getCurrentTimeString()
        });
    }

    /**
     * Publish a message to IBM on standard device
     * Event Name: MESSAGE_FROM_WEBBAPP
     * Payload: "MESSAGE": "message_from_webbapp"
     * Format: JSON
     * @param message
     */
    publishOneMessage(message) {
        try {
            appClient.connect();
        } catch (err) {
            logException("publishOneMessage", err);
        }
        appClient.on('connect', () => {
            try {
                let myData = {MESSAGE: message};
                appClient.publishDeviceEvent(DEFAULT_DEVICE_TYPE, DEFAULT_DEVICE_ID, MESSAGE_FROM_WEBBAPP, MESSAGE_FORMAT, myData, QOS_LEVEL);
                logPublishOneMessage(DEFAULT_DEVICE_TYPE, DEFAULT_DEVICE_ID, MESSAGE_FROM_WEBBAPP, MESSAGE_FORMAT, myData, QOS_LEVEL);
            } catch (err) {
                logException("publishOneMessage", err);
            }
        });
    }

    /**
     * Publish message to a specific device.
     * @param device_id
     * @param message
     * @returns {Promise<void>}
     */
    async publishToOneDevice(device_id, message) {
        if (message == false || device_id < 0) {
            logFailedToPublish(device_id, message);
            return;
        }
        await appClient.connect();
        appClient.on('connect', () => {
            let myData = {MESSAGE: message};
            appClient.publishDeviceEvent(DEFAULT_DEVICE_TYPE, device_id, MESSAGE_FROM_WEBBAPP, MESSAGE_FORMAT, myData, QOS_LEVEL);
            logger.info({
                METHOD: 'publishToOneDevice',
                DEVICE_TYPE: DEFAULT_DEVICE_TYPE,
                device_id: device_id,
                MESSAGE_FROM_WEBBAPP: MESSAGE_FROM_WEBBAPP,
                FORMAT: MESSAGE_FORMAT,
                myData: myData
            });
        });
    }

    /**
     * Publish message to a list of devices
     * @param devices that will receive message
     * @param message to be send
     * @returns {Promise<void>}
     */
    async publishToListOfDevices(devices, message) {
        for (const device of devices) {
            await this.publishToOneDevice(device, message);
        }
        logPublishToListOfDevices(devices, message);
    }


    /**
     * Subscribes to device events and will make a callback if a new
     * device event is received.
     * @param callback to the call with status
     */
    async sub(callback) {
        setTimeout(function () {
            appClient.connect();
            appClient.on('connect', () => {
                appClient.subscribeToDeviceEvents(DEFAULT_DEVICE_TYPE);
            });

            appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
                let myObj = convertPayloadToJSON(payload);
                let messageValue = (Object.values(myObj)[0]);
                callback(messageValue);
            })
        }, 5000);

    }

    /**
     * Returns status on default device connection to IBM
     * @param callback
     */
    deviceConnected(callback) {
        setTimeout(function () {
            appClient.connect();
            appClient.on('connect', () => {
                appClient.subscribeToDeviceStatus(DEFAULT_DEVICE_TYPE, DEFAULT_DEVICE_ID);
            });

            appClient.on("deviceStatus", function (deviceType, deviceId, payload, topic) {
                let myObj = convertPayloadToJSON(payload);
                //let myObj = JSON.parse(payload);
                let status = Object.values(myObj)[0];
                if (status == "FailedConnect") {
                    logDeviceStatus(deviceType, deviceId, "FailedConnect");
                } else {
                    logDeviceStatus(deviceType, deviceId, payload);
                    callback(status);
                }
            });
        }, 5000);
    }

    /**
     * Disconnects the device from IBM-Cloud.
     * Logs the event.
     */
    disconnectDevice() {
        appClient.disconnectDevice();
        logger.info({
            METHOD: disconnectDevice,
            MESSAGE: "Disconnect appClient",
            DATE: this.getCurrentDateString(),
            TIME: this.getCurrentTimeString()
        });
    }


    /**
     **********Time FUNCTIONS**********
     **/


    /**
     *
     * @returns {string} with Current Date
     */
    getCurrentDateString() {
        return new Date().toLocaleDateString();
    }


    /**
     *
     * @returns {number} with current Hour
     */
    getCurrentHour() {
        return new Date().getHours();
    }


    /**
     *
     * @returns {number} with current minutes
     */
    getCurrentMinutes() {
        return new Date().getMinutes();
    }


    /**
     *
     * @returns {number} with current seconds
     */
    getCurrentSeconds() {
        return new Date().getSeconds();
    }

    /**
     *
     * @returns {string} with current time stamp in form:
     * hh:mm:ss
     */
    getCurrentTimeString() {
        let hh = this.getCurrentHour();
        let mm = this.getCurrentMinutes();
        let ss = this.getCurrentSeconds();
        return (hh + ":" + mm +
            ":" + ss);
    }
}

    /**
     **********LOG FUNCTIONS**********
     **/

    /**
     * Logs message that will be publish.
     * @param deviceType - type of the IOT
     * @param deviceId - id of the IOT
     * @param messageFrom - who sent the message
     * @param messageFormat - Format of the message
     * @param message - message
     * @param QoSLevel - QoS on the message.
     */
function logPublishOneMessage(deviceType, deviceId, messageFrom, messageFormat ,message, QoSLevel ){
    logger.info(
        "PUBLISH: " +
        "DEFAULT_DEVICE_TYPE: + " + deviceType + " " +
        "DEFAULT_DEVICE_ID: + " + deviceId + " " +
        "MESSAGE_FROM_WEBBAPP: + " + messageFrom + " " +
        "MESSAGE_FORMAT: + " + messageFormat + " " +
        "myData: + " + message + " " +
        "QOS_LEVEL:" + QoSLevel
    );
}


    /**
     * Logs exception
     * @param methodName
     * @param exception
     */
function logException(methodName, exception){
    logger.info({
        METHOD: methodName,
        MESSAGE: "Disconnect appClient",
        EXCEPTION: exception
        });
    }

    /**
     * Logs all devices that receive a message
     * @param devices that will receive message
     * @param message message to be send
     */
function logPublishToListOfDevices(devices, message){
    logger.info({
        method: 'publishToListOfDevices',
        devices: devices,
        message: message,
    });
}

    /**
     * Log status on device connection
     * @param deviceType
     * @param deviceId
     */
function logDeviceStatus(deviceType, deviceId, payload){
    logger.info({
        METHOD: "disconnectDevice",
        MESSAGE: "deviceConnected",
        DEVICE_TYPE: deviceType,
        DEVICE_ID: deviceId,
        PAYLOAD: payload
    });
}

function logFailedToPublish(methodName, device_id, message) {
    logger.info({
        METHOD: methodName,
        MESSAGE: "message",
        DEVICE_TYPE: device_id,
        DEVICE_ID: deviceId,
        PAYLOAD: payload
    });
}
module.exports = MQTTHandler;