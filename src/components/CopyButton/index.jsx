import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';
import copy from 'copy-to-clipboard';
import styles from './CopyButton.scss';

export default class CopyButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wasClicked: false,
    };

    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setButtonRef = this.setButtonRef.bind(this);
  }

  onClick() {
    this.setState({
      wasClicked: true,
    });

    copy(`${this.props.textToCopy}`);

    /*
      The above copy command removes focus from the button, so we
      have to explicitly set it back. The copy command works by
      inserting a span containing the text to be copied into the
      DOM and running document.execCommand('copy') on it. Some
      part of this process shifts focus.
    */
    this.buttonRef.focus();
    /*
      This executes the callback passed in by the parent to
       correctly update the screen-reader text span in the
       AssetsTable.
    */
    this.props.onCopyButtonClick(true);
  }

  onBlur() {
    this.setState({
      wasClicked: false,
    });
    /*
      This executes the callback passed in by the parent to
       correctly update the screen-reader text span in the
       AssetsTable.
    */
    this.props.onCopyButtonClick(false);
  }

  setButtonRef(input) {
    this.buttonRef = input;
  }

  render() {
    const label = this.state.wasClicked ? this.props.onCopyLabel : this.props.label;

    return (
      <Button
        className={[...this.props.className, styles['copy-button'], 'btn-outline-primary']}
        aria-label={this.props.ariaLabel}
        label={label}
        inputRef={this.setButtonRef}
        onClick={this.onClick}
        onBlur={this.onBlur}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        data-identifier={this.props['data-identifier']}
      />
    );
  }
}

CopyButton.propTypes = {
  'ariaLabel': PropTypes.string,
  'label': PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  'onCopyLabel': PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  'textToCopy': PropTypes.string.isRequired,
  'onCopyButtonClick': PropTypes.func,
  'className': PropTypes.arrayOf(PropTypes.string),
  'data-identifier': PropTypes.string,
};

CopyButton.defaultProps = {
  'onCopyButtonClick': () => {},
  'ariaLabel': 'Copy',
  'className': [],
  'data-identifier': undefined,
};
