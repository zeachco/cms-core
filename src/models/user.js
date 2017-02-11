const autoBind = require('auto-bind');

class User {
  constructor(attrs) {
    autoBind(this);
    this.reset(attrs);
  }

  reset(attrs) {
    attrs = attrs || {
      roles: ['user'],
    };
    attrs = attrs.data || attrs;
    this.data = {};
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key) && typeof attrs[key] !== 'function') {
        this.data[key] = attrs[key];
      }
    }
    this.selectedIndex = {};
    this.selectedOptions = {};
  }
  isRole(role) {
    return this.data.roles.indexOf(role) !== -1;
  }
}

module.exports = User;
