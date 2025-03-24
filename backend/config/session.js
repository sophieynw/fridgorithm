const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

function setupSession(app) {
  app.use(
    session({
      store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: './db',
      }),
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      },
    })
  );
}

module.exports = setupSession;
