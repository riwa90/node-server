
class SqlQueryConstructor {
    constructor() {
        this.sqlStart = "{\n	\"commands\": \"";
        this.sqlEnd = "\",\n	\"limit\": \"10\",\n	\"separator\": \";\",\n	\"stop_on_error\": \"yes\"\n}";
        this.schemaName = "DZM72098"; 
    }

    createSelect(table, display) {
        let isDisplayQuery = this.hasParameter(display);
        let sqlQuery = this.sqlStart + "SELECT * FROM " + this.schemaName + "." + table;
        if(isDisplayQuery) {
            sqlQuery += " WHERE displayed='true'";
        }
        sqlQuery += this.sqlEnd;
        return sqlQuery;
    }

    createInsert(table, msg, contact) {
        let hasContactInfo = this.hasParameter(contact);
        let sqlQuery = this.sqlStart + "INSERT INTO " +  this.schemaName + "." + table + " (\\\"MESSAGE\\\"";
        if(hasContactInfo) {
            sqlQuery  += ", \\\"CONTACTINFORMATION\\\"";
        }
        sqlQuery += ")VALUES ('" + msg; 
        if(hasContactInfo) {
            sqlQuery += "', '" + contact;
        }
        sqlQuery += "')" + this.sqlEnd;
        return sqlQuery;
    }

    createDelete(table, id) {
        let hasId = this.hasParameter(id);
        let sqlQuery = this.sqlStart + "DELETE FROM " + this.schemaName + "." + table + " WHERE ";
        if(hasId) {
            sqlQuery += "id=" + id;
        } else {
            sqlQuery += "trash='true'";
        }
        sqlQuery += this.sqlEnd;
        return sqlQuery;
    }

    createUpdate(table, display, trash, read, id) {
        let hasId = this.hasParameter(id);
        let sqlQuery = this.sqlStart + "UPDATE " + this.schemaName + "." + table + " SET ";
        sqlQuery += this.createUpdateSetVariables(display, trash, read);
        if(hasId) {
            sqlQuery += " WHERE id=" + id;
        }
        sqlQuery += this.sqlEnd;
        return sqlQuery;
    }

    createUpdateSetVariables(display, trash, read) {
        let hasRead = this.hasParameter(read);
        let hasTrash = this.hasParameter(trash);
        let hasDisplay = this.hasParameter(display);
        let returnString = "";
        if(hasRead) {
            returnString += "\\\"hasBeenRead\\\"='" + read + "'";
        } else if(hasDisplay) {
            returnString += "displayed='" + display + "'";
        }
        if(hasTrash) {
            if(hasRead ||hasDisplay) {
                returnString += ", ";
            }
            returnString += "trash='" + trash + "'";
        }
        return returnString;
    }

    hasParameter(parameter) {
        return parameter != undefined;
    }
}

module.exports = new SqlQueryConstructor;