import { Fragment, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { ProcessedData } from "../../types";
import Notes from "src/components/notes";
import { FaPrint } from "react-icons/fa";
import "src/styles/button/button.scss";
import "src/styles/home/home.scss";
import { UserContext } from "src/app";
import { lazy } from "preact-iso";
import Loading from "../loading";
import Calculation from "../calculation";
import { Suspense } from "preact/compat";

const CardsList = lazy(() => import("src/components/card_list"));

const Home: React.FC = (_) => {
    const [data, setData] = useState<ProcessedData[]>([]);
    const [lot, setLot] = useState<number>(0);
    const user = useContext(UserContext);

    const dataCallback = (lot: number, data: ProcessedData[]) => {
        setData(data);
        setLot(lot);
    };

    return (
        <div class="home">
            <Calculation callback={dataCallback} />

            <Suspense fallback={<Loading />}>
                {data.length > 0 && (
                    <Fragment>
                        <button
                            class="button_print"
                            onClick={() => window.print()}
                        >
                            <FaPrint />
                        </button>
                        {user !== null ? (
                            <Notes lot={lot} />
                        ) : (
                            <Fragment></Fragment>
                        )}
                        <CardsList data={data} />
                    </Fragment>
                )}
            </Suspense>
        </div>
    );
};

export default Home;
