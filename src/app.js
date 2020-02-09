const express = require('express');
const logger = require('morgan');
const db = require('./utils/database');
const reply = require('./middlewares/reply');
const error = require('./middlewares/error');
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

app.use(error.notFound);
app.use(error.unknown);

module.exports = app;
