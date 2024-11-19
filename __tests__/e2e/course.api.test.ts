import request from "supertest";
import { CourseViewModel } from "../../src/models/CourseViewModel";
import { HTTP_STATUS_CODES } from "../../src/utils";
import { app } from "../../src/app";

const getRequest = () => request(app);

describe("Course API", () => {
  beforeAll(async () => {
    await getRequest().delete("/__tests__/reset-db");
  });

  it("Should return 200 and empty array", async () => {
    await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK, []);
  });

  it("Should return 404 for not existing course", async () => {
    await getRequest().get("/courses/1").expect(HTTP_STATUS_CODES.NOT_FOUND);
  });

  it(`Shouldn't return created course with invalid input data`, async () => {
    await getRequest()
      .post("/courses")
      .send({
        title: "",
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST);

    await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK, []);
  });

  let createdCourse: CourseViewModel;
  let createdSecondCourse: CourseViewModel;

  it("Should create course", async () => {
    const response = await getRequest()
      .post("/courses")
      .send({
        title: "Test course",
      })
      .expect(HTTP_STATUS_CODES.CREATED);

    console.log("createdCourse >>>>", response.body);
    createdCourse = response.body;

    expect(createdCourse).toEqual({
      id: expect.any(Number),
      title: "Test course",
    });

    const courses = await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK);

    expect(courses.body).toEqual([createdCourse]);
  });

  it("Should create one more course", async () => {
    const response = await getRequest()
      .post("/courses")
      .send({
        title: "Test course 2",
      })
      .expect(HTTP_STATUS_CODES.CREATED);

    createdSecondCourse = response.body;

    expect(createdSecondCourse).toEqual({
      id: expect.any(Number),
      title: "Test course 2",
    });

    const courses = await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK);

    expect(courses.body).toEqual([createdCourse, createdSecondCourse]);
  });

  it(`Shouldn't update course with invalid input data`, async () => {
    await getRequest()
      .put(`/courses/${createdCourse.id}`)
      .send({
        title: "",
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST);

    await getRequest().get(`/courses/${createdCourse.id}`).expect(HTTP_STATUS_CODES.OK, createdCourse);
  });

  it(`Shouldn't update course with not existing id`, async () => {
    await getRequest()
      .put(`/courses/-1`)
      .send({
        title: "Course with not existing id",
      })
      .expect(HTTP_STATUS_CODES.NOT_FOUND);
  });

  it("Should update course with correct data", async () => {
    const response = await getRequest()
      .put(`/courses/${createdCourse.id}`)
      .send({
        title: "Updated course 1",
      })
      .expect(HTTP_STATUS_CODES.OK);

    const updatedCourse = response.body;

    expect(updatedCourse).toEqual({
      id: createdCourse.id,
      title: "Updated course 1",
    });

    await getRequest().get(`/courses/${createdCourse.id}`).expect(HTTP_STATUS_CODES.OK, updatedCourse);
    await getRequest().get(`/courses/${createdSecondCourse.id}`).expect(HTTP_STATUS_CODES.OK, createdSecondCourse);
  });

  it("Should delete both course", async () => {
    await getRequest().delete(`/courses/${createdCourse.id}`).expect(HTTP_STATUS_CODES.NO_CONTENT);

    await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK, [createdSecondCourse]);
    await getRequest().get(`/courses/${createdCourse.id}`).expect(HTTP_STATUS_CODES.NOT_FOUND);

    await getRequest().delete(`/courses/${createdSecondCourse.id}`).expect(HTTP_STATUS_CODES.NO_CONTENT);
    await getRequest().get("/courses").expect(HTTP_STATUS_CODES.OK, []);
    await getRequest().get(`/courses/${createdSecondCourse.id}`).expect(HTTP_STATUS_CODES.NOT_FOUND);
  });
});
