var testosterone = require('testosterone')({port: 3000})
  , assert = testosterone.assert;

testosterone
.get('/auth', function (res) {
    assert.equal(res.statusCode, 303);
})

.get('/hi', function(res) {
    assert.equal(res.body, 'hola');
    assert.equal(res.statusCode, 200);
});

