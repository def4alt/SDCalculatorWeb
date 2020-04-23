import React, { Suspense, useEffect, useMemo, useState } from "react";
import { StatModel } from "../../types";
import Loading from "../loading";

import "../../styles/cards-list/cards-list.scss";

const Card = React.lazy(() => import("../card"));

interface CardsListProps {
    models: StatModel[];
}

const CardsList: React.FC<CardsListProps> = (props) => {
    const [width, setWidth] = useState<number>(0);

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
            <Card model={model} key={i} width={width}/>
        ));
    }, [props.models, width]);

    return (
        <div className="cards-list">
            <Suspense fallback={<Loading/>}>{cards}</Suspense>
        </div>
    );
};

export default CardsList;
