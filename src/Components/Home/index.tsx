import React, { Component, Suspense } from "react";
import { withAuthorization } from "../Session";

import Calculation from "../Calculation";

import "./index.scss";

import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";

import Firebase, { withFirebase } from "../Firebase";

const LazyCards = React.lazy(() => import("../Cards"));

type HomePageProps = {
  strings: stringsType;
  firebase: Firebase;
};

type HomePageState = {
  statisticsModels: StatisticsModel[];
  date: string;
  lot: string;
  lastname: string;
  notes: string;
  units: string;
  deviceName: string;
  displayCalc: boolean;
};

class HomePage extends Component<HomePageProps, HomePageState> {
  listener?: EventListener;

  constructor(props: HomePageProps) {
    super(props);

    this.state = {
      statisticsModels: [],
      date: "",
      lot: "",
      lastname: "",
      notes: "",
      units: "",
      deviceName: "",
      displayCalc: true
    };

    this.handleScroll = this.handleScroll.bind(this);
  }
  myCallback = (dataFromChild: {
    statisticsModels: StatisticsModel[];
    lot: string;
  }) => {
    this.setState({ statisticsModels: dataFromChild.statisticsModels });

    if (dataFromChild.statisticsModels.length > 0) {
    }

    this.setState({
      date: dataFromChild.statisticsModels[0].Date[0],
      lot: dataFromChild.lot
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);

    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser =>
      authUser
        ? this.props.firebase.backup(authUser.uid).once("value", snapshot => {
            const backupsObject = snapshot.val();

            if (backupsObject && backupsObject.details) {
              this.setState({
                lot: backupsObject.details.lot,
                date: backupsObject.details.date,
                lastname: backupsObject.details.lastname,
                deviceName: backupsObject.details.deviceName,
                notes: backupsObject.details.notes,
                units: backupsObject.details.units
              });
            }
          })
        : null
    );
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    let scrollTop = window.scrollY;
    if (
      scrollTop > window.outerHeight / 2 &&
      this.state.displayCalc &&
      this.state.statisticsModels.length > 0
    ) {
      window.scrollTo(0, 0);
      this.setState({ displayCalc: false });
    }
  }

  render() {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.currentTarget.name;
      const value = event.currentTarget.value;
      if (name === "notes") {
        this.setState({
          notes: value
        });
      }
      if (name === "lastname") {
        this.setState({
          lastname: value
        });
      }
      if (name === "deviceName") {
        this.setState({
          deviceName: value
        });
      }
      if (name === "date") {
        this.setState({
          date: value
        });
      }
      if (name === "units") {
        this.setState({
          units: value
        });
      }
      event.preventDefault();
    };

    const handleDetailsChange = (event: React.ChangeEvent<HTMLFormElement>) => {
      if (this.props.firebase.auth.currentUser) {
        var backupsObject = {};

        const backups = this.props.firebase.backup(
          this.props.firebase.auth.currentUser.uid
        );

        backups.on("value", snapshot => (backupsObject = snapshot.val()));

        backups.set({
          ...backupsObject,
          details: {
            lot: this.state.lot,
            date: this.state.date,
            deviceName: this.state.deviceName,
            lastname: this.state.lastname,
            notes: this.state.notes,
            units: this.state.units
          }
        });

        event.preventDefault();
      }
    };

    return (
      <div className="homeRoot">
        <div className="calculationBox" hidden={!this.state.displayCalc}>
          <Calculation
            callback={this.myCallback}
            statisticsModels={this.state.statisticsModels}
          />
        </div>
        <div className="arrowBtn" hidden={this.state.displayCalc}>
          <button onClick={() => this.setState({ displayCalc: true })}>
            <i className="arrow up"></i>
          </button>
        </div>

        {this.state.statisticsModels.length > 0 && (
          <div className="infoBox">
            <div className="detailsBox">
              <h5>{this.props.strings.details}</h5>
              <div className="detailsContent">
                <form onSubmit={handleDetailsChange}>
                  <label>{this.props.strings.date}:</label>
                  <input
                    className="dateInput"
                    type="text"
                    value={this.state.date}
                    name="date"
                    onChange={handleChange}
                  />
                  <hr />
                  <label>
                    {this.props.strings.lot}: {this.state.lot}
                  </label>
                  <hr />
                  <label>Operator's lastname:</label>
                  <input
                    className="lastnameInput"
                    type="text"
                    value={this.state.lastname}
                    name="lastname"
                    onChange={handleChange}
                  />
                  <hr />
                  <label>Device name:</label>
                  <input
                    className="deviceNameInput"
                    type="text"
                    value={this.state.deviceName}
                    name="deviceName"
                    onChange={handleChange}
                  />
                  <hr />
                  <label>Units:</label>
                  <input
                    className="unitsInput"
                    type="text"
                    value={this.state.units}
                    name="units"
                    onChange={handleChange}
                  />

                  <hr />
                  <label>Notes:</label>
                  <input
                    className="notesInput"
                    type="text"
                    value={this.state.notes}
                    name="notes"
                    onChange={handleChange}
                  />
                  <button type="submit" className="updateButton">
                    Update
                  </button>
                </form>
              </div>
            </div>
            <div className="abbreviations">
              <h5>Abbreviations</h5>
              <div className="abbreviationsContent">
                <h6>13S</h6>
                <p>{this.props.strings.abr13S}</p>
                <hr />
                <h6>22S</h6>
                <p>{this.props.strings.abr22S}</p>
                <hr />
                <h6>R4S</h6>
                <p>{this.props.strings.abrR4S}</p>
                <hr />
                <h6>41S</h6>
                <p>{this.props.strings.abr41S}</p>
                <hr />
                <h6>8X</h6>
                <p>{this.props.strings.abr8X}</p>
              </div>
            </div>
            <Suspense fallback={<div className="loadingCircle"></div>}>
              <LazyCards statisticsModels={this.state.statisticsModels} />
            </Suspense>
          </div>
        )}
      </div>
    );
  }
}

export default withAuthorization(authUser => (authUser !== null ? true : true))(
  useLocalization(withFirebase(HomePage))
);
