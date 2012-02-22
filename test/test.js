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
