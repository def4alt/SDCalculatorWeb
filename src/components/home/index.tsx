import React, { Suspense, useState } from "react";
import Calculation from "../calculation";
import { StatModel } from "../../types";
import Loading from "../loading";

import "../../styles/component/component.scss";
import Notes from "../notes";

const CardsList = React.lazy(() => import("../cards_list"));

const Home: React.FC = (_) => {
    const [models, setModels] = useState<StatModel[]>([]);
    const [lot, setLot] = useState<number>(0);

    const modelsCallback = async (lot: number, models: StatModel[]) => {
        setModels(models);
        setLot(lot);
    };
    return (
        <div className="component">
            <Suspense fallback={<div></div>}>
                <Calculation callback={modelsCallback} models={models} />
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
};

export default Home;
