import React, { Suspense } from "react";
import Calculation from "../calculation";
import { StatModel } from "../../types";
import Loading from "../loading";
import CardsList from "../cards_list";

interface HomeProps {}
interface HomeState {
    models: StatModel[];
    lot: number;
    date: Date;
}

class Home extends React.Component<HomeProps, HomeState> {
    componentWillMount() {
        this.setState({
            models: [],
            lot: 0,
            date: new Date()
        });
    }

    modelsCallback = (lot: number, models: StatModel[]) => {
        this.setState({
            models,
            lot,
            date: models[0].Date[0]
        });
    };

    render() {
        return (
            <div className="home">
                <div className="calculationBox">
                    <Calculation
                        callback={this.modelsCallback}
                        models={this.state.models}
                    />
                </div>

                {this.state.models.length > 0 && (
                    <Suspense fallback={<Loading />}>
                        <CardsList models={this.state.models} />
                    </Suspense>
                )}
            </div>
        );
    }
}

export default Home;
