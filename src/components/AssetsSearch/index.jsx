import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, InputText } from '@edx/paragon';

import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';
import './AssetsSearch.scss';

export default class AssetsSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.assetsSearch.search };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    this.props.updateSearch(this.state.value, this.props.courseDetails);
    event.preventDefault(); // prevent the page from navigating to the form action URL
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <div role="group" aria-labelledby="search-label">
        {/* TODO: InputText creates it's own form-group div. Nesting them is not semantic.
            Once Paragon's asInput is refactored, use only one form-group element. */}
        <form
          className="form-group form-inline"
          onSubmit={this.submit}
        >
          <InputText
            name="search"
            className={['form-inline']}
            type="search"
            inline
            label={<WrappedMessage message={messages.assetsSearchInputLabel} />}
            value={this.state.value}
            onChange={this.handleChange}
          />
          <Button
            buttonType="primary"
            type="submit"
            label={
              <Icon
                className={['fa', 'fa-search']}
                screenReaderText="Submit search"
              />
            }
          />
        </form>
      </div>
    );
  }
}


AssetsSearch.propTypes = {
  assetsSearch: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    base_url: PropTypes.string,
  }).isRequired,
  updateSearch: PropTypes.func.isRequired,
};
