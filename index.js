const express = require('express');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cookieSession({
		keys: [ 'notSafeEncryptionKey' ]
	})
);

app.get('/', (req, res) => {
	res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confirmation"/>
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) return res.send('E-mail already in use.');
	if (password !== passwordConfirmation) return res.send('Passwords must match!');

	const user = await usersRepo.create({ email, password });

	req.session.userId = user.id;

	res.send('account created');
	console.log(req.body);
});

app.listen(3000, () => {
	console.log('listening at port 3000');
});
