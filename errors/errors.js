const codes = {
  23502: 'violates not null input',
  '22P02': 'invalid input syntax for integer',
};

exports.error404 = ('/*', (req, res, next) => {
  next({ status: 404, message: 'path does not exist' });
});

exports.handle400atRouter = (id, next) => {
  if (id.match(/[0-9]/g)) {
    next();
  } else { next({ status: 400, message: 'invalid data type' }); }
};

exports.handle400 = (err, req, res, next) => {
  if (codes[err.code]) next({ status: 400, message: codes[err.code] });
  else { next(err); }
};

exports.handle405 = (req, res, next) => {
  next({ status: 405, message: 'method not allowed' });
};

exports.handle404forNonExistingPostParents = (err, req, res, next) => {
  if (err.code === '23503') next({ status: 404, message: err.detail });
  else { next(err); }
};

exports.handle422 = (err, req, res, next) => {
  if (err.code === '23505') {
    next({ status: 422, message: err.detail });
  } else { next(err); }
};
