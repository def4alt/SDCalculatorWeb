import React, {
    Suspense,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { StatModel } from "../../types";
import Loading from "Components/loading";
import { LocalizationContext } from "Context/localization";

import "Styles/card-list/card-list.scss";
import "Styles/button/button.scss";

const Card = React.lazy(() => import("Components/card"));

interface CardsListProps {
    models: StatModel[];
}

const CardsList: React.FC<CardsListProps> = (props) => {
    const [width, setWidth] = useState<number>(0);
    const [showSDCV, setShowSDCV] = useState<boolean>(true);
    const localization = useContext(LocalizationContext).localization;

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => window.removeEventListener("resize", resizeHandler);
    });

    const resizeHandler = () => {
        const a4Width = 1123;
        const width = window.innerWidth < a4Width ? window.innerWidth : a4Width;

        setWidth(
            250 + 100 * props.models[0].Average.length > width - 80
                ? width - 80
                : 250 + 100 * props.models[0].Average.length
        );
    };

    const cards = useMemo(() => {
        return props.models.map((model: StatModel, i: number) => (
            <Card model={model} showSDCV={showSDCV} key={i} width={width} />
        ));
    }, [props.models, width, showSDCV]);

    return (
        <div className="card-list">
            <div className="card-list__header">
                <button
                    className="button_link"
                    onClick={() => setShowSDCV(!showSDCV)}
                >
                    {showSDCV ? localization.hide : localization.show} SD / CV
                </button>
            </div>
            <Suspense fallback={<Loading />}>{cards}</Suspense>
        </div>
    );
};

export default CardsList;
