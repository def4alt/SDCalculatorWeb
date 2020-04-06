import React, { Suspense } from "react";
import { StatModel } from "../../types";
import Loading from "../loading";

import "../../styles/cards-list/cards-list.scss";

const Card = React.lazy(() => import("../card"));

interface CardsListProps {
    models: StatModel[];
}

interface CardsListState {
    innerWidth: number;
}

class CardsList extends React.Component<CardsListProps, CardsListState> {
    constructor(props: CardsListProps) {
        super(props);

        this.state = {
            innerWidth: 0,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateWindowDimensions);
        this.updateWindowDimensions();
    }

    updateWindowDimensions() {
        this.setState({ innerWidth: window.innerWidth });
    }

    render() {
        const { innerWidth } = this.state;
        const models = this.props.models;
        const width =
            250 + 100 * this.props.models[0].Average.length > innerWidth - 50 &&
            innerWidth !== 0
                ? innerWidth - 80
                : 250 + 100 * this.props.models[0].Average.length;

        return (
            <div className="cards-list">
                <Suspense fallback={<Loading />}>
                    {models.map((model: StatModel, i: number) => (
                        <Card model={model} key={i} width={width} />
                    ))}
                </Suspense>
            </div>
        );
    }
}

export default CardsList;
