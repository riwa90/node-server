var assert = require('assert');
let mqttHandler = require("../../integration/MQTTHandler");
let mqttTester;
let expect = require("expect");
var iotf = require('ibmiotf');
let appClient = new mqttHandler();

beforeEach(() => {
    jest.setTimeout(20000);
});

describe('Default settings', () => {
    it('testPublishOneMessage', done => {
        let messageToSend = "this_is_a_test_message";
        let answer = "";

        setTimeout(() => {
            appClient.sub(function (result) {
                answer = result;
                expect(answer).toBe(messageToSend);
                done();
            });

            //Let MQTT Handler connect to IBM
            sleep(5000);
            appClient.publishOneMessage(messageToSend);
        });
    });

    it('Device status', done => {
        let answer = "";
        let expectedValue = "Connect";

        appClient.deviceConnected(function (result) {
            answer = result;
            expect(answer).toBe(expectedValue);
            done();
        });

        sleep(5000);
        setUpDummyDevice();

    });

    it('publishToListOfDevices', done => {
        let messageToSend = "this_is_a_test_message";
        let devices = [0,1];
        let answer = "";

        setTimeout(() => {
            appClient.sub(function (result) {
                answer = result;
                expect(answer).toBe(messageToSend);
                done();
            });

            //Let MQTT Handler connect to IBM
            sleep(5000);
            appClient.publishToListOfDevices(devices, messageToSend);
        });
    });

});

function sleep(miliseconds) {
    let currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

function setUpDummyDevice(){
//Creates config for IBM connection
    const configIBM  = {
        "org": "t0rlt9",
        "domain": "internetofthings.ibmcloud.com",
        "type": "IBM-KTH",
        "id": "0",
        "auth-method": "token",
        "auth-token": "grupp9ii1302",
        "use-client-certs": false
    };

    let device = new iotf.IotfManagedDevice(configIBM);
    device.connect();

    device.on('connect', () => {
       // console.log("connect");
    });


};

