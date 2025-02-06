const errors = require('./erorr.json');

errors.forEach(error => {
    console.log(error.request_history.status, JSON.parse(error.request_history.payload));
});