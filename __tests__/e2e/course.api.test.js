"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const utils_1 = require("../../src/utils");
const app_1 = require("../../src/app");
const getRequest = () => (0, supertest_1.default)(app_1.app);
describe("Course API", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest().delete("/__tests__/reset-db");
    }));
    it("Should return 200 and empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK, []);
    }));
    it("Should return 404 for not existing course", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest().get("/courses/1").expect(utils_1.HTTP_STATUS_CODES.NOT_FOUND);
    }));
    it(`Shouldn't return created course with invalid input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .post("/courses")
            .send({
            title: "",
        })
            .expect(utils_1.HTTP_STATUS_CODES.BAD_REQUEST);
        yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK, []);
    }));
    let createdCourse;
    let createdSecondCourse;
    it("Should create course", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getRequest()
            .post("/courses")
            .send({
            title: "Test course",
        })
            .expect(utils_1.HTTP_STATUS_CODES.CREATED);
        console.log("createdCourse >>>>", response.body);
        createdCourse = response.body;
        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: "Test course",
        });
        const courses = yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK);
        expect(courses.body).toEqual([createdCourse]);
    }));
    it("Should create one more course", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getRequest()
            .post("/courses")
            .send({
            title: "Test course 2",
        })
            .expect(utils_1.HTTP_STATUS_CODES.CREATED);
        createdSecondCourse = response.body;
        expect(createdSecondCourse).toEqual({
            id: expect.any(Number),
            title: "Test course 2",
        });
        const courses = yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK);
        expect(courses.body).toEqual([createdCourse, createdSecondCourse]);
    }));
    it(`Shouldn't update course with invalid input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .put(`/courses/${createdCourse.id}`)
            .send({
            title: "",
        })
            .expect(utils_1.HTTP_STATUS_CODES.BAD_REQUEST);
        yield getRequest().get(`/courses/${createdCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.OK, createdCourse);
    }));
    it(`Shouldn't update course with not existing id`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest()
            .put(`/courses/-1`)
            .send({
            title: "Course with not existing id",
        })
            .expect(utils_1.HTTP_STATUS_CODES.NOT_FOUND);
    }));
    it("Should update course with correct data", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield getRequest()
            .put(`/courses/${createdCourse.id}`)
            .send({
            title: "Updated course 1",
        })
            .expect(utils_1.HTTP_STATUS_CODES.OK);
        const updatedCourse = response.body;
        expect(updatedCourse).toEqual({
            id: createdCourse.id,
            title: "Updated course 1",
        });
        yield getRequest().get(`/courses/${createdCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.OK, updatedCourse);
        yield getRequest().get(`/courses/${createdSecondCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.OK, createdSecondCourse);
    }));
    it("Should delete both course", () => __awaiter(void 0, void 0, void 0, function* () {
        yield getRequest().delete(`/courses/${createdCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.NO_CONTENT);
        yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK, [createdSecondCourse]);
        yield getRequest().get(`/courses/${createdCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.NOT_FOUND);
        yield getRequest().delete(`/courses/${createdSecondCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.NO_CONTENT);
        yield getRequest().get("/courses").expect(utils_1.HTTP_STATUS_CODES.OK, []);
        yield getRequest().get(`/courses/${createdSecondCourse.id}`).expect(utils_1.HTTP_STATUS_CODES.NOT_FOUND);
    }));
});
