import React from "react";

import { ThemeContext } from "./index";
import Firebase, { withFirebase } from "../firebase";
import { withCookies, ReactCookieProps } from "react-cookie";

interface withThemeProps extends ReactCookieProps {
  firebase: Firebase;
}

type withThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
};

const withTheme = <P extends object>(Component: React.ComponentType<P>) => {
  class WithTheme extends React.Component<P & withThemeProps, withThemeState> {
    listener?: EventListener;

    constructor(props: P & withThemeProps) {
      super(props);

      this.toggleTheme = this.toggleTheme.bind(this);

      this.state = {
        isDark: false,
        toggleTheme: this.toggleTheme
      };
    }

    toggleTheme() {
      const isDark: boolean = !this.state.isDark;
      this.setState({
        isDark: !this.state.isDark
      });

      if (this.props.firebase.auth.currentUser) {
        const backups = this.props.firebase.backup(
          this.props.firebase.auth.currentUser.uid
        );

        var backupsObject: any = null;
        backups.on("value", snapshot => (backupsObject = snapshot.val()));

        backups.set({
          ...backupsObject,
          isDark: JSON.stringify(isDark)
        });
      }

      const bodyEl = document.querySelector("body");

      bodyEl &&
        (isDark
          ? bodyEl.classList.add("dark")
          : bodyEl.classList.remove("dark"));

      this.props.cookies &&
        this.props.cookies.set("isDark", JSON.stringify(isDark), {
          path: "/"
        });
    }

    componentDidMount() {
      var isDark: boolean | undefined =
        this.props.cookies && this.props.cookies.get("isDark") === "true";

      if (isDark) {
        this.setState({ isDark });
      } else {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          authUser =>
            authUser &&
            this.props.firebase.backup(authUser.uid).on("value", snapshot => {
              isDark = snapshot.val().isDark === "true";
              this.setState({
                isDark: isDark
              });
            })
        );
      }

      const bodyEl: Element | null = document.querySelector("body");
      bodyEl &&
        (isDark
          ? bodyEl.classList.add("dark")
          : bodyEl.classList.remove("dark"));
    }

    

    componentWillUnmount() {
      this.listener = undefined;
    }

    render() {
      return (
        <ThemeContext.Provider value={this.state}>
          <Component {...(this.props as P)} />
        </ThemeContext.Provider>
      );
    }
  }

  return withCookies(withFirebase(WithTheme));
};

export default withTheme;
