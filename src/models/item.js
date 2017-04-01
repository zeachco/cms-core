import autoBind from 'auto-bind-es5';

export class Item {
  constructor(attrs) {
    autoBind(this);
    this.reset(attrs);
  }

  reset(attrs) {
    attrs = attrs || {};
    attrs = attrs.data || attrs;
    this.quantity = 1;
    this.data = {
      options: [],
      files: [],
      labels: []
    };
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key) && typeof attrs[key] !== 'function') {
        this.data[key] = attrs[key];
      }
    }
    this.selectedIndex = {};
    this.selectedOptions = {};
  }

  increment(val = 1) {
    this.quantity += val;
  }

  decrement(val = 1) {
    this.quantity -= val;
  }

  toJSON() {
    return this.data;
  }

  getPrice() {
    const { price } = this.data;
    return this.eval(price).value * this.quantity || 0;
  }

  isVisible() {
    return this.get('visible') && this.getPrice() > 0;
  }

  isPurchasable() {
    return this.get('visible') !== false && !this.flag('backorder') && this.getPrice() > 0;
  }

  flag(label, value) {
    const index = this.data.labels.indexOf(label);
    if (typeof value === 'boolean') {
      if (value && index === -1) {
        this.data.labels.push(label);
      } else if (!value && index !== -1) {
        this.data.labels.splice(index, 1);
      }
    } else {
      return index !== -1;
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  selectOption(group, option) {
    this.selectedIndex[group] = option;
  }

  getContext() {
    this.selectedOptions = {
      _data: this.data
    };
    const { options = [] } = this.data;
    options.forEach((og) => {
      const selectedOpt = og
                .options
                .filter(o => o.code === this.selectedIndex[og.code]);
      const opt = selectedOpt[0] || og.options[0];
      this.selectedOptions[og.code] = opt;
    });
    return this.selectedOptions;
  }

  eval() {
    const _context = this.getContext();
    const { price } = this.data;
    const out = {
      value: 0,
      isValid: false
    };
    try {
      var initVars = '';
      for (var k in _context) {
        if (_context.hasOwnProperty(k)) {
          initVars += `var ${k} = _context['${k}'].value;`;
        }
      }
      out.eval = initVars + price;
      // eslint-disable-next-line
      out.value = eval(out.eval);
      out.isValid = isFinite(out.value);
      if (!out.isValid) {
        out.value = 0;
      }
    } catch (error) {
      out.error = error.message;
    }
    return out;
  }

  getThumb() {
    const { files} = this.data;
    return files.length ? `${files[0]}/thumb` : '';
  }

  getCartId() {
    let id = this.data.code;
    const _context = this.getContext();
    for (var k in _context) {
      if (_context.hasOwnProperty(k) && k !== '_data') {
        try {
          id += `_${_context[k].code}`;
        } catch (e) {
          console.warn(this.get('_id'), e); // eslint-disable-line no-console
          id += JSON.stringify(_context);
        }
      }
    }
    return id;
  }
}

export default Item;
