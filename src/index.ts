import app from "./app";
import { APP_CONFIG } from "./config/appConfig";
const port = APP_CONFIG.port;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Server available at ${APP_CONFIG.appUrl}`);
});
