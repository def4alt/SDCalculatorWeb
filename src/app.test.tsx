import React from "react";
import { render } from "@testing-library/react";
import App from "./app";

test("App Render", () => {
    const { getByText } = render(<App/>);
    const sdCalculatorText = getByText("SDCalculator");
    expect(sdCalculatorText).toBeInTheDocument();
})