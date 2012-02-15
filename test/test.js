<<<<<<< HEAD
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

=======
var testosterone = require('testosterone')({port: 3000, title: 'Testing 4TEG'}),
    assert = testosterone.assert

testosterone

    .before(function () {
        console.log('runs before each test');
    })

    .after(function () {
        console.log('runs after each test')
    })

    .get('/', function (res) {
        assert.equal(res.statusCode, 200);
    })

    .get('/sarasa', function (res) {
        assert.equal(res.body, 'Cannot GET /sarasa')
    });
>>>>>>> 5ce97472c637c9043e06fd4acb9abd0de45e5faa
