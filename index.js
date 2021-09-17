const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cookieSession({
		keys: [ 'notSafeEncryptionKey' ]
	})
);

app.use(authRouter);

app.listen(3000, () => {
	console.log('listening at port 3000');
});
