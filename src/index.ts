import { app } from "./app";
import { runDB } from "./bd/bd";

const port = 3003;

const start = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port:: ${port}`);
  });
};

start();
