import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class YoutubeLinks extends Component {
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
          heading={"Youtube Links"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="mt-4">
          <Colxx lg="12">
            <Row className="mt-2">
              <Colxx lg="12">
                <Card className="p-4">
                  <Row>
                    <Colxx lg="12">
                      <p className="h4 font-weight-bold">
                        Published Youtube Video Links of SDGCC
                      </p>
                    </Colxx>
                  </Row>
                  <Row className="mt-2">
                    <Colxx lg="12">
                      {[
                        {
                          name: "SDG Theme Song of Nagaland",
                          link: "https://www.youtube.com/watch?v=k92qbwD7ICI",
                        },
                        {
                          name: "Nagaland SDG Vision 2030 Video",
                          link: "https://www.youtube.com/watch?v=FemBbtAac9s",
                        },
                        {
                          name: "Nagaland SDG Vision 2030 (Promo Video)",
                          link: "https://www.youtube.com/watch?v=rcNnAGABY7w",
                        },
                      ].map((rp, index) => {
                        return (
                          <>
                            <p>
                              <span className="h5">{index + 1}</span>.{" "}
                              <a
                                href={rp.link}
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

export default connect(mapStateToProps, mapActionsToProps)(YoutubeLinks);
