import React, { Suspense } from "react";
import Calculation from "../calculation";
import { StatModel } from "../../types";
import Firebase, { withFirebase } from "../../context/firebase";
import Loading from "../loading";

interface HomeProps {
    firebase: Firebase;
}
interface HomeState {
    models: StatModel[];
    lot: number;
    date: string;
}

const CardsList = React.lazy(() => import("../cards_list"));

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            models: [],
            lot: 0,
            date: new Date().toUTCString()
        };
    }

    modelsCallback = (lot: number, models: StatModel[]) => {
        this.setState({
            models,
            lot,
            date: models[0].Date[0]
        });
    };

    render() {
        const { models } = this.state;
        return (
            <div className="home">
                <div className="calculationBox">
                    <Suspense fallback={<div></div>}>
                        <Calculation
                            callback={this.modelsCallback}
                            models={models}
                        />
                    </Suspense>
                </div>

                {models.length > 0 && (
                    <Suspense fallback={Loading}>
                        <CardsList models={models} />
                    </Suspense>
                )}
            </div>
        );
    }
}

export default withFirebase(Home);
