import React, { Component, Fragment } from "react";
import {
  Card,
  Row,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardFooter,
} from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Link } from "react-router-dom";

class UserCard extends Component {
  render() {
    return (
      <div>
        {
          <Fragment>
            <Row className="rounded">
              {this.props.users.map((user) => {
                return (
                  <Colxx lg="4" key={user.id}>
                    <Card className="mt-4">
                      <div className="d-flex flex-row">
                        <a class="d-flex mt-4 mr-4" href="/">
                          <img
                            alt="Thumbnail"
                            src="/dashboard/assets/img/profile-pic-blank.png"
                            class="img-thumbnail list-thumbnail align-self-center rounded-circle ml-4"
                          ></img>
                        </a>

                        <div className=" d-flex flex-grow-1 min-width-zero">
                          <div className="align-self-top  m-8 mt-4">
                            <div className="mb-1 card-subtitle">
                              {" "}
                              <Link
                                style={{ padding: 0 }}
                                to={`/app/usermanagement/edit/${user.id}`}
                              >
                                {user.email}
                              </Link>{" "}
                            </div>{" "}
                            <p className="text-muted text-small mb-2 card-text">
                              {`${user.first_name} ${user.last_name}`}
                            </p>
                            <p className="text-muted text-small mb-2 card-text">
                              {user.company.map((comp) => `${comp} `)}
                            </p>
                            <p className="text-muted text-small mb-2 card-text">
                              {user.groups.map((group) => `${group} `)}
                            </p>
                          </div>
                        </div>

                        <div className="align-self-top m-2">
                          <UncontrolledButtonDropdown color="link">
                            <DropdownToggle
                              color="link"
                              style={{ color: "rgb(192, 192, 192)" }}
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() => {
                                  return this.props.history.push({
                                    pathname: "/app/usermanagement/add/",
                                    state: { detail: user },
                                  });
                                }}
                              >
                                {" "}
                                Edit
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>

                          <p></p>
                        </div>
                      </div>
                      <CardFooter></CardFooter>
                    </Card>
                  </Colxx>
                );
              })}
            </Row>
          </Fragment>
        }
      </div>
    );
  }
}

export default UserCard;
