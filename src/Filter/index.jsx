import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  handleCheck = (checked) => {
    this.setState({
      checked,
    });
  }

  render() {
    return (
      <li key={this.props.key}>
        <CheckBox
          name="checkbox"
          label={this.props.label}
          onChange={this.handleCheck}
          checked={this.state.checked}
        />
      </li>
    );
  }
}

Filter.propTypes = {
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Filter;
