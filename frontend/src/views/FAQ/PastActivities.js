import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import PageHeader from "../common/PageHeader";
import { connect } from "react-redux";

class PastActivities extends Component {
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
          heading={"Past Activities"}
          history={this.props.history}
          match={this.props.match}
          back_button={this.props.public ? true : false}
        ></PageHeader>
        <Row className="my-4">
          <Colxx lg="12">
            <Card className="px-2 py-4">
              <Row>
                <Colxx lg="12">
                  {[
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title: "Technology Innovators Meet (Technovation)",
                      description:
                        " The Sustainable Development Goal Coordination Centre (SDGCC) of the Department of Planning & Coordination, in collaboration with Atal Innovation Incubation (AIC) SELCO Foundation, organized a ‘State Level workshop cum Technology Innovation Meet’ named Technovation on 14th March 2023 at Hotel Vivor Kohima.",
                      date: "14 March 2023",
                      link: "/Past-Activities/Innovators Meet 2023.docx.pdf",
                    },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title: "Green Christmas Campaign",
                      description:
                        "Christmas celebration in Nagaland starts right from the first of December till the 25th of December, but while it's the most wonderful time of the year, it's not the most environmentally friendly. The festive season is traditionally the period of peak consumption across the state with high amounts of waste and huge carbon emissions every year. ",
                      date: "25 December",
                      link: "/Past-Activities/Green Christmas Campaign.pdf",
                    },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title: "‘SDG One Stop Destination’ at Hornbill Festival",
                      description:
                        " The Sustainable Development Goals Coordination Centre (SDGCC) of the Planning & Coordination Department, Government of Nagaland has been setting up an ‘SDG One Stop Destination’ at the Hornbill Festival consecutively for two years now since 2021. However, the Hornbill Festival 2021 was called off on the fifth day due to some tragic developments in the state.",
                      date: "1 Dec 2022",
                      link: "/Past-Activities/SDG at Hornbill Festival 2022 _ Outcome Report.pdf",
                    },
                    // {
                    //   img: "/dashboard/assets/img/sdg_logo.jpg",
                    //   title: "UN Ocean Conference 2022",
                    //   description:
                    //     "The Ocean Conference, co-hosted by the Governments of Kenya and Portugal, came at a critical time as the world is seeking to address many of the deep-rooted problems of our societies laid bare by the COVID-19 pandemic and which will require major structural transformations and common shared solutions that are anchored in the SDGs.",
                    //   date: "27 June 2022",
                    //   link: "",
                    // },
                    // {
                    //   img: "/dashboard/assets/img/sdg_logo.jpg",
                    //   title:
                    //     "7th Multi-stakeholder Forum on Science, Technology and Innovation for the Sustainable Development Goals",
                    //   description:
                    //     "The seventh annual Multi-Stakeholder Forum on Science, Technology and Innovation for the SDGs (STI Forum) will be held from 5 to 6 May 2022.",
                    //   date: "5 May 2022",
                    //   link: "",
                    // },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title:
                        "State Level Workshop on ‘NER District Index 2.0, SDG India Index 4.0 and Multidimensional Poverty Index’, Kohima.",
                      description:
                        "A SDG India Index 4.0 and MPI’ was held at the Capital Convention Centre, Kohima on 12th April 2022. The workshop was jointly organized by Sustainable Development Goals Coordination Centre under Planning & Coordination Department, NITI Aayog, and United Nations Development Programme. The program was attended by all the concerned State departments. The State -level workshop was graced by Shri. Imnatiba, Hon’ble Advisor for Industries & Commerce, Labour & Employment, Skill Development & Entrepreneurship, Government of Nagaland",
                      date: "12 April 2022",
                      link: "/Past-Activities/State Level Workshop 2022.pdf",
                    },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title:
                        "District-level Workshops on ‘Building Capacities for Taking Forward SDGs in Nagaland’",
                      description:
                        "Taking forward the Sustainable Development Goals (SDGs) in the state, the SDG Coordination Centre (SDGCC), a team of the Planning & Coordination Department carried out the first SDG Localisation and Integration workshops in all twelve districts of the state. These workshops were held from August 31 – September 22, 2021 reaching out to approximately 350 district-level heads of offices and officials. The aim of these workshops was to sensitize and build capacities of the Head of Offices, and district-level officials of all the relevant departments on the implementation of the SDGs.",
                      date: "31 August 2021",
                      link: "/Past-Activities/District-level Workshops 2021.pdf",
                    },

                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title:
                        "SDG Innovation Participatory Action Research Initiative 1.0",
                      description:
                        "As part of the global Agenda 2030 towards making our planet more sustainable and equitable, Nagaland also has the shared responsibility to make the SDGs a reality for the state, the country, and the world as a whole. In this regard, the ‘SDG Innovation Participatory Action Research Initiative’ was initiated in the year 2021. It has been conceived with the idea of implementing innovative solutions to perennial problems in targeting the six priority SDGs (SDG-2,3,4,8,9 and 11). The initiative mobilized individuals, institutions, and agencies to take action for the achievement of the SDG targets whilst building coalitions across communities and societies promoting ‘minimum cost, maximum impact’.",
                      date: "2021",
                      link: "/Past-Activities/SDG IPAR _ Outcome Report.pdf",
                    },
                    {
                      img: "/dashboard/assets/img/sdg_logo.jpg",
                      title:
                        "State Level Workshop on ‘Building Capacities for taking forward SDGs in Nagaland’ 13th and 14th November 2018, Kohima",
                      description:
                        " Kohima The Government of Nagaland in collaboration with the United Nations Development Programme (UNDP), organized the first State-level workshop engaging all Departments of the State in a dialogue on the SDGs. The two-day workshop set forth strong determination and engagement of all departments in taking ahead the Global Goals. This process marked the identification of nodal officers in all departments. It also laid the foundation of a partnership between UNDP and the Government of Nagaland, for institutionalizing the SDG processes through the SDG Coordination Centre (SDGCC) under the Planning and Coordination Department, Government of Nagaland",
                      date: "13 November 2018",
                      link: "/Past-Activities/State Level Workshop 2018.pdf",
                    },
                  ].map((data) => {
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
                          <Colxx lg="2" className="">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <div className="mb-2">{data.date}</div>
                              {data.link ? (
                                <a
                                  href={data.link}
                                  className="btn btn-primary"
                                  download
                                >
                                  Download
                                </a>
                              ) : (
                                <></>
                              )}
                            </div>
                          </Colxx>
                        </Row>
                      </>
                    );
                  })}
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

export default connect(mapStateToProps, mapActionsToProps)(PastActivities);
