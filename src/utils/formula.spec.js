import test from 'ava';

import { formula } from '.';

test('evaluate scripts with a defined context', t => {
    const out = formula('( a + b ) * 10', { a: 2, b: 3 });
    t.is(out.value, 50);
    t.is(out.isValid, true);
    t.is(out.error, undefined);
});

test('evaluate scripts without a defined context', t => {
    const out = formula('( 2 + 3 ) * 10');
    t.is(out.value, 50);
    t.true(out.isValid);
    t.falsy(out.error);
});

test('evaluate scripts with missing context references', t => {
    const out = formula('( a + b ) * 10');
    t.falsy(out.value, undefined);
    t.falsy(out.isValid);
    t.truthy(out.error);
});

test('evaluate scripts with synthax error', t => {
    const out = formula('( 1 + 2  * 10');
    t.falsy(out.value, undefined);
    t.falsy(out.isValid);
    t.truthy(out.error);
});