import express, { Response } from "express";
import { body } from "express-validator";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../types";
import { CreateCourseModel } from "../models/CreateCourseModel";
import { UpdateCourseModel } from "../models/UpdateCourseModel";
import { QueryCoursesModel } from "../models/QueryCoursesModel";
import { URIParamsCoursIdModel } from "../models/URIParamsCoursIdMode";
import { CourseViewModel } from "../models/CourseViewModel";
import { HTTP_STATUS_CODES } from "../utils";
import { coursesService } from "../domain/courses.service";
import { inputValidationMiddleware } from "../middlewares/input.middleware";

const titleValidator = body("title").isLength({ min: 3, max: 30 }).withMessage("Title is required");

export const getCoursesRouter = () => {
  const router = express.Router();

  router.get("/", async (req: RequestWithQuery<QueryCoursesModel>, res: Response<CourseViewModel[]>) => {
    const courses = await coursesService.getCourses(req.query.title);

    res.status(HTTP_STATUS_CODES.OK).json(courses);
  });

  router.get("/:id", async (req: RequestWithParams<URIParamsCoursIdModel>, res: Response<CourseViewModel | { message: string }>) => {
    const course = await coursesService.getCourseById(+req.params.id);

    if (!course) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Course not found" });
    }

    res.status(HTTP_STATUS_CODES.OK).json(course);
  });

  router.post(
    "/",
    [titleValidator, inputValidationMiddleware],
    async (
      req: RequestWithBody<CreateCourseModel>,
      res: Response<CourseViewModel | { message: string } | { errors: { msg: string }[] }>
    ) => {
      const course = await coursesService.createCourse(req.body.title);

      res.status(HTTP_STATUS_CODES.CREATED).json(course);
    }
  );

  router.put(
    "/:id",
    [titleValidator, inputValidationMiddleware],
    async (req: RequestWithParamsAndBody<{ id: string }, UpdateCourseModel>, res: Response<CourseViewModel | { message: string }>) => {
      const isCourseUpdated = await coursesService.updateCourse(Number(req.params.id), req.body.title);

      if (isCourseUpdated) {
        const course = await coursesService.getCourseById(Number(req.params.id));

        if (course) {
          res.status(HTTP_STATUS_CODES.OK).json(course);

          return;
        }

        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Course not found" });

        return;
      }

      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Course not found" });
    }
  );

  router.delete("/:id", async (req: RequestWithParams<URIParamsCoursIdModel>, res: Response<{ message: string }>) => {
    const isCourseDeleted = await coursesService.deleteCourse(Number(req.params.id));

    if (!isCourseDeleted) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ message: "Course not found" });

      return;
    }

    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
  });

  return router;
};
