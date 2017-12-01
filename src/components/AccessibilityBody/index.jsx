import React from 'react';
import PropTypes from 'prop-types';

const AccessibilityBody = (props) => {
  const mailto = `mailto:${props.email}`;
  const emailElement = (<a href={mailto}>{props.email}</a>);
  const communityAccessibilityElement = (
    <a href={props.communityAccessibilityLink}>Website Accessibility Policy</a>
  );

  /* eslint-disable max-len */
  return (
    <div>
      <h1>Studio Accessibility Policy</h1>
      <p>
        At edX, we seek to understand and respect the unique needs and perspectives of the edX global community.  We value every course team and are committed to being a leader in expanding access to all, including course team creators and authors with disabilities.  To that end, we have adopted a {communityAccessibilityElement} and this process to ensure that course team creators and authors with disabilities are able to develop and post content on our platform via Studio.
      </p>
      <p>
        Course team creators and authors who, because of their disabilities, need assistance to use Studio should take the following steps:
      </p>
      <ol>
        <li>Notify us by email addressed to {emailElement}.  In order for edX to fully and promptly assess and respond to your request, please provide the following information:</li>
        <ul>
          <li>Your name and email address;</li>
          <li>The edX member institution that you are affiliated with;</li>
          <li>A brief description of the challenge or barrier to access that you are experiencing; and</li>
          <li>How soon you need access and for how long (e.g., a planned course start date or in connection with a course-related deadline such as a final essay).</li>
        </ul>
        <li>Within 48 business hours of receiving your request, the edX Support Team will respond to confirm receipt and forward your request to the edX Partner Manager for your institution and the edX Website Accessibility Coordinator.</li>
        <li>With guidance from the Website Accessibility Coordinator, edX will contact you within 5 business days to discuss your request and gather additional information from you to identify a solution.</li>
        <li>EdX will assist you promptly and thoroughly so that you are able to create content on the CMS within your time constraints.  Such efforts may include, but are not limited to: (a) purchasing a third-party tool or software for use on an individual basis to assist your use of Studio, (b) engaging a trained independent contractor to provide real-time visual, verbal and physical assistance, or (c) developing new code to implement a technical fix.</li>
      </ol>
      <p>
        We will communicate with you about your preferences and needs in determining the appropriate solution, although the ultimate decision will be ours, provided that the solution is effective and timely.  The factors we will consider in choosing an accessibility solution are: effectiveness; timeliness (relative to your deadlines); ease of implementation; and ease of use for you.  We will notify you of the decision and explain the basis for our decision within 10 business days of discussing with you.
      </p>
      <p>
        Thereafter, we will communicate with you on a weekly basis regarding our evaluation, decision, and progress in implementing the accessibility solution.  We will notify you when implementation of your accessibility solution is complete and will follow-up with you as may be necessary to see if the solution was effective.
      </p>
      <p>
        EdX will provide ongoing technical support as needed and will address any additional issues that arise after the initial course creation.
      </p>
      <p>
        If you have any questions about this process, you may contact us at {emailElement} or {props.phoneNumber}.
      </p>
      <p>
        Please direct any questions or suggestions on how to improve the accessibility of Studio to {emailElement} or use the form below. We welcome your feedback.
      </p>
    </div>
  );
  /* eslint-enable max-len */
};

AccessibilityBody.propTypes = {
  communityAccessibilityLink: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default AccessibilityBody;
