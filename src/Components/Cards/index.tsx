import React from "react";

import "./index.scss";

import CardTemplate from "./CardsTemplate";
import { useLocalization, stringsType } from "../Localization";
import { StatisticsModel } from "../Calculation/statistics";
import PrintPage from "../Print";
import ReactToPrint from "react-to-print";

type CardsHolderProps = {
  statisticsModels: StatisticsModel[];
  strings: stringsType;
  lot: string;
};

type CardsHolderState = {
  statisticsModels: StatisticsModel[];
  showStarredCharts: boolean;
  editMode: boolean;
};

class CardsHolder extends React.Component<CardsHolderProps, CardsHolderState> {
  private printObject: HTMLDivElement;
  constructor(props: CardsHolderProps) {
    super(props);

    this.state = {
      statisticsModels: props.statisticsModels,
      showStarredCharts: false,
      editMode: false
    };

    this.printObject = document.createElement("div");
  }

  componentDidUpdate(prevProps: CardsHolderProps) {
    if (this.props.statisticsModels !== prevProps.statisticsModels) {
      this.setState({ statisticsModels: this.props.statisticsModels });
    }
  }

  render() {
    var cards = Array.from(this.state.statisticsModels).map(model => {
      return (
        <CardTemplate
          key={model.TestName + model.SampleType}
          model={model}
          editMode={this.state.editMode}
          showStarredCharts={this.state.showStarredCharts}
        />
      );
    });

    return (
      <div className="cardsRoot">
        <div className="border-bottom center">
          <button
            className="link-button"
            onClick={() =>
              this.setState({
                showStarredCharts: !this.state.showStarredCharts
              })
            }
          >
            {this.props.strings.toggleStarred}
          </button>
          <button
            className="link-button"
            onClick={() => this.setState({ editMode: !this.state.editMode })}
          >
            {this.props.strings.toggleEdit}
          </button>
          <ReactToPrint
            trigger={() => (
              <button
                className="link-button"
                onClick={() =>
                  this.setState({ editMode: !this.state.editMode })
                }
              >
                {this.props.strings.print}
              </button>
            )}
            content={() => this.printObject}
          />
        </div>
        <div style={{ display: "none" }}>
          <PrintPage
            lot={this.props.lot}
            componentRef={el => el && (this.printObject = el)}
          />
        </div>
        <div className="cardsHolder center">{cards}</div>
      </div>
    );
  }
}

export default useLocalization(CardsHolder);
