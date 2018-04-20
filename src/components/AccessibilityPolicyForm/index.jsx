import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, InputText, StatusAlert, TextArea } from '@edx/paragon';
import { FormattedTime, FormattedDate } from 'react-intl';

import messages from './displayMessages';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
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
    if (accessibilityStatus.type ===
      accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS) {
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
      alertDialog: <WrappedMessage
        message={messages.accessibilityPolicyFormSubmittingFeedbackLabel}
      />,
    };

    if (!isValidFormContent) {
      status = {
        alertType: 'danger',
        alertDialog: (
          <div>
            <WrappedMessage
              message={messages.accessibilityPolicyFormErrorMissingFields}
              tagName="div"
            />
            <div className="mt-3">
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
        accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_RATE_LIMIT_FAILURE) {
      status = {
        alertType: 'danger',
        alertDialog: (
          <WrappedMessage
            message={messages.accessibilityPolicyFormErrorHighVolume}
            tagName="div"
            values={{
              emailLink: <a href={`mailto:${accessibilityEmail}`}>{accessibilityEmail}</a>,
            }}
          />
        ),
      };
    } else if (accessibilityStatus.type ===
        accessibilityActions.submit.ACCESSIBILITY_FORM_SUBMIT_SUCCESS) {
      const start = new Date('Mon Jan 29 2018 13:00:00 GMT (UTC)');
      const end = new Date('Fri Feb 2 2018 21:00:00 GMT (UTC)');
      status = {
        alertType: 'success',
        alertDialog: (
          <div>
            <WrappedMessage message={messages.accessibilityPolicyFormSuccess} />
            <br />
            <br />
            <WrappedMessage
              message={messages.accessibilityPolicyFormSuccessDetails}
              values={{
                day_start: (<FormattedDate value={start} weekday="long" />),
                time_start: (<FormattedTime value={start} timeZoneName="short" />),
                day_end: (<FormattedDate value={end} weekday="long" />),
                time_end: (<FormattedTime value={end} timeZoneName="short" />),
              }}
            />
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
        validationMessage: <WrappedMessage message={messages.accessibilityPolicyFormValidEmail} />,
        dangerIconDescription: <WrappedMessage message={messages.accessibilityPolicyFormError} />,
      };
    }
    return feedback;
  }

  validateFullName(fullName) {
    let feedback = { isValid: true };
    if (!fullName) {
      feedback = {
        isValid: false,
        validationMessage: <WrappedMessage message={messages.accessibilityPolicyFormValidName} />,
        dangerIconDescription: <WrappedMessage message={messages.accessibilityPolicyFormError} />,
      };
    }
    return feedback;
  }

  validateMessage(message) {
    let feedback = { isValid: true };
    if (!message) {
      feedback = {
        isValid: false,
        validationMessage: <WrappedMessage
          message={messages.accessibilityPolicyFormValidMessage}
        />,
        dangerIconDescription: <WrappedMessage message={messages.accessibilityPolicyFormError} />,
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
        <WrappedMessage message={messages.accessibilityPolicyFormHeader}>
          { displayText => <h2 id="a11y-feedback" className={styles['page-header']}>{displayText}</h2> }
        </WrappedMessage>
        {this.renderStatusAlert()}
        <section className={styles['form-section']} role="group" aria-labelledby="a11y-feedback fields-required">
          <WrappedMessage message={messages.accessibilityPolicyFormFieldsRequired}>
            { displayText => <p id="fields-required">{displayText}</p>}
          </WrappedMessage>
          <InputText
            name="email"
            label={<WrappedMessage message={messages.accessibilityPolicyFormEmailLabel} />}
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
            label={<WrappedMessage message={messages.accessibilityPolicyFormNameLabel} />}
            id="fullName"
            onChange={this.handleFullNameChange}
            value={this.state.submitterFullName}
            themes={['danger']}
            validator={fullName => this.validateFullName(fullName)}
            inputRef={(ref) => { this.fullNameInputRef = ref; }}
          />
          <TextArea
            name="message"
            label={<WrappedMessage message={messages.accessibilityPolicyFormMessageLabel} />}
            id="message"
            onChange={this.handleMessageChange}
            value={this.state.submitterMessage}
            themes={['danger']}
            validator={message => this.validateMessage(message)}
            inputRef={(ref) => { this.messageInputRef = ref; }}
          />
          <WrappedMessage message={messages.accessibilityPolicyFormSubmitAria}>
            { displayText =>
              (<Button
                buttonType="primary"
                label={<WrappedMessage message={messages.accessibilityPolicyFormSubmitLabel} />}
                aria-label={displayText}
                onClick={() => { this.onSubmitClick(); }}
                inputRef={(ref) => { this.submitButtonRef = ref; }}
              />)
            }
          </WrappedMessage>
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
