import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { CheckBox, InputSelect } from '@edx/paragon';
import { requestChangeAdvancedSettings } from '../../data/api/client';

import './ProctoringSettings.scss';

class ProctoringSettings extends React.Component {
  constructor(props) {
    super(props);

    this.onCheckBoxCheck= this.onCheckBoxCheck.bind(this);
    this.onInputSelectSelect = this.onInputSelectSelect.bind(this);
  }

  getProctoringProviderValue = () => (
    this.props.selectedProctoringProvider || this.props.defaultProctoringProvider
  )

  getDescription = () => (
    'Select the proctoring provider you want to use for this course run.'
  )

  getProctoringProviderInputSelect = () => (
    <InputSelect
      name="proctoringProvider"
      label="Proctoring Provider"
      value={this.getProctoringProviderValue()}
      options={this.props.availableProctoringProviders || []}
      description={this.getDescription()}
      onChange={this.onInputSelectSelect}
    />
  )

  getZendeskNotificationsCheckbox = () => (
    <CheckBox
      name="test"
      label="Create Zendesk Tickets For Suspicious Proctored Exam Attempts"
      description="If this checkbox is checked, a Zendesk ticket will be created for suspicious attempts."
      checked={this.props.createZendeskTickets}
      onChange={this.onCheckBoxCheck}
    />
  )

  onInputSelectSelect = (value) => {
    const params = {
      proctoring_provider: {
        value,
      },
    };

    this.makeRequest(params);
  }

  onCheckBoxCheck = (isChecked) => {
    const params = {
      create_zendesk_tickets: {
        value: isChecked,
      },
    };

    this.makeRequest(params);
  }

  makeRequest = (params) => {
    const x = requestChangeAdvancedSettings(this.props.courseID, params);
    x.then(
      (response) => {
        if (response.ok) {
          return response.json();
        }
        return Error('Failed request');
      },
    ).then(
      json => console.log(json),
    ).catch(
      error => console.error(error),
    );
  }

  render = () => (
    <React.Fragment>
      <h2>Proctoring Settings</h2>
      <div className="page-header mt-2 mb-4" />
      <div className={classNames('field-group', 'p-4')}>
        {this.getProctoringProviderInputSelect()}
        { this.props.userIsStaff && this.getZendeskNotificationsCheckbox()}
      </div>
    </React.Fragment>
  );
}

export default ProctoringSettings;
