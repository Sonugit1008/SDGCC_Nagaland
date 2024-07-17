import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class UpcomingActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        // {
        //   img: "/dashboard/assets/img/sdg_logo.jpg",
        //   title:
        //     "Sustainable recovery and resilience towards the achievement of the Sustainable Development Goals",
        //   description:
        //     "The National Webinar/Virtual National Consultation is part of the second phase of cooperation between the Department of Economic and Social Affairs, United Nations Office for Sustainable Development and UNRCO and UNCT in support of capacity-building.",
        //   date: "27 September 2022",
        // },
        // {
        //   img: "/dashboard/assets/img/sdg_logo.jpg",
        //   title: "UN 2023 Water Conference",
        //   description:
        //     "The resolution ( A/RES/73/226) calls for a Conference on the Midterm Comprehensive Review of the Implementation of the Objectives of the International Decade for Action to be convened in New York from 22 to 24 March 2023.",
        //   date: "22 March 2023",
        // },
      ],
    };
  }
  componentDidMount() {
    this.props.closeSidebar();
  }
  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"Upcoming Activities"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="my-4">
          <Colxx lg="12">
            <Card className="px-2 py-4">
              <Row>
                <Colxx lg="12">
                  {this.state.data.length > 0 ? (
                    this.state.data.map((data) => {
                      return (
                        <>
                          <Row className="d-flex flex-row mb-3 pb-3 border-bottom">
                            <Colxx lg="1">
                              <img
                                src={data.img}
                                alt={data.title}
                                className="img-fluid border-0 rounded-circle"
                              />
                            </Colxx>
                            <Colxx lg="9">
                              <div className="text-justify">
                                <p className="font-weight-bold h6">
                                  {data.title}
                                </p>
                                <p>{data.description}</p>
                              </div>
                            </Colxx>
                            <Colxx lg="2">
                              <p>{data.date}</p>
                            </Colxx>
                          </Row>
                        </>
                      );
                    })
                  ) : (
                    <> No Data Available</>
                  )}
                </Colxx>
              </Row>
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

export default connect(mapStateToProps, mapActionsToProps)(UpcomingActivities);
