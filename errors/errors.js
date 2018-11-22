const codes = {
  23502: 'violates not null input',
};

exports.error404 = ('/*', (req, res, next) => {
  next({ status: 404, message: 'path does not exist' });
});

exports.handle400 = (err, req, res, next) => {
  if (codes[err.code]) next({ status: 400, message: codes[err.code] });
};

exports.handle405 = (req, res, next) => {
  next({ status: 405, message: 'method not allowed' });
};

exports.handle422 = (err, req, res, next) => {
  if (err.code === '23505') {
    next({ status: 422, message: err.detail });
  } else { next(err); }
};
