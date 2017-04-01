import React, { PropTypes } from 'react';
import currency from '../../utils/currency';

export const Price = ({ value }) => {
  if (isNaN(value)) return <span>no price</span>;
  return(
    <span>
      {value ? currency(value) : '0.00'}$
    </span>
)};

Price.propTypes = {
  value: PropTypes.number
};

export default Price;
