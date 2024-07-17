import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class DisclaimerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.closeSidebar();
  }
  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Disclaimer"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row>
          <Colxx lg="12">
            <Card className="p-4 my-4">
              <p className="h5 text-justify font-weight-bold">
                DISCLAIMER FOR NAGALAND SDG DASHBOARD, DEPARTMENT OF PLANNING &
                TRANSFORMATION, NAGALAND
              </p>
              <p className="text-justify">
                If you require any more information or have any questions about
                our site’s disclaimer, please feel free to contact us by email
                at sdgnagaland@gmail.com
              </p>
              <p className="text-justify">
                All the information on this website is published in good faith
                and efforts have been made to make the information as accurate
                as possible. The Department of Planning and Coordination does
                not make any warranties about the completeness, reliability and
                accuracy of this information. Any action you take upon the
                information you find on this dashboard is strictly at your own
                risk. Department will not be responsible for any technical,
                hardware or software failures of any kind; lost or unavailable
                network connections; incomplete, modified, or delayed
                transmissions.
              </p>
              <p className="text-justify">
                Certain links on the site may lead to resources located on
                servers maintained by other parties. While we strive to provide
                only quality links and sources to useful and ethical websites,
                we have no control over the content and nature of these sites.
                We accept no responsibility or liability for any of the material
                contained on these servers. The hyperlinks/sources given to
                external sites do not constitute an endorsement of information,
                products or services offered by them. Please note that this page
                also provides links to the websites/web pages of Government
                Ministries/Departments/Districts. The content of these websites
                is owned by the respective Departments.
              </p>
              <p className="text-justify">
                Please be also aware that when you leave our website, other
                sites may have different privacy policies and terms which are
                beyond our control. Please be sure to check the Privacy Policies
                of these sites as well as their “Terms of Service” before
                engaging in any business or uploading any information.
              </p>
              <p className="h5 text-justify font-weight-bold">CONSENT</p>
              <p className="text-justify">
                By using our website, you hereby consent to our disclaimer and
                agree to its terms.
              </p>
              <p className="h5 text-justify font-weight-bold">UPDATE</p>
              <p className="text-justify">
                Should we update, amend, or make any changes to this document,
                those changes will be prominently posted here. For any future
                updates please visit this system from time to time.
              </p>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { timezone } = authUser;

  return {
    timezone,
  };
};

const mapActionsToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapActionsToProps)(DisclaimerPage);
