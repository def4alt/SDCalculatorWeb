import React, { Suspense, useState, useRef } from "react";
import { StatModel } from "../../types";
import Loading from "../loading";
import Notes from "../notes";
import ReactToPrint from "react-to-print";
import { MdPrint } from "react-icons/md";

import "../../styles/button/button.scss";

const Calculation = React.lazy(() => import("../calculation"));
const CardsList = React.lazy(() => import("../card_list"));

const Home: React.FC = (_) => {
    const [models, setModels] = useState<StatModel[]>([]);
    const [lot, setLot] = useState<number>(0);
    const printRef = useRef<HTMLDivElement>(null);

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
                <>
                    <ReactToPrint
                        trigger={() => (
                            <button className="button_icon">
                                <MdPrint />
                            </button>
                        )}
                        content={() => printRef.current}
                    />
                    <Suspense fallback={<Loading />}>
                        <div ref={printRef}>
                            <Notes lot={lot} />
                            <CardsList models={models} />
                        </div>
                    </Suspense>
                </>
            )}
        </div>
    );
};

export default Home;
