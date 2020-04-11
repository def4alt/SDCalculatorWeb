import React, { Suspense, useState, useEffect } from "react";
import { StatModel } from "../../types";
import Loading from "../loading";

import "../../styles/cards-list/cards-list.scss";

const Card = React.lazy(() => import("../card"));

interface CardsListProps {
    models: StatModel[];
}

const CardsList: React.FunctionComponent<CardsListProps> = (props) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    });

    const resizeHandler = () => {
        const innerWidth = window.innerWidth;
        setWidth(
            250 + 100 * props.models[0].Average.length > innerWidth - 50 &&
                innerWidth !== 0
                ? innerWidth - 80
                : 250 + 100 * props.models[0].Average.length
        );
    };

    return (
        <div className="cards-list">
            <Suspense fallback={<Loading />}>
                {props.models.map((model: StatModel, i: number) => (
                    <Card model={model} key={i} width={width} />
                ))}
            </Suspense>
        </div>
    );
};

export default CardsList;
