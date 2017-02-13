const Item = require('./item');
const test = require('ava');

const FakeItemJSON = {
    _id: '589014f20ab85f726d21a6c1',
    space: 'acme.com',
    shortDescription: '19cm',
    description: 'Description...',
    labels: ['animal-glass', 'new', 'clearance'],
    price: '15.5 + size + color',
    weight: 0.15,
    width: 13,
    height: 24,
    depth: 9,
    __v: 2,
    size: '-1',
    options: [{
        options: [{
            value: -1,
            code: 'small'
        }, {
            value: 0,
            code: 'medium'
        }, {
            value: 2,
            code: 'large'
        }],
        code: 'size'
    }, {
        options: [{
            value: 0,
            code: 'blue'
        }, {
            value: 1,
            code: 'red'
        }, {
            value: 2,
            code: 'black'
        }],
        code: 'color'
    }],
    code: 'SKU123456789',
    files: ['/api/medias/_246.png'],
    visible: true,
    name: '31009'
};

test('return a price of zero if formula is invalid', t => {
    const item = new Item(FakeItemJSON);
    item.set('price', '10 + 5 + aaaa');
    t.is(item.getPrice(), 0);

    const {
        error,
        isValid,
        value
    } = item.eval();
    t.is(error, 'aaaa is not defined');
    t.is(value, 0);
    t.is(isValid, false);
});


test('reset()', t => {
    const item = new Item(null);
    t.is(item.get('description'), undefined);
});

test('getPrice()', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.getPrice(), 14.5);
    item.selectOption('size', 'medium');
    item.selectOption('color', 'black');
    t.is(item.getPrice(), 17.5);
    item.set('price', '10 + 5 + "a"');
    const {
        error,
        isValid,
        value
    } = item.eval();
    t.is(error, undefined);
    t.is(value, 0);
    t.is(isValid, false);
});

test('getThumb()', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.getThumb(), '/api/medias/_246.png/thumb');
});

test('constructor() ; clone items and keep selected states for both', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.get('name'), '31009');
    t.is(item.get('visible'), true);
    t.is(item.get('options').length, 2);
    t.is(item.get('options')[0].options[0].value, -1);

    const item1 = new Item(FakeItemJSON);
    item1.selectOption('size', 'medium');
    item1.selectOption('color', 'black');

    const item2 = new Item(item1.toJSON());
    item2.selectOption('size', 'small');
    item2.selectOption('color', 'red');

    t.is(item1.getPrice(), 17.5);
    t.is(item2.getPrice(), 15.5);
});


test('constructor() ; prevent mutating previous object models', t => {
    const item1 = new Item(FakeItemJSON);
    item1.set('description', 'original description');

    const item2 = new Item(item1.toJSON());
    item2.set('description', 'mutated description');

    const item3 = new Item(item1);
    item3.set('description', 'mutated2 description');

    t.is(item1.get('shortDescription'), '19cm');
    t.is(item1.get('description'), 'original description');

    t.is(item2.get('shortDescription'), '19cm');
    t.is(item2.get('description'), 'mutated description');

    t.is(item3.get('shortDescription'), '19cm');
    t.is(item3.get('description'), 'mutated2 description');
});


test('toJSON()', t => {
    const item = new Item(FakeItemJSON);
    item.selectOption('size', 'large');
    const json = item.toJSON();
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            t.is(item.toJSON()[key], FakeItemJSON[key], `Failed on attribute "${key}"`);
        }
    }
});

test('quantity', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.quantity, 1);
    item.increment();
    t.is(item.quantity, 2);
    item.increment(2);
    t.is(item.quantity, 4);
    item.increment();
    t.is(item.quantity, 5);
    item.decrement(3);
    t.is(item.quantity, 2);
});

test('isPurchasable()', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.isPurchasable(), true);
    item.set('price', undefined);
    t.is(item.isPurchasable(), false);
    item.set('price', 14);
    t.is(item.isPurchasable(), true);
    item.set('labels', [...item.get('labels'), 'backorder']);
    t.is(item.isPurchasable(), false);
    item.set('labels', []);
    t.is(item.isPurchasable(), true);
    item.set('visible', false);
    t.is(item.isPurchasable(), false);
    delete item.data.visible;
    t.is(item.isPurchasable(), true);
});

test('isVisible()', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.isVisible(), true);
    item.set('price', undefined);
    t.is(item.isVisible(), false);
    item.set('price', 14);
    t.is(item.isVisible(), true);
    item.set('labels', [...item.get('labels'), 'backorder']);
    t.is(item.isVisible(), true);
});

test('provide a unique id based on item and selected options', t => {
    const item = new Item(FakeItemJSON);
    item.selectOption('size', 'large');
    item.selectOption('color', 'red');

    t.is(item.getCartId(), 'SKU123456789_large_red');

    const item2 = new Item(item.toJSON());
    item2.selectOption('size', 'medium');
    item2.selectOption('color', 'black');

    t.is(item2.getCartId(), 'SKU123456789_medium_black');
});

test('get price relative to quantity', t => {
    const item = new Item(FakeItemJSON);
    item.selectOption('size', 'large');
    item.selectOption('color', 'red');
    t.is(item.getPrice(), 18.5);
    item.increment(4);
    t.is(item.getPrice(), 18.5 * 5);
    item.decrement(2);
    t.is(item.getPrice(), 18.5 * 3);
});

test('get price relative to quantity when switching options', t => {
    const item = new Item(FakeItemJSON);
    item.selectOption('size', 'large');
    item.selectOption('color', 'red');
    t.is(item.getPrice(), 18.5);
    item.increment(4);
    t.is(item.getPrice(), 18.5 * 5);
    item.decrement(2);
    t.is(item.getPrice(), 18.5 * 3);
    item.selectOption('size', 'small');
    item.increment();
    t.is(item.getPrice(), 15.5 * 4);
});

test('get and set flags', t => {
    const item = new Item(FakeItemJSON);
    t.is(item.flag('backorder'), false);
    t.is(item.flag('animal-glass'), true);
    t.is(item.flag('new'), true);

    item.flag('backorder', true);
    item.flag('animal-glass', false);

    t.is(item.flag('backorder'), true);
    t.is(item.flag('animal-glass'), false);
    t.is(item.flag('new'), true);
});


test('context is always pointing to itsef', t => {
    const item = new Item(FakeItemJSON);
    const run = item.getPrice;
    t.is(run(), 14.5);
});