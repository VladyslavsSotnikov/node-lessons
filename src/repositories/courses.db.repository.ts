import { CourseType, coursesCollection } from "../bd/bd";
import { CourseViewModel } from "../models/CourseViewModel";

export const getCourseViewModel = (course: CourseType): CourseViewModel => ({ id: course.id, title: course.title });

export const coursesRepository = {
  async getCourses(title?: string): Promise<CourseViewModel[]> {
    const filter: any = {};

    if (title) {
      filter.title = { $regex: title };
    }

    const courses = await coursesCollection.find(filter).toArray();

    return courses.map(getCourseViewModel);
  },
  async getCourseById(id: number): Promise<CourseViewModel | null> {
    const foundedCourse = await coursesCollection.findOne({ id });

    if (!foundedCourse) {
      return null;
    }

    return getCourseViewModel(foundedCourse);
  },
  async createCourse(newCourse: CourseType): Promise<CourseViewModel> {
    await coursesCollection.insertOne(newCourse);

    return getCourseViewModel(newCourse);
  },
  async updateCourse(id: number, title: string): Promise<boolean> {
    const course = await coursesCollection.updateOne({ id }, { $set: { title } });

    return course.matchedCount === 1;
  },
  async deleteCourse(id: number): Promise<boolean> {
    const course = await coursesCollection.deleteOne({ id });

    return course.deletedCount === 1;
  },
};
