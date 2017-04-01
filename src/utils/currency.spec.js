import test from 'ava';

import currency from './currency';

test('return formated values', t => {
    t.is(currency(1), '1.00');
    t.is(currency(2.3), '2.30');
    t.is(currency(4.56), '4.56');
    t.is(currency(-7), '(7.00)');
    t.is(currency(-7.896), '(7.90)');
});

test('return formated from non-number objects', t => {
    t.is(currency('1'), '1.00');
    t.is(currency('2.3'), '2.30');
    t.is(currency('4.56'), '4.56');
    t.is(currency('-7'), '(7.00)');
    t.is(currency('-7.896'), '(7.90)');
    t.is(currency('-7.896aaa'), '???');
    t.is(currency(null), '???');
    t.is(currency(undefined), '???'); // eslint-disable-line
    t.is(currency({}), '???');
});