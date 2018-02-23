import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon, InputText } from '@edx/paragon';
import FontAwesomeStyles from 'font-awesome/css/font-awesome.min.css';

import edxBootstrap from '../../SFE.scss';
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

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.assetsSearch.search) {
      this.setState({ value: nextProps.assetsSearch.search });
    }
  }

  submit(event) {
    this.props.updateSearch(this.state.value, this.props.courseDetails);
    event.preventDefault(); // prevent the page from navigating to the form action URL
  }

  handleChange(value) {
    this.setState({ value });
  }

  render() {
    // TODO: InputText creates it's own form-group div. Nesting them is not semantic.
    // Once Paragon's asInput is refactored, use only one form-group element.
    return (
      <form
        className={classNames(edxBootstrap['form-group'], edxBootstrap['form-inline'], edxBootstrap['justify-content-end'])}
        onSubmit={this.submit}
      >
        <InputText
          name="search"
          className={[edxBootstrap['form-inline']]}
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
            <WrappedMessage message={messages.assetsSearchSubmitLabel}>{
              txt => (
                <Icon
                  className={[classNames(FontAwesomeStyles.fa, FontAwesomeStyles['fa-search'])]}
                  screenReaderText={txt}
                />
              )
            }</WrappedMessage>
          }
        />
      </form>
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
