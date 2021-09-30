import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";
import ReactDOM from "react-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import App from "./App";

const theme = createTheme({
	palette: {
		mode: "dark"
	}
});

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>,
	document.querySelector("#app")
);
