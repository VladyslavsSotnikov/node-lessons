import { CourseType, db } from "../bd/bd";
import { CourseViewModel } from "../models/CourseViewModel";

export const getCourseViewModel = (course: CourseType): CourseViewModel => ({ id: course.id, title: course.title });

export const coursesRepository = {
  async getCourses(title?: string): Promise<CourseViewModel[]> {
    if (title) {
      const foundedCourses = db.courses.filter((course) => course.title.includes(title));

      return foundedCourses.map((course) => getCourseViewModel(course));
    }

    return db.courses.map((course) => getCourseViewModel(course));
  },
  async getCourseById(id: number): Promise<CourseViewModel | null> {
    const foundedCourse = db.courses.find((course) => course.id === id);

    if (!foundedCourse) {
      return null;
    }

    return getCourseViewModel(foundedCourse);
  },
  async createCourse(title: string): Promise<CourseViewModel> {
    const newCourse: CourseType = { id: +new Date(), title: title, studentsCount: 0 };

    db.courses.push(newCourse);

    return getCourseViewModel(newCourse);
  },
  async updateCourse(id: number, title: string): Promise<boolean> {
    const course = db.courses.find((course) => course.id === id);

    if (course) {
      course.title = title;

      return true;
    }

    return false;
  },
  async deleteCourse(id: number): Promise<boolean> {
    const courseCountBefore = db.courses.length;
    db.courses = db.courses.filter((course) => course.id !== id);
    const courseCountAfter = db.courses.length;

    if (courseCountBefore !== courseCountAfter) {
      return true;
    }

    return false;
  },
};
