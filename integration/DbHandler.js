const fetch = require('node-fetch');
const sqlQuery = require('../util/SqlQueryConstructor');

class DbHandler {
    constructor() {
        this.dbUrl = 'https://dashdb-txn-sbox-yp-lon02-02.services.eu-gb.bluemix.net/dbapi/v4/';
        this.authToken = "";
        this.tokenExpireTime;
        this.tables = {
            display: "DISPLAYMESSAGE",
            visitor: "VISITORMESSAGE"
        };
        this.getAuthToken();
    }

    // Display messages
    /**
     * Stores a message in the Db2 database.
     * @param {*} msg Message to be stored.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async storeDisplayMsg(msg) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createInsert(this.tables.display, msg);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);

        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }

    /**
     * Delete displaymessages in the db2 database, either all marked as trash or of a specific id.
     * @param {*} id id of Message to remove. Omit to delete all trash marked.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async deleteDisplayMsg(id) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createDelete(this.tables.display, id);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }

    /**
     * Retrieves displaymessages from hte database. 
     * @param {*} displayed if messages retrieved should be marked for display.
     * @return Error if database didn't return a 2XX HTTP response, otherwise 
     * the retrieved display messages.
     */
    async retrieveDisplayMsg(displayed) {
        await this.validateAuthToken();
        let msgId = "";
        let retrievedMsg = {};
        let returnMsg = {};
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createSelect(this.tables.display, displayed);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .then(this.convertResponseToJson)
            .then(response => {msgId = response.id})
            .catch(() => {
                returnMsg = new Error();
            });
        
        if(returnMsg instanceof Error) {
            return returnMsg;
        }

        fetchUrl = fetchUrl + '/' + msgId;    
        requestOptions = this.createRequestOptions('GET', myHeaders);

        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .then(this.convertResponseToJson)
            .then(response => {retrievedMsg = response.results[0];})
            .catch(() => {
                returnMsg = new Error();
            });

        if(returnMsg instanceof Error) {
            return returnMsg;
        }

        returnMsg = {
            "columns" : retrievedMsg.columns,
            "rows" : retrievedMsg.rows 
        };

        return returnMsg;
    }

    /**
     * Update displaymessages as trash and/or displayed. Applied to all if no id is given.
     * @param {*} display true/false to set displayed column in database
     * @param {*} trash true/false to set trash column in database
     * @param {*} id id of message to update, omit to change all.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async updateDisplayMsg(display, trash, id) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createUpdate(this.tables.display, display, trash, undefined, id);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }

    //Visitor messages

    /**
     * Stores a visitormessage in the db2 database.
     * @param {*} msg The message to store.
     * @param {*} contactInfo Optional contact information to store in conjunction with the message.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async storeVisitorMsg(msg, contactInfo) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createInsert(this.tables.visitor, msg, contactInfo);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }

    /**
     * Delete a message from the database. Deletes all trash marked messages if no id is specified.
     * @param {*} id id of message to delete. Deletes all trash marked messages if omitted.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async deleteVisitorMsg(id) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createDelete(this.tables.visitor, id);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }

    /**
     * Retrieves visitormessages from database.
     * @return Error if database didn't return a 2XX HTTP response, 
     * otherwise the retrieved visitormessages.
     */
    async retrieveVisitorMsg() {
        await this.validateAuthToken();
        let msgId = "";
        let retrievedMsg = {};
        let returnMsg = {};
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createSelect(this.tables.visitor);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);

        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .then(this.convertResponseToJson)
            .then(response => {msgId = response.id})
            .catch(() => {
                returnMsg = new Error();
            });

        if(returnMsg instanceof Error) {
            return returnMsg;
        }

        fetchUrl = fetchUrl + '/' + msgId;    
        requestOptions = this.createRequestOptions('GET', myHeaders);

        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .then(this.convertResponseToJson)
            .then(response => {retrievedMsg = response.results[0];})
            .catch(() => {
                returnMsg = new Error();
            });

        if(returnMsg instanceof Error) {
            return returnMsg;
        }

        returnMsg = {
            "columns" : retrievedMsg.columns,
            "rows" : retrievedMsg.rows 
        };

        return returnMsg;
    }

    /**
     * Updates visitormessages read and trash field. if no message id is given, all messages are updated.
     * @param {*} read true/false to set read column in database
     * @param {*} trash true/false to set trash column in database
     * @param {*} id id of message to update. If omitted, applies updates to all messages.
     * @return Error if database didn't return a 2XX HTTP response
     */
    async updateVisitorMsg(read, trash, id) {
        await this.validateAuthToken();
        let returnVar;
        let fetchUrl = this.dbUrl + "sql_jobs";
        let myHeaders = this.createHeaders(true);
        let body = sqlQuery.createUpdate(this.tables.visitor, undefined, trash, read, id);
        let requestOptions = this.createRequestOptions('POST', myHeaders, body);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .catch(() => {
                returnVar = new Error();
            });
        return returnVar;
    }



    // Private functions

    // Authtokens

    async getAuthToken(){
        let fetchUrl = this.dbUrl + "auth/tokens";
        let myHeaders = this.createHeaders(false);
        let raw = "{\n	\"userid\": \"" + this.userId + "\",\n	\"password\": \"" + this.password + "\"\n}";
        let requestOptions = this.createRequestOptions('POST', myHeaders, raw);
        await fetch(fetchUrl, requestOptions)
            .then(this.checkHttpResponse)
            .then(this.convertResponseToJson)
            .then(response => {
                this.authToken = response.token;
                this.setTokenExpiration();
            }).catch(() => {
                this.tokenExpireTime = new Date(Date.now());
            });
    }

    setTokenExpiration() {
        let currentTime = new Date(Date.now());
        this.tokenExpireTime = currentTime.setHours(currentTime.getHours() + 5);
    }

    async validateAuthToken() {
        if(Date.now() > this.tokenExpireTime) {
            await this.getAuthToken();
        }
    }

    // Util functions

    convertResponseToJson(res) {
        return res.json();
    }

    createHeaders(needsToken) {
        let returnHeader = new fetch.Headers();
        returnHeader.append("Content-Type", "text/plain");
        if(needsToken) {
            returnHeader.append("Authorization", "Bearer " + this.authToken);
        }
        return returnHeader;
    }

    createRequestOptions(methodHttp, headersHttp, bodyHttp) {
        let requestOptions = {
            method: methodHttp,
            headers: headersHttp,
            redirect: 'follow'
        };

        if(bodyHttp) {
            requestOptions.body = bodyHttp;
        }
        
        return requestOptions;
    }

    checkHttpResponse(res) {
        if(res.ok) {
            return res;
        } else {
            throw new Error();
        }
    }
}

module.exports = DbHandler;