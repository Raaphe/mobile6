"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserEmail = setUserEmail;
exports.setUserPassword = setUserPassword;
exports.setUserUsername = setUserUsername;
exports.setUserProfilePic = setUserProfilePic;
exports.getUserByUsernameOrEmailAndPassword = getUserByUsernameOrEmailAndPassword;
exports.getUserByUsernameAndPassword = getUserByUsernameAndPassword;
exports.getUserByUsernameOrEmail = getUserByUsernameOrEmail;
exports.createUser = createUser;
exports.getUserById = getUserById;
exports.updateUserProfile = updateUserProfile;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// -----------------------------------------          Config          ----------------------------------------------
dotenv_1.default.config();
const pool = mysql2_1.default.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();
// -----------------------------------------         Queries         ----------------------------------------------
function setUserEmail(userId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`UPDATE users SET email=${email} where id=${userId}`);
    });
}
function setUserPassword(userId, pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`UPDATE users SET password=${pwd} where id=${userId}`);
    });
}
function setUserUsername(userId, username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`UPDATE users SET username=${username} where id=${userId}`);
    });
}
function setUserProfilePic(userId, profilePic) {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`UPDATE users SET profilePic=${profilePic} where id=${userId}`);
    });
}
function getUserByUsernameOrEmailAndPassword(usernameOrEmail, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query(`SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?;`, [usernameOrEmail, usernameOrEmail, password]);
            return rows.length > 0 ? rows[0] : null;
        }
        catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    });
}
function getUserByUsernameAndPassword(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query(`SELECT * FROM users WHERE username=${username} and password=${password}`);
            return rows.length > 0 ? rows[0] : null;
        }
        catch (e) {
            console.error("Database Error:", e);
            throw e;
        }
    });
}
function getUserByUsernameOrEmail(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield pool.query(`SELECT * FROM users WHERE username=? OR email=?`, [username, email]);
            return rows.length > 0 ? rows[0] : null;
        }
        catch (e) {
            console.error("Database Error:", e);
            throw e;
        }
    });
}
function createUser(email, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        //DEBUG
        console.log(`Database : creating user with email: ${email}, username: ${username} and password : ${password}`);
        //
        const query = yield pool.query(`INSERT INTO users (username,email,password) VALUES (?,?,?);`, [username, email, password]);
        const [rows] = yield pool.query(`SELECT id, username, email FROM users WHERE username=? and email=?`, [username, email]);
        return rows.length > 0 ? rows[0] : null;
    });
}
// --------------------------------------   New ----------------------------------
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        //Renvoi toutes les informations de l'utilisateur avec cet id
        //DEBUG
        console.log(`Database : get users by Id : ${id}`);
        const [rows] = yield pool.query("SELECT * FROM users WHERE id=?", id);
        return rows;
        //    
    });
}
function updateUserProfile(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(userData.username === null || userData.username === "" || userData.username === undefined)) {
            yield setUserUsername(userData.id, userData.username);
        }
        if (!(userData.email === null || userData.email === "" || userData.email === undefined)) {
            yield setUserPassword(userData.id, userData.email);
        }
        if (!(userData.password === null || userData.password === "" || userData.password === undefined)) {
            yield setUserPassword(userData.id, userData.password);
        }
        if (!(userData.profilePic === null || userData.profilePic === "" || userData.profilePic === undefined)) {
            yield setUserProfilePic(userData.id, userData.profilePic);
        }
    });
}
// -----------------------------------------          Tests          ----------------------------------------------
//DEBUG
// const user = await createUser("drago123@gmail.com","Drago Malefoy", 'bully');
// console.log(user)
// const user = await getUserById(77)
// console.log(user)
// const user = await updateUserProfile({id:77,username:"Bob",email:"jean",profilePic:"chiot4"})
