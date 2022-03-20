/* eslint "no-console" : 0 */

const app = require('./app');

const PORT = process.env.PORT || 9090;

console.log(PORT);

app.listen(PORT, () => {
  console.log(`listeningn on port${PORT}`);
});
