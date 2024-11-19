import express from "express";
import { DBType } from "../bd/bd";
import { HTTP_STATUS_CODES } from "../utils";

export const getTestsRouter = (db: DBType) => {
  const router = express.Router();

  router.delete("/reset-db", (req, res) => {
    db.courses = [];

    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
  });

  return router;
};
