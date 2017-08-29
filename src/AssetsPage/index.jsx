import React from 'react';
import styles from './styles.css';

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

  render() {
    AssetsPage.request();
    return (
      <div className={styles.assets}>
        <h2>I am the AssetsPage</h2>
      </div>
    );
  }
}

export default AssetsPage;
