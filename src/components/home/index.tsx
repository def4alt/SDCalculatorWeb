import React, { Suspense } from "react";
import Calculation from "../calculation";
import { StatModel } from "../../types";
import Firebase, { withFirebase } from "../../context/firebase";
import Loading from "../loading";

import "../../styles/component/component.scss";
import Notes from "../notes";

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
            date: new Date().toUTCString(),
        };
    }

    modelsCallback = async (lot: number, models: StatModel[]) => {
        this.setState({
            models,
            lot,
            date: models[0].Date[0],
        });
    };

    render() {
        const { models, lot } = this.state;
        return (
            <div className="component">
                <Suspense fallback={<div></div>}>
                    <Calculation
                        callback={this.modelsCallback}
                        models={models}
                    />
                </Suspense>

                {models.length > 0 && (
                    <React.Fragment>
                        <Notes lot={lot} />
                        <Suspense fallback={<Loading />}>
                            <CardsList models={models} />
                        </Suspense>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default withFirebase(Home);
