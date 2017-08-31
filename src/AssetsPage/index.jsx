import React from 'react';
import CheckBox from 'paragon/src/CheckBox';

import displayStrings from './display_strings.json';
import styles from './styles.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  handleCheckBoxChange = (checked) => {
    this.setState({
      checked,
    });
  }

  render() {
    return (
      <div className={styles.assets}>
        <h2>{displayStrings.header}</h2>
        <CheckBox
          name="checkbox"
          label={displayStrings.checkboxLabel}
          onChange={this.handleCheckBoxChange}
          checked={this.state.checked}
        />
      </div>
    );
  }
}

export default AssetsPage;
