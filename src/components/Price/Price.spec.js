import test from 'ava';
import React from 'react';
import {renderJSX, JSX} from 'jsx-test-helpers';

import {Price} from './Price';

test('renders correct markup', t => {
    const actual = renderJSX(<Price value={12}/>);
    const expected = JSX(<span>12.00$</span>);
    t.is(actual, expected);
});

test('renders correct markup with partial decimal', t => {
    const actual = renderJSX(<Price value={12.5}/>);
    const expected = JSX(<span>12.50$</span>);
    t.is(actual, expected);
});

test('display invalid price', t => {
    const actual = renderJSX(<Price/>);
    const expected = JSX(<span>no price</span>);
    t.is(actual, expected);
});