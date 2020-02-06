const express = require('express');
const logger = require('morgan');
const db = require('./scripts/database');
const reply = require('./middlewares/reply');
const errors = require('./middlewares/errors');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const validateRouter = require('./routes/validate');

const app = express();
db.init(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('combined'));
app.use(reply.deliver);

app.use('/authentiq/v1/', indexRouter);
app.use('/authentiq/v1/validate', validateRouter);
app.use('/authentiq/v1/user', userRouter);

app.use(errors.notFound);
app.use(errors.unknown);

module.exports = app;
