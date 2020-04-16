import React, { Suspense, useState } from "react";
import { StatModel } from "../../types";
import Loading from "../loading";
import Notes from "../notes";

import "../../styles/component/component.scss";

const Calculation = React.lazy(() => import("../calculation"));
const CardsList = React.lazy(() => import("../cards_list"));

const Home: React.FC = (_) => {
    const [models, setModels] = useState<StatModel[]>([]);
    const [lot, setLot] = useState<number>(0);

    const modelsCallback = (lot: number, models: StatModel[]) => {
        setModels(models);
        setLot(lot);
    };

    return (
        <div className="component">
            <Suspense fallback={<Loading />}>
                <Calculation callback={modelsCallback} />
            </Suspense>

            {models.length > 0 && (
                <>
                    <Notes lot={lot} />
                    <Suspense fallback={<Loading />}>
                        <CardsList models={models} />
                    </Suspense>
                </>
            )}
        </div>
    );
};

export default Home;
