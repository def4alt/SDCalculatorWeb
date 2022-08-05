import { h } from "preact";
import { useContext } from "preact/hooks";
import { LocalizationContext } from "src/context/localization";
import "./style.scss";

const About: React.FC = (_) => {
    const localization = useContext(LocalizationContext).localization;

    return (
        <div className="about">
            <p>{localization.madeFor} ChemoView™</p>
        </div>
    );
};

export default About;
