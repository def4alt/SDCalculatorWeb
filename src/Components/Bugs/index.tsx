import React from "react";
import Firebase, { withFirebase } from "../Firebase";

import moment from "moment";
import { useLocalization, stringsType } from "../Localization";

import "./index.scss";

const modalState = {
  show: {
    visibility: "visible",
    opacity: 1,
    pointerEvents: "auto"
  },
  hide: {
    visibility: "hidden",
    opacity: 0,
    pointerEvents: "none"
  }
};

type BugsPageProps = {
  strings: stringsType;
  firebase: Firebase;
};

type BugsPageState = {
  bugs: Array<{ title: string, about: string, dateTime: number, id: number }>;
  loading: boolean;
  title: string;
  about: string;
  modalState: {};
};

class BugsPage extends React.Component<BugsPageProps, BugsPageState> {
  constructor(props: BugsPageProps) {
    super(props);

    this.state = {
      bugs: [],
      loading: false,
      title: "",
      about: "",
      modalState: modalState.hide
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeAbout = this.onChangeAbout.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.bugs().on("value", snapshot => {
      const bugsObject = snapshot.val();

      if (bugsObject) {
        const bugsList = Object.keys(bugsObject).map(key => ({
          ...bugsObject[key],
          uid: key
        }));

        this.setState({ bugs: bugsList, loading: false });
      }
    });
  }

  onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === "title")
      this.setState({ title: event.currentTarget.value });
  };

  onChangeAbout = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.name === "about")
      this.setState({ about: event.currentTarget.value });
  };

  handleClose = () => {
    this.setState({ modalState: modalState.hide });

    const { title, about, bugs } = this.state;

    if (title !== "") {
      const dateTime = moment(new Date().toUTCString())
        .toDate()
        .getTime();
      const id = this.state.bugs.length;
      const newBug = {
        title,
        about,
        dateTime,
        id
      };

      this.setState({ bugs: [...bugs, newBug] });

      this.props.firebase.bugs().set([...bugs, newBug]);
    }
  }

  handleShow = () => this.setState({ modalState: modalState.show });

  render() {
    return (
      <div className="bugsBox">
        <h1>
          {this.props.strings.bugs + " "}
          <button
            className="newBugButton"
            onClick={() => this.handleShow()}
          >
            {this.props.strings.newBug}
          </button>
        </h1>
        {this.state.bugs.map(bug => (
          <div className="bug">
            <div className="bugHeader">
              <strong className="mr-auto">
                {bug.title} #{bug.id}
              </strong>
              <small>
                {Math.round(
                  (moment(new Date().toUTCString())
                    .toDate()
                    .getTime() -
                    bug.dateTime) /
                  1000 /
                  60
                )}{" "}
                {this.props.strings.minAgo}
              </small>
            </div>
            {bug.about !== "" && (
              <div className="bugContent">{bug.about}</div>
            )}
          </div>
        ))}
        <div className="modal-window" style={this.state.modalState}>
          <div className="container">
            <button
              onClick={() =>
                this.setState({ modalState: modalState.hide })
              }
              title="Close"
              className="close"
            ></button>
            <h1 className="newBugTitle">
              {this.props.strings.newBug}
            </h1>
            <form>
              <div>
                <input
                  name="title"
                  className="title"
                  onChange={this.onChangeTitle}
                  type="text"
                  placeholder={this.props.strings.title}
                />
              </div>
              <div>
                <textarea
                  name="about"
                  className="about"
                  onChange={this.onChangeAbout}
                  placeholder={
                    this.props.strings.leaveComment
                  }
                />
              </div>
            </form>
            <div>
              <button className="submitBug" onClick={this.handleClose}>
                {this.props.strings.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default withFirebase(useLocalization(BugsPage));
