import React from 'react';
import CheckBox from 'paragon/src/CheckBox';

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
        <h2>I am the AssetsPage</h2>
        <CheckBox
          name="checkbox"
          label="I am a checkbox!"
          onChange={this.handleCheckBoxChange}
          checked={this.state.checked}
        />
      </div>
    );
  }
}

export default AssetsPage;
