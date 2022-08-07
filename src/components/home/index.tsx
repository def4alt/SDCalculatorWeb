import { Fragment, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { ProcessedData } from "src/types/common";
import Notes from "src/components/notes";
import { FaPrint } from "react-icons/fa";
import { UserContext } from "src/app";
import { lazy } from "preact-iso";
import Loading from "src/components/loading";
import Calculation from "src/components/calculation";
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
        <div class="">
            <Calculation callback={dataCallback} />

            <Suspense fallback={<Loading />}>
                {data.length > 0 && (
                    <Fragment>
                        <button
                            class="text-4xl text-gray-600 ml-4 w-20 h-20 inline-flex justify-center items-center rounded-md hover:bg-gray-100  hover:cursor-pointer print:hidden"
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
