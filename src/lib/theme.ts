import { createTheme } from "@material-ui/core/styles";
import { blue, orange } from "@material-ui/core/colors";

export default createTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: orange[500] },
  },
});
