import React, { useState, useEffect, useMemo, Suspense } from "react";
import { StatModel } from "../../types";

import "../../styles/cards-list/cards-list.scss";
import Loading from "../loading";

const Card = React.lazy(() => import("../card"));

interface CardsListProps {
    models: StatModel[];
}

const CardsList: React.FC<CardsListProps> = (props) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        window.addEventListener("resize", a4ResizeHandler);
        a4ResizeHandler();

        return () => window.removeEventListener("resize", a4ResizeHandler);
    });

    const a4ResizeHandler = () => {
        const a4Width = 1123;

        setWidth(
            250 + 100 * props.models[0].Average.length > a4Width - 80
                ? a4Width - 80
                : 250 + 100 * props.models[0].Average.length
        );
    };

    const cards = useMemo(() => {
        return props.models.map((model: StatModel, i: number) => (
            <Card model={model} key={i} width={width} />
        ));
    }, [props.models, width]);

    return (
        <div className="cards-list">
            <Suspense fallback={<Loading />}>{cards}</Suspense>
        </div>
    );
};

export default CardsList;
