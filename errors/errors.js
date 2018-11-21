const codes = {
  23502: 'violates not null input',
};

exports.error404 = ('/*', (req, res, next) => {
  next({ status: 404, message: 'path does not exist' });
});

exports.handle400 = (err, req, res, next) => {
  if (codes[err.code]) next({ status: 400, message: codes[err.code] });
};
