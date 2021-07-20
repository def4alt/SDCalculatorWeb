import React, { Suspense, useState, useRef } from "react";
import { StatModel } from "../../types";
import Loading from "Components/loading";
import Notes from "Components/notes";
import { MdPrint } from "react-icons/md";

import "Styles/button/button.scss";
import "Styles/home/home.scss";

const Calculation = React.lazy(() => import("Components/calculation"));
const CardsList = React.lazy(() => import("Components/card_list"));

const Home: React.FC = (_) => {
    const [models, setModels] = useState<StatModel[]>([]);
    const [lot, setLot] = useState<number>(0);

    const modelsCallback = (lot: number, models: StatModel[]) => {
        setModels(models);
        setLot(lot);
    };

    return (
        <div className="home">
            <Suspense fallback={<Loading />}>
                <Calculation callback={modelsCallback} />
            </Suspense>

            {models.length > 0 && (
                <Suspense fallback={<Loading />}>
                    <button
                        className="button_print"
                        onClick={() => window.print()}
                    >
                        <MdPrint />
                    </button>
                    <Notes lot={lot} />
                    <CardsList models={models} />
                </Suspense>
            )}
        </div>
    );
};

export default Home;
