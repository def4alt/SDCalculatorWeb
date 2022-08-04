import React, { useContext, useState } from "react";
import { ProcessedData } from "../../types";
import Notes from "Components/notes";
import { FiPrinter } from "react-icons/fi";
import "Styles/button/button.scss";
import "Styles/home/home.scss";
import { UserContext } from "src/app";

const Calculation = React.lazy(
    () => import(/* webpackPreload: true */ "Components/calculation")
);
const CardsList = React.lazy(
    () => import(/* webpackPrefetch: true */ "Components/card_list")
);

const Home: React.FC = (_) => {
    const [data, setData] = useState<ProcessedData[]>([]);
    const [lot, setLot] = useState<number>(0);
    const user = useContext(UserContext);

    const dataCallback = (lot: number, data: ProcessedData[]) => {
        setData(data);
        setLot(lot);
    };

    return (
        <div className="home">
            <Calculation callback={dataCallback} />

            {data.length > 0 && (
                <>
                    <button
                        className="button_print"
                        onClick={() => window.print()}
                    >
                        <FiPrinter />
                    </button>
                    {user !== null ? <Notes lot={lot} /> : <></>}
                    <CardsList data={data} />
                </>
            )}
        </div>
    );
};

export default Home;
