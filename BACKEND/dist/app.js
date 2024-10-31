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
const express_1 = __importDefault(require("express"));
// Ces fonctions sont celles que nous avons créé précédemment, assurez vous que l'importation réussit                
const database_1 = require("./database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'your_secret_key'; // Use a strong secret key in production
const app = (0, express_1.default)();
// app.use(express.json()) est une instruction cruciale pour configurer Express afin de gérer et d'interpréter
//   automatiquement les données JSON envoyées via les requêtes HTTP, facilitant ainsi le développement d'applications
//   web basées sur Node.js avec Express.
app.use(express_1.default.json());
app.post("/users/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "Username or email and password are required." });
    }
    try {
        const user = yield (0, database_1.getUserByUsernameOrEmailAndPassword)(usernameOrEmail, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid username/email or password." });
        }
        const userId = user;
        const token = jsonwebtoken_1.default.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token
        });
    }
    catch (error) {
        console.error('Error retrieving user: ', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required." });
    }
    try {
        const existingUser = yield (0, database_1.getUserByUsernameOrEmail)(username, email);
        if (existingUser) {
            return res.status(409).json({ error: "Username or email already exists." });
        }
        const newUser = yield (0, database_1.createUser)(email, username, password);
        return res.status(201).json({
            id: newUser === null || newUser === void 0 ? void 0 : newUser.id,
            username: newUser === null || newUser === void 0 ? void 0 : newUser.username,
            email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
        });
    }
    catch (error) {
        console.error('Error during signup: ', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}));
// -----------------------------------------        New         ----------------------------------------
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user ID from the route parameters
    // Check if userId is provided
    // Fetch user data from the database using the userId
    // If no user is found, respond with a 404 Not Found status
    // Return the user's information in the response
    try {
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).send('Invalid token'); // Handle JWT-specific errors
        }
        console.error('Error fetching profile Data: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// ----------------------------------------------------------------------------------------------------
// Lorsqu'une erreur se produit dans l'application (par exemple, une exception non gérée), Express appelle automatiquement
// ce middleware d'erreur avec l'objet d'erreur (err), ce qui permet de la gérer de manière centralisée et uniforme.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Lance le serveur et lui indique quel port utiliser 
app.listen(8080, () => {
    console.log('Server is runnig on port 8080');
});
