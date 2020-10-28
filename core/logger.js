// const fs = require('fs');
const type_info = ["\x1b[34m[INFO]", "\x1b[32m[SUCCESS]", "\x1b[33m[WARNING]", "\x1b[31m[ERROR]", "\x1b[35m[DEBUG]", "\x1b[95m[VERBOSE]"];
const type_file = ["[INFO]", "[SUCCESS]", "[WARNING]", "[ERROR]", "[DEBUG]", "[VERBOSE]"];

module.exports = {
    log: function(trigger, message) {
        console.log("\x1b[90m[" + new Date().toLocaleTimeString() + "]\x1b[96m[" + trigger + "]"+ type_info[0] +" \x1b[0m" + message);
        return 1;
    },
    error: function(trigger, message) {
        console.log("\x1b[90m[" + new Date().toLocaleTimeString() + "]\x1b[96m[" + trigger + "]"+ type_info[3] +" \x1b[0m" + message);
        return 1;
    },
    debug: function(trigger, message) {
        console.log("\x1b[90m[" + new Date().toLocaleTimeString() + "]\x1b[96m[" + trigger + "]"+ type_info[4] +" \x1b[0m" + message);
        return 1;
    }
}