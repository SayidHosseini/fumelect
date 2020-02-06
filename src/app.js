const express = require('express');
const logger = require('morgan');
const db = require('./scripts/database');
const reply = require('./middlewares/reply');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const validateRouter = require('./routes/validate');
const rm = require('./static/responseMessages');
const sn = require('./static/names');

const app = express();
db.init(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('combined'));
app.use(reply.deliver);

app.use('/authentiq/v1/', indexRouter);
app.use('/authentiq/v1/validate', validateRouter);
app.use('/authentiq/v1/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.sendStatus(404);
});

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    if (process.env.NODE_ENV !== sn.production) {
        return res.contentType('text').status(err.status || 500).send(err.stack);
    }
    return res.status(err.status || rm.internalServerError.code).json(rm.internalServerError.msg);
});

module.exports = app;
