import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class FAQs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedSteps: [],
    };
  }

  handleSteps(step) {
    let openedSteps = this.state.openedSteps;
    if (openedSteps.includes(step)) {
      openedSteps = openedSteps.filter((stp) => stp !== step);
    } else {
      openedSteps.push(step);
    }

    this.setState({ openedSteps });
  }

  componentDidMount() {
    if (this.props.public) this.props.closeSidebar();
  }

  render() {
    return (
      <Fragment>
        <PageHeader
          heading={"FAQs"}
          history={this.props.history}
          match={this.props.match}
          add_new={this.props.permission?.write}
          add_new_url={"/app/faqs/add"}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row>
          <Colxx lg="8">
            <>
              <Card className="d-flex my-2 mt-3">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">1.&nbsp; What are SDGs?</div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("aboutsdg");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("aboutsdg")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("aboutsdg") ? (
                <>
                  <p className="ml-2 mt-2">
                    The Sustainable Development Goals (SDGs) are a collection of
                    17 global goals that are: 1. No Poverty, 2. Zero Hunger, 3.
                    Good Health and Well-Being, 4. Quality Education, 5. Gender
                    Equality, 6. Clean Water and Sanitation, 7. Affordable and
                    Clean Energy, 8. Decent Work and Economic Growth, 9.
                    Industry, Innovation and Infrastructure, 10. Reduced
                    Inequalities, 11. Sustainable Cities and Communities, 12.
                    Responsible Consumption and Production, 13. Climate Action,
                    14. Life Below Water, 15. Life on Land, 16. Peace, Justice
                    and Strong Institutions, 17. Partnerships for the Goals. The
                    SDG’s are designed to serve as a blueprint to achieve a
                    better and more sustainable future for all. The SDGs, was
                    set in 2015 by the United Nations General Assembly through
                    participatory involvement of 193 member nations and are
                    intended to be achieved by 2030.
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">2.&nbsp;Why are the SDGs created?</div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("aboutsdggoal");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("aboutsdggoal")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("aboutsdggoal") ? (
                <>
                  <p className="ml-2 mt-2">
                    The Sustainable Development Goals (SDGs) aims to ‘leave no
                    one behind’ and to ‘reach the furthest behind first’. Hence,
                    they have been created for everyone, right from citizens to
                    representatives of civil society, and local authorities,
                    including local communities, volunteer groups and
                    foundations, migrants and families, as well as older persons
                    and persons with disabilities and national governments,
                    non-profits, academia etc.
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">3.&nbsp;Why are they important?</div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("sdgimportant");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("sdgimportant")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("sdgimportant") ? (
                <>
                  <p className="ml-2 mt-2">
                    SDGs are important as they promote a long-term approach to
                    addressing global challenges through joint action. The SDGs
                    are a universal call to take action in order to end poverty,
                    protect the planet and ensure that all people enjoy peace
                    and prosperity by 2030. Inclusion is the core of the 2030
                    Agenda for Sustainable Development. Everyone can contribute
                    to achieving SDGs and every contribution small or big will
                    make an impact on our world.
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">
                      4.&nbsp;What is Nagaland SDG Dashboard?
                    </div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("sdgdash");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("sdgdash")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("sdgdash") ? (
                <>
                  <p className="ml-2 mt-2">
                    The Nagaland SDG Dashboard is an initiative of the SDG
                    Coordination Centre (SDGCC), Planning & Coordination
                    Department, Government of Nagaland with technical support
                    from UNDP towards localisation and integration of SDGs at
                    the State and District levels for real-time reporting,
                    analysing, monitoring and evaluating the performance of the
                    State in the implementation of SDGs.
                  </p>
                  <p className="ml-2 mt-2">
                    The SDG M&E Framework for the State and the Districts have
                    been developed and the State has also formulated the SDG
                    Vision 2030 document which sets targets for itself for
                    achieving the SDGs within the state. In order to ensure that
                    the targets are achieved, the State has initiated concurrent
                    monitoring of performance at the district and State level to
                    support the State in decision making for accelerating the
                    schemes and programmes in the run up to achieve SDGs. The
                    SDG Dashboard is an important instrument for this objective.
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">
                      5.&nbsp;What are the objectives of Nagaland SDG Dashboard?
                    </div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("sdgobjective");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("sdgobjective")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("sdgobjective") ? (
                <>
                  <p className="ml-2 mt-2">
                    The key objectives of Nagaland SDG Dashboard are:
                  </p>
                  <p className="ml-4 mt-2">
                    Identify critical gaps and challenges in performance and
                    achievements in State and District level in order to
                    strategize necessary corrective measures.
                  </p>
                  <p className="ml-4 mt-2">
                    Enable intra and inter-state disparities across the eight
                    states of the region so that suitable interventions can be
                    undertaken to iron them out.
                  </p>
                  <p className="ml-4 mt-2">
                    Promote healthy competition among the Districts of the State
                    in their journey towards achieving the Goals.
                  </p>
                  <p className="ml-4 mt-2">
                    Identify data gaps in the statistical system of the State
                    and the sectors in which robust and more frequent data
                    collection needs to be there.
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">
                      6.&nbsp;What are Achiever, Front Runner, Performer or
                      Aspirant categories as per Nagaland SDG Dashboard?
                    </div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("sdgcategories");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("sdgcategories")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("sdgcategories") ? (
                <>
                  <p className="ml-2 mt-2">
                    The composite score ranges between 0 and 100. (If a State/
                    District achieves a score of 100, it signifies that the
                    State has achieved the national target set for 2030. On the
                    other hand, if a State achieves a score of 0, it signifies
                    that the State/ District is the worst performer)
                  </p>
                  <p className="ml-2 mt-2">
                    Based on the score, the goals/ districts/ States are
                    classified into four categories :
                  </p>
                  <p className="ml-4 mt-2">
                    Achiever (Blue) – when the SDG India Index score is equal to
                    100
                  </p>
                  <p className="ml-4 mt-2">
                    Front Runner (Green) – when the SDG India Index score is
                    less than 100 but greater than or equal to 65
                  </p>
                  <p className="ml-4 mt-2">
                    Performer (Yellow) – when the SDG India Index score is less
                    than 65 but greater than or equal to 50
                  </p>
                  <p className="ml-4 mt-2">
                    Aspirant (Red) – when SDG the India Index score is less than
                    50
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
            <>
              <Card className="d-flex my-2">
                <div className="d-flex flex-grow-1 min-width-zero">
                  <CardBody className="p-2">
                    <div className="h6">
                      7.&nbsp;To whom do I reach out for comments/suggestions on
                      the SDG Index and Dashboard?
                    </div>
                  </CardBody>

                  <div
                    className={
                      "pl-1 pr-4 d-flex justify-content-center align-items-center cursor-pointer"
                    }
                    onClick={() => {
                      this.handleSteps("sdgcmnt");
                    }}
                  >
                    <i
                      className={
                        this.state.openedSteps.includes("sdgcmnt")
                          ? "iconsminds-arrow-up"
                          : "iconsminds-arrow-down"
                      }
                    ></i>
                  </div>
                </div>
              </Card>
              {this.state.openedSteps.includes("sdgcmnt") ? (
                <>
                  <p className="ml-2 mt-2">
                    We welcome comments/ suggestions for improving the SDG Index
                    and Dashboard. Please share it with{" "}
                    <b>sdgnagaland@gmail.com</b>
                  </p>
                </>
              ) : (
                <></>
              )}
            </>
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

export default connect(mapStateToProps, mapActionsToProps)(FAQs);
