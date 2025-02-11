const hash = require("bcryptjs");
 
const hashPassword = (key) => {
    const passwordHash = hash.hashSync(key, 8)
    return passwordHash;
};

module.exports = hashPassword;