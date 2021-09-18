const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	requireTitle: check('title')
		.trim()
		.isLength({ min: 5, max: 40 })
		.withMessage('Must be between 5 and 40 characters'),
	requirePrice: check('price').trim().toFloat().isFloat({ min: 1 }).withMessage('Must be a number greater than 1'),
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid e-mail')
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) throw new Error('E-mail already in use.');
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters'),
	requirePasswordConfirmation: check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters')
		.custom((passwordConfirmation, { req }) => {
			if (req.body.password !== passwordConfirmation) throw new Error('Passwords must match!');
		}),
	requireEmailExists: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Invalid e-mail')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) throw new Error('E-mail not found!');
		}),
	requireValidPasswordForUser: check('password').trim().custom(async (password, { req }) => {
		const user = await usersRepo.getOneBy({ email: req.body.email });
		if (!user) throw new Error('invalid password');
		const validPassword = await usersRepo.comparePassword(user.password, password);
		if (!validPassword) throw new Error('Invalid password!');
	})
};
