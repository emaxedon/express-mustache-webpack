import express from 'express';
import i18n from 'i18n';
import hoganExpress from 'hogan-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import config from './config/config';

const app = express();

app.use(helmet());
app.set('view engine', 'mustache');
app.set('views', './views');
app.engine('mustache', hoganExpress);

i18n.configure({
	locales: ['en', 'fr'],
	defaultLocale: 'en',
	directory: './locales',
	objectNotation: true,
	cookie: config.server.cookie,
	queryParameter: 'lang',
	updateFiles: false
});

app.set('partials', {
	header: 'header',
	footer: 'footer'
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(i18n.init);

/* Handle Localisation */
app.use((req, res, next) => {
	// Check browser locale only when cookie not set.
	if (!req.cookies[config.server.cookie]) {
		const locales = [
			'en', 'en-au', 'en-bz', 'en-ca', 'en-le', 'en-jm', 'en-nz', 'en-ph', 'en-za', 'en-tt', 'en-gb', 'en-us', 'en-zw',
			'fr', 'fr-be', 'fr-ca', 'fr-fr', 'fr-lu', 'fr-mc', 'fr-ch'
		];

		const lang = req.acceptsLanguages(locales);

		if (lang) {
			i18n.setLocale(lang.split('-')[0]);
		}
	}

	if (req.query.lang) {
		i18n.setLocale(req.query.lang);
		res.cookie(config.server.cookie, req.query.lang);
	}

	res.locals.t = () => {
		return (text, render) => {
			return i18n.__(text);
		};
	};

	next();
});

app.use(express.static('public'));

app.get(['/', '/index'], (req, res) => {
	res.render('index', {
		title: '',
		page: 'index'
	});
});

app.listen(config.server.port, () => {
	console.log(`Server listening on port ${config.server.port}.`);
});