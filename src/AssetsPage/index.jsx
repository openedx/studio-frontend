import React from 'react';

class AssetsPage extends React.Component {
  request() {
    fetch('/api/assets/course-v1:edX+DemoX+Demo_Course/?page=0&page_size=50&sort=sort&asset_type=', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(data => data.json())
      .catch((error) => {
        console.log(error);
      })
      .then((json) => {
        console.log(json);
      });
  }

  render() {
    this.request();
    return (
      <div>
        <h2>I am the AssetsPage</h2>
      </div>
    );
  }
}

export default AssetsPage;
