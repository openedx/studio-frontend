import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@edx/paragon/src/Button';
import InputText from '@edx/paragon/src/InputText';
import StatusAlert from '@edx/paragon/src/StatusAlert';
import TextArea from '@edx/paragon/src/TextArea';

import { clearAccessibilityStatus, submitAccessibilityForm } from '../../data/actions/accessibility';
import { accessibilityActions } from '../../data/constants/actionTypes';
import styles from './AccessibilityPolicyForm.scss';

export class AccessibilityPolicyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitterEmail: '',
      submitterFullName: '',
      submitterMessage: '',
      isStatusAlertOpen: false,
      isValidFormContent: true,
      validationMessages: [],
    };

    this.statusAlertRef = {};
    this.emailInputRef = {};
    this.fullNameInputRef = {};
    this.messageInputRef = {};
    this.submitButtonRef = {};

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleFullNameChange = this.handleFullNameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validateFullName = this.validateFullName.bind(this);
    this.validateMessage = this.validateMessage.bind(this);
    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.renderStatusAlert = this.renderStatusAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { accessibilityStatus } = nextProps;
    if (accessibilityStatus.type === accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS) {
      this.clearInputs();
    }
  }

  onSubmitClick() {
    this.props.clearAccessibilityStatus();

    const { submitterEmail, submitterFullName, submitterMessage } = this.state;
    const isValidEmail = this.validateEmail(submitterEmail);
    const isValidFullName = this.validateFullName(submitterFullName);
    const isValidMessage = this.validateMessage(submitterMessage);
    const isValidContent = isValidEmail.isValid &&
      isValidFullName.isValid && isValidMessage.isValid;

    this.setState({
      isStatusAlertOpen: true,
      isValidFormContent: isValidContent,
      validationMessages: [
        isValidEmail.validationMessage,
        isValidFullName.validationMessage,
        isValidMessage.validationMessage,
      ],
    });
    this.statusAlertRef.focus();

    if (isValidContent) {
      this.props.submitAccessibilityForm(submitterEmail, submitterFullName, submitterMessage);
    }
  }

  getStatusFields() {
    const { accessibilityStatus, accessibilityEmail } = this.props;
    const { isValidFormContent, validationMessages } = this.state;
    let status = {
      alertType: 'info',
      alertDialog: 'Submitting feedback',
    };

    if (!isValidFormContent) {
      status = {
        alertType: 'danger',
        alertDialog: (
          <div>
            <div>Make sure to fill in all fields.</div>
            <br />
            <div>
              <ul className={styles['bullet-list']}>
                {validationMessages.map((error, index) => {
                  let errorMessage = '';
                  if (error) {
                    /* eslint-disable react/no-array-index-key */
                    errorMessage = <li key={`Error-${index}`}>{error}</li>;
                  }
                  return errorMessage;
                })}
              </ul>
            </div>
          </div>
        ),
      };
    } else if (accessibilityStatus.type ===
        accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE) {
      status = {
        alertType: 'danger',
        alertDialog: (
          <div>
            We are currently experiencing high volume. Try again later today or
             send an email message to <a href={`mailto:${accessibilityEmail}`}>{accessibilityEmail}</a>.
          </div>
        ),
      };
    } else if (accessibilityStatus.type ===
        accessibilityActions.ACCESSIBILITY_FORM_SUBMIT_SUCCESS) {
      status = {
        alertType: 'success',
        alertDialog: (
          <div>
            Thank you for contacting edX!
            <br />
            <br />
            Thank you for your feedback regarding the accessibility of Studio. We typically respond
             within one business day (Monday to Friday, 13:00 to 21:00 UTC).
          </div>
        ),
      };
    }

    return status;
  }

  handleEmailChange(value) {
    this.setState({
      submitterEmail: value,
    });
  }

  handleFullNameChange(value) {
    this.setState({
      submitterFullName: value,
    });
  }

  handleMessageChange(value) {
    this.setState({
      submitterMessage: value,
    });
  }

  validateEmail(email) {
    let feedback = { isValid: true };
    /* eslint-disable max-len */
    /* eslint-disable no-useless-escape */
    // TODO: Investigate using https://www.npmjs.com/package/isemail instead of regex
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* eslint-enable max-len */
    if (!emailRegEx.test(email)) {
      feedback = {
        isValid: false,
        validationMessage: 'Enter a valid email address.',
      };
    }
    return feedback;
  }

  validateFullName(fullName) {
    let feedback = { isValid: true };
    if (!fullName) {
      feedback = {
        isValid: false,
        validationMessage: 'Enter a name.',
      };
    }
    return feedback;
  }

  validateMessage(message) {
    let feedback = { isValid: true };
    if (!message) {
      feedback = {
        isValid: false,
        validationMessage: 'Enter a message.',
      };
    }
    return feedback;
  }

  clearInputs() {
    this.setState({
      submitterEmail: '',
      submitterFullName: '',
      submitterMessage: '',
    });
  }

  closeStatusAlert() {
    this.emailInputRef.focus();
    this.setState({
      isStatusAlertOpen: false,
    });
  }

  renderStatusAlert() {
    const status = this.getStatusFields();

    const statusAlert = (
      <StatusAlert
        alertType={status.alertType}
        dialog={status.alertDialog}
        open={this.state.isStatusAlertOpen}
        onClose={this.closeStatusAlert}
        ref={(input) => { this.statusAlertRef = input; }}
      />
    );

    return (
      <div>
        {statusAlert}
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2 id="a11y-feedback" className={styles['page-header']}>Studio Accessibility Feedback</h2>
        {this.renderStatusAlert()}
        <section className={styles['form-section']} role="group" aria-labelledby="a11y-feedback">
          <p>All fields are required.</p>
          <InputText
            name="email"
            label="Email Address"
            id="email"
            type="email"
            onChange={this.handleEmailChange}
            value={this.state.submitterEmail}
            themes={['danger']}
            validator={email => this.validateEmail(email)}
            inputRef={(ref) => { this.emailInputRef = ref; }}
            className={['something']}
          />
          <InputText
            name="fullName"
            label="Name"
            id="fullName"
            onChange={this.handleFullNameChange}
            value={this.state.submitterFullName}
            themes={['danger']}
            validator={fullName => this.validateFullName(fullName)}
            inputRef={(ref) => { this.fullNameInputRef = ref; }}
          />
          <TextArea
            name="message"
            label="Message"
            id="message"
            onChange={this.handleMessageChange}
            value={this.state.submitterMessage}
            themes={['danger']}
            validator={message => this.validateMessage(message)}
            inputRef={(ref) => { this.messageInputRef = ref; }}
          />
          <Button
            buttonType="primary"
            label="Submit"
            aria-label="Submit Accessibility Feedback Form"
            onClick={() => { this.onSubmitClick(); }}
            inputRef={(ref) => { this.submitButtonRef = ref; }}
          />
        </section>
      </div>
    );
  }
}

AccessibilityPolicyForm.propTypes = {
  accessibilityStatus: PropTypes.shape({
    response: PropTypes.object,
    type: PropTypes.string,
  }).isRequired,
  accessibilityEmail: PropTypes.string.isRequired,
  clearAccessibilityStatus: PropTypes.func.isRequired,
  submitAccessibilityForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  accessibilityStatus: state.accessibility.status,
});

const mapDispatchToProps = dispatch => ({
  clearAccessibilityStatus: () => dispatch(clearAccessibilityStatus()),
  submitAccessibilityForm: (email, fullName, message) =>
    dispatch(submitAccessibilityForm(email, fullName, message)),
});

const WrappedAccessibilityPolicyForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccessibilityPolicyForm);

export default WrappedAccessibilityPolicyForm;
