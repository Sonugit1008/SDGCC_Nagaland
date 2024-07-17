import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button, Label } from "reactstrap";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";
import API from "../../helpers/API";

class DownloadReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishedReports: [],
    };
  }

  componentDidMount() {
    this.props.closeSidebar();
    this.viewPublishedReports();
  }

  viewPublishedReports = () => {
    API.get("/api/public/report/")
      .then((res) => {
        let data = res.data;
        this.setState({ publishedReports: data });
      })
      .catch((error) => {});
  };

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Downloads"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="mt-4">
          <Colxx lg="12">
            <Row className="mt-2">
              <Colxx lg="12">
                {this.state.publishedReports.length > 0 ? (
                  <Card className="p-4">
                    <Row>
                      <Colxx lg="12">
                        <p className="h4 font-weight-bold">
                          Published Documents of SDGCC Nagaland
                        </p>
                      </Colxx>
                    </Row>
                    <Row className="mt-2">
                      <Colxx lg="12">
                        {this.state.publishedReports.map((rp, index) => {
                          return (
                            <>
                              <p>
                                <span className="h5">{index + 1}</span>.{" "}
                                <a
                                  href={rp.file}
                                  className="h5 font-weight-bold text-primary"
                                >
                                  {rp.name}
                                </a>
                              </p>
                            </>
                          );
                        })}
                      </Colxx>
                    </Row>
                  </Card>
                ) : (
                  <></>
                )}
              </Colxx>
            </Row>
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

export default connect(mapStateToProps, mapActionsToProps)(DownloadReports);
