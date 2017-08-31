import React from 'react';
import CheckBox from 'paragon/src/CheckBox';

import styles from './styles.scss';

class AssetsPage extends React.Component {
  static request() {
    fetch('/api/assets/course-v1:edX+DemoX+Demo_Course/?page=0&page_size=50&sort=sort&asset_type=', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(data => data.json())
      .catch(() => {
        // console.log(error);
      })
      .then(() => {
        // console.log(json);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    AssetsPage.request();
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
