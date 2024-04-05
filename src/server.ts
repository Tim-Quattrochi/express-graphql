import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";

dotenv.config();

const schema = buildSchema(`
type Query {
  hello: String
  index: String
}`);

const root = {
  index: () => {
    return "API endpoint.";
  },
  hello: () => {
    return "Hello world!";
  },
};

const app: Express = express();
const port = process.env.PORT || 3001;

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[server]: ${req.method} ${req.url}`);
  next();
});

app.all("/api", createHandler({ schema, rootValue: root }));

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  );
});
