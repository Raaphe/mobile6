import mysql from 'mysql2';
import dotenv from 'dotenv';


// -----------------------------------------          Config          ----------------------------------------------

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// -----------------------------------------         Queries         ----------------------------------------------


export async function getUserByUsernameOrEmailAndPassword(usernameOrEmail, password) {
    //DEBUG
    console.log(`Request with username/email : ${usernameOrEmail} and password : ${password}`)
    //
    const [users] = await pool.query(`SELECT * FROM users WHERE (username=? OR email=?) AND password=?;`,[usernameOrEmail,usernameOrEmail,password])
    
    
    return users[0];
} 

export async function getUserByUsernameAndPassword(username, password){
    //DEBUG
    console.log(`Request with username: ${username} and password : ${password}`)
    //
    const [rows] = await pool.query(`SELECT * FROM users WHERE username=? and password=?`,[username,password])
    return rows[0]
}

export async function getUserByUsernameOrEmail(identifier) {
    if (identifier.indexOf("@") !== -1) {
        return await pool.query(`select * from users where email=${identifier}`);
    }
    return await pool.query(`select * from users where username=${identifier}`);
}

export async function createUser(username, password, email) {
    [rows] = await pool.query(`INSERT INTO USERS (username, email, password) VALUES (${username}, ${email}, ${password}) `);
    console.log(rows);
    return rows;
    

}


// -----------------------------------------          Tests          ----------------------------------------------
//DEBUG
// const user = await getUserByUsernameOrEmailAndPassword("Harry Potter", 'iloveGinny');
// console.log(user)