import { CourseType, coursesCollection } from "../bd/bd";
import { CourseViewModel } from "../models/CourseViewModel";
import { coursesRepository } from "../repositories/courses.db.repository";

export const getCourseViewModel = (course: CourseType): CourseViewModel => ({ id: course.id, title: course.title });

export const coursesService = {
  async getCourses(title?: string): Promise<CourseViewModel[]> {
    return coursesRepository.getCourses(title);
  },
  async getCourseById(id: number): Promise<CourseViewModel | null> {
    return coursesRepository.getCourseById(id);
  },
  async createCourse(title: string): Promise<CourseViewModel> {
    const newCourse: CourseType = { id: +new Date(), title: title, studentsCount: 0 };

    return coursesRepository.createCourse(newCourse);
  },
  async updateCourse(id: number, title: string): Promise<boolean> {
    return coursesRepository.updateCourse(id, title);
  },
  async deleteCourse(id: number): Promise<boolean> {
    return coursesRepository.deleteCourse(id);
  },
};
