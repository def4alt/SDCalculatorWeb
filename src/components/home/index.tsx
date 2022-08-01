import React, { Suspense, useState, useRef } from "react";
import { ProcessedData } from "../../types";
import Notes from "Components/notes";
import { MdPrint } from "react-icons/md";

import "Styles/button/button.scss";
import "Styles/home/home.scss";

const Calculation = React.lazy(
    () => import(/* webpackPreload: true */ "Components/calculation")
);
const CardsList = React.lazy(
    () => import(/* webpackPrefetch: true */ "Components/card_list")
);

const Home: React.FC = (_) => {
    const [models, setModels] = useState<ProcessedData[]>([]);
    const [lot, setLot] = useState<number>(0);

    const modelsCallback = (lot: number, models: ProcessedData[]) => {
        setModels(models);
        setLot(lot);
    };

    return (
        <div className="home">
            <Calculation callback={modelsCallback} />

            {models.length > 0 && (
                <>
                    <button
                        className="button_print"
                        onClick={() => window.print()}
                    >
                        <MdPrint />
                    </button>
                    <Notes lot={lot} />
                    <CardsList models={models} />
                </>
            )}
        </div>
    );
};

export default Home;
