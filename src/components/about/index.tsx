import { h } from "preact";
import { useContext } from "preact/hooks";
import { LocalizationContext } from "src/context/localization";

const About = () => {
    const localization = useContext(LocalizationContext).localization;

    return (
        <div class="w-full h-screen flex justify-center items-center">
            <p>{localization.madeFor} ChemoView™</p>
        </div>
    );
};

export default About;
