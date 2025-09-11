import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import path from "path";
import swaggerUI from "swagger-ui-express";
import { testWorkers } from "./controllers/UserController";
import { swaggerSpec, swaggerUiOptions } from "./docs/swagger";
import { errorHandler, notFound } from "./middlewares/common/handleErrors";
import { emailQueue } from "./queues/emailQueue";
import { reportQueue } from "./queues/reportQueue";
import routes from "./routes";

const app = express();

// Configure the app to parse JSON with a 10mb limit
app.use(express.json({ limit: "10mb" }));

// Configure the app to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

/**
 * Register API Routes
 * @description Register all the API routes to the app
 **/
app.use("/", routes); // OR app.use(routes);
// Serve Swagger documentation
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUiOptions)
);
//JSON FORMAT.
app.use("/api-docs-json", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * End API Routes
 * */

/** TEST Routes */
app.use("/test-worker", testWorkers);
/**  End test rotues. */

/** --- BullMQ Dashboard Setup --- */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues"); // Change this path if you want to host in a sub path.
createBullBoard({
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(reportQueue)],
  serverAdapter,
  options: {
    uiConfig: {
      boardTitle: "Activity",
      boardLogo: {
        path: "/images/logo.jpg",
        width: "30px",
        height: 30,
      },
      miscLinks: [{ text: "Logout", url: "/logout" }],
      //   favIcon: {
      //     default: "static/images/logo.svg",
      //     alternative: "static/favicon-32x32.png",
      //   },
    },
  },
});
app.use("/admin/queues", serverAdapter.getRouter());
/** --- End BullMQ Dashboard Setup --- */

//Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
