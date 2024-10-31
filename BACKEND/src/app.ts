import express, { Request, Response } from 'express';
import { NextFunction } from 'express';
// Ces fonctions sont celles que nous avons créé précédemment, assurez vous que l'importation réussit                
import {getUserByUsernameOrEmailAndPassword, createUser, getUserByUsernameOrEmail, getUserById, updateUserProfile} from './database';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Use a strong secret key in production

const app = express();

// app.use(express.json()) est une instruction cruciale pour configurer Express afin de gérer et d'interpréter
//   automatiquement les données JSON envoyées via les requêtes HTTP, facilitant ainsi le développement d'applications
//   web basées sur Node.js avec Express.
app.use(express.json())

app.post("/users/signin", async (req: any, res: any) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Username or email and password are required." });
    }

    try {
        const user = await getUserByUsernameOrEmailAndPassword(usernameOrEmail, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid username/email or password." });
        }

        const userId = user;
        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Error retrieving user: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post("/users", async (req: any, res: any) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required." });
    }

    try {
        const existingUser = await getUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already exists." });
        }

        const newUser = await createUser(email, username, password);

        return res.status(201).json({
            id: newUser?.id,
            username: newUser?.username,
            email: newUser?.email,
        });
    } catch (error) {
        console.error('Error during signup: ', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});


// -----------------------------------------        New         ----------------------------------------
app.get("/users/:id", async (req: Request, res: any) => {

    // Get the user ID from the route parameters
    // Check if userId is provided
    // Fetch user data from the database using the userId
    // If no user is found, respond with a 404 Not Found status
    // Return the user's information in the response
    try {
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token'); // Handle JWT-specific errors
        }
        console.error('Error fetching profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put("/users/:id", async (req, res) => {
    
    
});
// ----------------------------------------------------------------------------------------------------

// Lorsqu'une erreur se produit dans l'application (par exemple, une exception non gérée), Express appelle automatiquement
// ce middleware d'erreur avec l'objet d'erreur (err), ce qui permet de la gérer de manière centralisée et uniforme.


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Lance le serveur et lui indique quel port utiliser 
app.listen(8080, () => {
    console.log('Server is runnig on port 8080')
})
