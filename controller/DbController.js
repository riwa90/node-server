
class DbController {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    /** DISPLAYMSG */
    async storeDisplayMsg(msg) {
        let wait = await this.markAllDisplayMsgAsNonDisplayed();
        let returnmsg = await this.dbHandler.storeDisplayMsg(msg);
        return returnmsg;
    }

    async retrieveDisplayMsg(display) {
        return this.dbHandler.retrieveDisplayMsg(display);
    }

    async deleteDisplayMsg(){
        let returnmsg = await this.dbHandler.deleteDisplayMsg();
        return returnmsg;
    }

    async updateDisplayMsg(trash, display){
        let returnmsg = await this.dbHandler.updateDisplayMsg(display, trash);
        return returnmsg;
    }

    // '/id' endpoint

    async updateDisplayMsgById(id, trash, display) {
        if(display == "true") {
            let wait = await this.markAllDisplayMsgAsNonDisplayed();
        }
        let returnmsg = await this.dbHandler.updateDisplayMsg(display, trash, id);
        return returnmsg;
    }

    async deleteDisplayMsgById(id) {
        let returnmsg = await this.dbHandler.deleteDisplayMsg(id);
        return returnmsg;
    }

    /** VISTORMSG */

    async storeVisitorMsg(msg, contact) {
        let returnmsg = await this.dbHandler.storeVisitorMsg(msg, contact);
        return returnmsg;
    }

    async retrieveVisitorMsg() {
        return this.dbHandler.retrieveVisitorMsg();
    }

    async updateVisitorMsg(trash, read) {
        let returnmsg = await this.dbHandler.updateVisitorMsg(read, trash);
        return returnmsg;
    }

    async deleteVisitorMsg() {
        let returnmsg = await this.dbHandler.deleteVisitorMsg();
        return returnmsg;
    }

    // '/id' endpoint

    async updateVisitorMsgById(id, trash, read) {
        let returnmsg = await this.dbHandler.updateVisitorMsg(read, trash, id);
        return returnmsg;
    }
    
    async deleteVisitorMsgById(id) {
        let returnmsg = await this.dbHandler.deleteVisitorMsg(id);
        return returnmsg;
    }

    // Private

    async markAllDisplayMsgAsNonDisplayed() {
        await this.dbHandler.updateDisplayMsg("false");
    }
}

module.exports = DbController;