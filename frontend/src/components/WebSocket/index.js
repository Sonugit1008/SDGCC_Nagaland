import React, { Component } from "react";
import { connect } from "react-redux";
import { darsaURL } from "../../constants/defaultValues";
import moment from "moment";
import jwt from "jsonwebtoken";
import { REFRESH_JWT } from "../../redux/actions";

class WebSocketComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      last_connect: null,
    };
    this.socketRef = null;
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.checkConnection = this.checkConnection.bind(this);
    this.timer = null;
  }

  checkConnection() {
    console.log("checking connection");

    if (
      !this.state.connected ||
      moment().diff(this.state.last_connect, "seconds") > 90
    ) {
      console.log("connecting");

      this.connect();
    } else {
      console.log("Connect OK");
      console.log(this.props.jwt);
    }
    const token = localStorage.getItem("jwt");
    console.log(moment().diff(this.state.last_connect, "seconds"));
    var decodedToken = jwt.decode(token, { complete: true });
    if (decodedToken) {
      var exdate = new Date().getTime() / 1000;
      let isExpired = false;
      if (decodedToken.payload.exp < exdate) isExpired = true;

      if (isExpired) {
        this.props.refreshhjwt();
        console.log("Refreshed");
      }
    }
  }

  connect() {
    if (this.props.jwt && this.props.channel_list) {
      console.log("start connect");
      let url = "facility";
      if (this.props.channel_name === "facility") {
        url = "sfacility";
      } else if (this.props.channel_name === "company") {
        url = "facility";
      }

      const path = `wss://${darsaURL}/ws/${url}/${
        this.props.channel_list[0]
      }/?token=${localStorage.getItem("jwt")}`;
      console.log(path);
      this.socketRef = new WebSocket(path);
      console.log(this.socketRef);
      this.socketRef.onopen = () => {
        console.log("WebSocket open");
        this.setState({ connected: true });
      };

      this.socketRef.onmessage = (e) => {
        var obj = JSON.parse(e.data);
        console.log(obj);

        if (obj.message) {
          this.setState({ last_connect: moment() });
        }
        console.log(obj.type);
        // this.socketNewMessage(e.data);
      };
      this.socketRef.onerror = (e) => {
        console.log("socket error");
        console.log(e);
        console.log(e.message);
      };
      this.socketRef.onclose = () => {
        this.setState({ connected: false });
        console.log("WebSocket closed");
      };
      console.log(this.socketRef);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    if (this.socketRef) this.socketRef.close();
  }

  disconnect() {
    this.socketRef.close();
  }

  componentDidMount() {
    console.log("mounted");
    console.log(this.props.jwt);
    if (this.props.jwt) {
      this.connect(this.props.jwt);
    }

    this.timer = setInterval(() => {
      this.checkConnection();
    }, 30000);
  }

  render() {
    return <div></div>;
  }
}

WebSocketComponent.propTypes = {};

const mapStateToProps = ({ authUser }) => {
  const { jwt, channel_name, channel_list } = authUser;

  return {
    jwt,
    channel_list,
    channel_name,
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    refreshhjwt: () => dispatch({ type: REFRESH_JWT }),
  };
};

export default connect(mapStateToProps, mapActionsToProps)(WebSocketComponent);
