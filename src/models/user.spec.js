const User = require('./user');
const test = require('ava');

test('by default, users aren\'t admin', (t) => {
  const u = new User();
  t.is(u.isRole('user'), true);
  t.is(u.isRole('admin'), false);
});

test('detect admin flag', (t) => {
  const u = new User({
    space: ['acme.com'],
    roles: ['user', 'admin'],
  });
  t.is(u.isRole('user'), true);
  t.is(u.isRole('admin'), true);
});
