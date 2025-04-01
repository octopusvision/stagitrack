import { pgTable, text, serial, integer, boolean, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'teacher', 'student']);
export const studentStatusEnum = pgEnum('student_status', ['Actif', 'Suspendu', 'Diplômé', 'Exclu']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['Present', 'Absent', 'Late']);
export const internshipValidationStatusEnum = pgEnum('internship_validation_status', ['Pending', 'Validated', 'Rejected']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('admin'),
  fullName: text("full_name").notNull(),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
  email: true,
});

// Filieres table
export const filieres = pgTable("filieres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
  numYears: integer("num_years").notNull(),
});

export const insertFiliereSchema = createInsertSchema(filieres).pick({
  name: true,
  abbreviation: true,
  numYears: true,
});

// Classes table
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  filiereId: integer("filiere_id").notNull().references(() => filieres.id),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
});

export const insertClassSchema = createInsertSchema(classes).pick({
  filiereId: true,
  name: true,
  abbreviation: true,
});

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  idCardNumber: text("id_card_number").unique(),
  phone: text("phone"),
  address: text("address"),
  email: text("email").unique(),
  filiereId: integer("filiere_id").references(() => filieres.id),
  classId: integer("class_id").references(() => classes.id),
  status: studentStatusEnum("status").default('Actif'),
  documents: text("documents"),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  fullName: true,
  idCardNumber: true,
  phone: true,
  address: true,
  email: true,
  filiereId: true,
  classId: true,
  status: true,
  documents: true,
});

// Services (Internship locations) table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  location: true,
});

// Internship periods table
export const periodeDeSatges = pgTable("periode_de_stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
});

export const insertPeriodeDeStageSchema = createInsertSchema(periodeDeSatges).pick({
  name: true,
  startDate: true,
  endDate: true,
});

// Internships table
export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  periodeDeStageId: integer("periode_de_stage_id").notNull().references(() => periodeDeSatges.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  validationStatus: internshipValidationStatusEnum("validation_status").default('Pending'),
});

export const insertInternshipSchema = createInsertSchema(internships).pick({
  studentId: true,
  serviceId: true,
  periodeDeStageId: true,
  startDate: true,
  endDate: true,
  validationStatus: true,
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").default('Absent'),
  remarks: text("remarks"),
});

export const insertAttendanceSchema = createInsertSchema(attendance).pick({
  studentId: true,
  date: true,
  status: true,
  remarks: true,
});

// Internship attendance table
export const internshipAttendance = pgTable("internship_attendance", {
  id: serial("id").primaryKey(),
  internshipId: integer("internship_id").notNull().references(() => internships.id),
  studentId: integer("student_id").notNull().references(() => students.id),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").default('Absent'),
  remarks: text("remarks"),
});

export const insertInternshipAttendanceSchema = createInsertSchema(internshipAttendance).pick({
  internshipId: true,
  studentId: true,
  date: true,
  status: true,
  remarks: true,
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  subject: text("subject"),
});

export const insertTeacherSchema = createInsertSchema(teachers).pick({
  userId: true,
  fullName: true,
  subject: true,
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
});

// Rooms table
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertRoomSchema = createInsertSchema(rooms).pick({
  name: true,
});

// Timetable table
export const timetables = pgTable("timetables", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull().references(() => classes.id),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  teacherId: integer("teacher_id").notNull().references(() => teachers.id),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const insertTimetableSchema = createInsertSchema(timetables).pick({
  classId: true,
  subjectId: true,
  teacherId: true,
  roomId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Filiere = typeof filieres.$inferSelect;
export type InsertFiliere = z.infer<typeof insertFiliereSchema>;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type PeriodeDeStage = typeof periodeDeSatges.$inferSelect;
export type InsertPeriodeDeStage = z.infer<typeof insertPeriodeDeStageSchema>;

export type Internship = typeof internships.$inferSelect;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type InternshipAttendance = typeof internshipAttendance.$inferSelect;
export type InsertInternshipAttendance = z.infer<typeof insertInternshipAttendanceSchema>;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Timetable = typeof timetables.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
