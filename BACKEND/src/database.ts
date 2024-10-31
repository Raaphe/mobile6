import mysql, { QueryResult, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

export interface User extends RowDataPacket {
    id: number,
    username: string,
    email: string,
    password: string,
    profilePic: string,
}


// -----------------------------------------          Config          ----------------------------------------------

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// -----------------------------------------         Queries         ----------------------------------------------


export async function setUserEmail(userId: any, email: any) {
    await pool.query(`UPDATE users SET email=${email} where id=${userId}`);
}

export async function setUserPassword(userId: number, pwd: string) {
    await pool.query(`UPDATE users SET password=${pwd} where id=${userId}`);
}

export async function setUserUsername(userId: number, username: string) {
    await pool.query(`UPDATE users SET username=${username} where id=${userId}`);
}

export async function setUserProfilePic(userId: number, profilePic: string) {
    await pool.query(`UPDATE users SET profilePic=${profilePic} where id=${userId}`);
}

export async function deleteUserById(userId: number) {
    await pool.query(`DELETE from users where users.id=${userId}`);
}

export async function getUserByUsernameOrEmailAndPassword(
    usernameOrEmail: string,
    password: string
  ): Promise<User | null> {
    try {
      const [rows] = await pool.query<User[]>(
        `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?;`,
        [usernameOrEmail, usernameOrEmail, password]
      );
  
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Database Error:", error);
      throw error;
    }
  }

export async function getUserByUsernameAndPassword(username: string, password: string) : Promise<User | null> {
    try {
        const [rows] = await pool.query<User[]>(
            `SELECT * FROM users WHERE username=${username} and password=${password}`
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (e) {
        console.error("Database Error:", e);
        throw e;
    }
}

export async function getUserByUsernameOrEmail(username: string, email: string){
    try {
        const [rows] = await pool.query<User[]>(`SELECT * FROM users WHERE username=? OR email=?`,[username,email])
        
        return rows.length > 0 ? rows[0] : null;
    } catch (e) {
        console.error("Database Error:", e);
        throw e;
    }
}
export async function createUser(email: string, username: string, password: string): Promise<User | null> {
    //DEBUG
    console.log(`Database : creating user with email: ${email}, username: ${username} and password : ${password}`)
    //
    const query = await pool.query(`INSERT INTO users (username,email,password) VALUES (?,?,?);`,[username,email,password])
    const [rows] = await pool.query<User[]>(`SELECT id, username, email FROM users WHERE username=? and email=?`,[username,email])
    return rows.length > 0 ? rows[0] : null;
}

// --------------------------------------   New ----------------------------------
export async function getUserById(id: any){
    //Renvoi toutes les informations de l'utilisateur avec cet id
    //DEBUG
    console.log(`Database : get users by Id : ${id}`)

    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", id);
    return rows;
    //    
}

export async function updateUserProfile(userData: User){

    if (!(userData.username as string === null || userData.username as string === "" || userData.username as string === undefined)) {
        await setUserUsername(userData.id, userData.username)
    }
    if (!(userData.email as string === null || userData.email as string === "" || userData.email as string === undefined)) {
        await setUserPassword(userData.id, userData.email)
    }
    if (!(userData.password as string === null || userData.password as string === "" || userData.password as string === undefined)) {
        await setUserPassword(userData.id, userData.password)
    }
    if (!(userData.profilePic as string === null || userData.profilePic as string === "" || userData.profilePic as string === undefined)) {
        await setUserProfilePic(userData.id, userData.profilePic)
    }
}

// -----------------------------------------          Tests          ----------------------------------------------
//DEBUG
// const user = await createUser("drago123@gmail.com","Drago Malefoy", 'bully');
// console.log(user)
// const user = await getUserById(77)
// console.log(user)
// const user = await updateUserProfile({id:77,username:"Bob",email:"jean",profilePic:"chiot4"})
