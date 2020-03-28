import React, { Suspense } from "react";
import Calculation from "../calculation";
import { StatModel } from "../../types";
import Loading from "../loading";
import Firebase, { withFirebase } from "../../context/firebase";

interface HomeProps {
    firebase: Firebase;
}
interface HomeState {
    models: StatModel[];
    lot: number;
    date: Date;
}

const CardsList = React.lazy(() => import("../cards_list"));

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            models: [],
            lot: 0,
            date: new Date()
        };
    }

    modelsCallback = (lot: number, models: StatModel[]) => {
        this.setState({
            models,
            lot,
            date: models[0].Date[0]
        });

        if (!this.props.firebase.auth.currentUser) return;

        const backups = this.props.firebase.backup(
            this.props.firebase.auth.currentUser!.uid
        );

        backups.on("value", (snapshot: any) => {
            const backupsObject = snapshot.val();
            backups.set({
                ...backupsObject,
                [lot]: {
                    models
                }
            });
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

export default withFirebase(Home);
