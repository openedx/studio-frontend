import React from 'react';
import { Button, Modal } from '@edx/paragon';
import 'font-awesome/css/font-awesome.min.css';

// Sass styles are imported in JS so that we can programatically apply styles to React elements by
// class name.  Webpack's css-loader can later rename the actual class name to a name that is scoped
// to just this component to avoid clashing with other component styles that use the same class name
// (this is called CSS Modules).
import styles from './HelloWorld.scss'; // Need the .scss because Webpack assumes .js by default

// Render our translated "Hello, world!" message in a styled div.
export default class HelloWorld extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleButtonClick() {
    this.setState({
      modalOpen: true,
    });
  }

  handleModalClose() {
    this.setState({
      modalOpen: false,
    });
  }

  render() {
    return (
      <div className={styles['hello-world']}>
        <Modal
          open={this.state.modalOpen}
          title="Hello Modal"
          body="Hello, world!"
          onClose={this.handleModalClose}
          parentSelector={`.${styles['hello-world']}`}
        />
        <Button
          buttonType="primary"
          id="open-modal-btn"
          label="Hello, world!"
          onClick={this.handleButtonClick}
        />
      </div>
    );
  }
}
