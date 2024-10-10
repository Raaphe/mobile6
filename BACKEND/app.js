import express from 'express';

// Ces fonctions sont celles que nous avons créé précédemment, assurez vous que l'importation réussit                
import {getUserByUsernameAndPassword,getUserByUsernameOrEmailAndPassword,getUserByUsernameOrEmail, createUser} from './database.js';

const app = express();

// Configuration CORS pour autoriser toutes les origines


// app.use(express.json()) est une instruction cruciale pour configurer Express afin de gérer et d'interpréter
//   automatiquement les données JSON envoyées via les requêtes HTTP, facilitant ainsi le développement d'applications
//   web basées sur Node.js avec Express.
app.use(express.json())

/**
* @route POST /auth/signin
* @description Authenticate a user by username and password.
* @param {Object} req - The request object containing the username and password in the body.
* @param {string} req.body.usernameOrEmail - The username/email of the user attempting to authenticate.
* @param {string} req.body.password - The password of the user attempting to authenticate.
* @returns {Object} 200 - Returns the user object if authentication is successful.
* @returns {Object} 404 - Returns an error message if the user is not found.
* @returns {Object} 500 - Returns an error message if there is an internal server error.
* @throws {Error} - Logs an error message to the console if user retrieval fails.
*/
app.post("/auth/signin", async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log("Post : auth/signin")

    // Check if username or email and password are provided
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Username or email and password are required." });
    }

    try {
        // Modify the user retrieval function to accept either username or email
        console.log(`End point request with user/email : ${usernameOrEmail} and pass : ${password}`)


        const user = await getUserByUsernameOrEmailAndPassword(usernameOrEmail, password);
        console.log(`Found user : ${user}`)
        if (!user) {
            return res.status(401).json({ error: "Invalid username/email or password." });
        }

        // Return user data (ensure sensitive data like password is not returned)
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            // Add any other fields you want to include in the response
        });
    } catch (error) {
        console.error('Error retrieving user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post("/auth/signup", async (req, res) => {
    const { username, password, email } = req.body;

    // Check for missing fields
    if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required." });
    }

    try {
        // Check if the username or email already exists
        const existingUser = await getUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already exists." });
        }

        // Proceed to create the user
        const newUser = await createUser({ username, password, email });

        // Return the newly created user information
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        });
    } catch (error) {
        console.error('Error during signup: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Lorsqu'une erreur se produit dans l'application (par exemple, une exception non gérée), Express appelle automatiquement
// ce middleware d'erreur avec l'objet d'erreur (err), ce qui permet de la gérer de manière centralisée et uniforme.
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Lance le serveur et lui indique quel port utiliser 
app.listen(8080, () => {
    console.log('Server is runnig on port 8080')
})
