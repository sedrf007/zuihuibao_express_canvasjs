var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var premiumRouter = require('./routes/total_premium');
var businessRouter = require('./routes/order_source');
var productRouter = require('./routes/product_source');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/business', indexRouter);
app.use('/product', indexRouter);
app.use('/users', usersRouter);
app.use('/province_all', usersRouter);
app.use('/province_ordersource', usersRouter);
app.use('/province_product', usersRouter);
app.post('/total_premium',premiumRouter);
app.post('/pie',premiumRouter);
app.post('/column',premiumRouter);
app.post('/index_total',premiumRouter);
app.post('/line',premiumRouter);
app.post('/tiny_column',premiumRouter);
app.post('/subline',premiumRouter);
app.post('/line_all',businessRouter);
app.post('/businesspie',businessRouter);
app.post('/subpie',businessRouter);
app.post('/product_line',productRouter);
app.post('/productpie',productRouter);
app.post('/subproduct',productRouter);


// app.use('/user/:id', function (req, res, next) {
//     console.log('Request Type:', req.method)
//     next()
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
