import './Demo.css'
import React, { Component } from 'react'
import { Price } from '../components'

export class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  _showcase(cName, cRef) {
    const attributes = Object.keys(cRef.propTypes);
    const fieldsNodes = [];
    attributes.forEach(attr => {
      const key = `${cName}_${attr}`;
      const _update = e => {
        e.preventDefault();
        this.setState({ [key]: e.target.value });
      }
      const input = React.createElement('input', {
        key: 'input_' + key,
        name: attr,
        placeholder: attr,
        onChange: _update.bind(this)
      });
      const label = React.createElement('label', { key }, [
        `${attr}: `,
        input
      ]);
      fieldsNodes.push(label);
    });
    const scopedAttrs = {};
    attributes.forEach(attr => {
      const key = `${cName}_${attr}`;
      scopedAttrs[attr] = this.state[key];
    });
    const showcaseComponent = React.createElement(cRef, scopedAttrs);
    return (
      <div className="showcase-container">
        <div className="fields">{fieldsNodes}</div>
        <div className="preview">{showcaseComponent}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this._showcase('Price', Price)}
      </div>
    );
  }
}


