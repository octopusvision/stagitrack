import { 
  User, InsertUser, 
  Filiere, InsertFiliere, 
  Class, InsertClass, 
  Student, InsertStudent, 
  Service, InsertService, 
  PeriodeDeStage, InsertPeriodeDeStage, 
  Internship, InsertInternship, 
  Attendance, InsertAttendance, 
  InternshipAttendance, InsertInternshipAttendance,
  Teacher, InsertTeacher,
  Subject, InsertSubject,
  Room, InsertRoom,
  Timetable, InsertTimetable
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Filiere management
  getFilieres(): Promise<Filiere[]>;
  getFiliere(id: number): Promise<Filiere | undefined>;
  createFiliere(filiere: InsertFiliere): Promise<Filiere>;
  updateFiliere(id: number, filiere: Partial<InsertFiliere>): Promise<Filiere | undefined>;
  deleteFiliere(id: number): Promise<boolean>;
  
  // Class management
  getClasses(): Promise<Class[]>;
  getClassesByFiliere(filiereId: number): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: number): Promise<boolean>;
  
  // Student management
  getStudents(): Promise<Student[]>;
  getStudentsByClass(classId: number): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Service (Internship location) management
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Internship period management
  getPeriodeDeStages(): Promise<PeriodeDeStage[]>;
  getPeriodeDeStage(id: number): Promise<PeriodeDeStage | undefined>;
  createPeriodeDeStage(periode: InsertPeriodeDeStage): Promise<PeriodeDeStage>;
  updatePeriodeDeStage(id: number, periode: Partial<InsertPeriodeDeStage>): Promise<PeriodeDeStage | undefined>;
  deletePeriodeDeStage(id: number): Promise<boolean>;
  
  // Internship management
  getInternships(): Promise<Internship[]>;
  getInternshipsByStudent(studentId: number): Promise<Internship[]>;
  getInternshipsByService(serviceId: number): Promise<Internship[]>;
  getInternshipsByPeriod(periodeId: number): Promise<Internship[]>;
  getInternship(id: number): Promise<Internship | undefined>;
  createInternship(internship: InsertInternship): Promise<Internship>;
  updateInternship(id: number, internship: Partial<InsertInternship>): Promise<Internship | undefined>;
  deleteInternship(id: number): Promise<boolean>;
  
  // Attendance management
  getAttendances(): Promise<Attendance[]>;
  getAttendancesByStudent(studentId: number): Promise<Attendance[]>;
  getAttendancesByDate(date: Date): Promise<Attendance[]>;
  getAttendance(id: number): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: number): Promise<boolean>;
  
  // Internship attendance management
  getInternshipAttendances(): Promise<InternshipAttendance[]>;
  getInternshipAttendancesByInternship(internshipId: number): Promise<InternshipAttendance[]>;
  getInternshipAttendancesByStudent(studentId: number): Promise<InternshipAttendance[]>;
  getInternshipAttendancesByDate(date: Date): Promise<InternshipAttendance[]>;
  getInternshipAttendance(id: number): Promise<InternshipAttendance | undefined>;
  createInternshipAttendance(attendance: InsertInternshipAttendance): Promise<InternshipAttendance>;
  updateInternshipAttendance(id: number, attendance: Partial<InsertInternshipAttendance>): Promise<InternshipAttendance | undefined>;
  deleteInternshipAttendance(id: number): Promise<boolean>;
  
  // Teacher management
  getTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: number): Promise<boolean>;
  
  // Subject management
  getSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subject: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;
  
  // Room management
  getRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: number): Promise<boolean>;
  
  // Timetable management
  getTimetables(): Promise<Timetable[]>;
  getTimetablesByClass(classId: number): Promise<Timetable[]>;
  getTimetablesByTeacher(teacherId: number): Promise<Timetable[]>;
  getTimetablesByDay(dayOfWeek: number): Promise<Timetable[]>;
  getTimetable(id: number): Promise<Timetable | undefined>;
  createTimetable(timetable: InsertTimetable): Promise<Timetable>;
  updateTimetable(id: number, timetable: Partial<InsertTimetable>): Promise<Timetable | undefined>;
  deleteTimetable(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private filieres: Map<number, Filiere>;
  private classes: Map<number, Class>;
  private students: Map<number, Student>;
  private services: Map<number, Service>;
  private periodeDeStages: Map<number, PeriodeDeStage>;
  private internships: Map<number, Internship>;
  private attendances: Map<number, Attendance>;
  private internshipAttendances: Map<number, InternshipAttendance>;
  private teachers: Map<number, Teacher>;
  private subjects: Map<number, Subject>;
  private rooms: Map<number, Room>;
  private timetables: Map<number, Timetable>;
  
  private userIdCounter: number;
  private filiereIdCounter: number;
  private classIdCounter: number;
  private studentIdCounter: number;
  private serviceIdCounter: number;
  private periodeDeStageIdCounter: number;
  private internshipIdCounter: number;
  private attendanceIdCounter: number;
  private internshipAttendanceIdCounter: number;
  private teacherIdCounter: number;
  private subjectIdCounter: number;
  private roomIdCounter: number;
  private timetableIdCounter: number;
  
  public sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.filieres = new Map();
    this.classes = new Map();
    this.students = new Map();
    this.services = new Map();
    this.periodeDeStages = new Map();
    this.internships = new Map();
    this.attendances = new Map();
    this.internshipAttendances = new Map();
    this.teachers = new Map();
    this.subjects = new Map();
    this.rooms = new Map();
    this.timetables = new Map();
    
    this.userIdCounter = 1;
    this.filiereIdCounter = 1;
    this.classIdCounter = 1;
    this.studentIdCounter = 1;
    this.serviceIdCounter = 1;
    this.periodeDeStageIdCounter = 1;
    this.internshipIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.internshipAttendanceIdCounter = 1;
    this.teacherIdCounter = 1;
    this.subjectIdCounter = 1;
    this.roomIdCounter = 1;
    this.timetableIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$HS/lMJRpjDLpTiJDmHzqIuKRyXAYO2fS4MWj7t8LR/c8wKgXQo7YG", // "password"
      role: "admin",
      fullName: "Admin User",
      email: "admin@school.com"
    });
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Add some initial data for demonstration purposes
    const ipFiliere = this.createFiliere({
      name: "Infirmier Polyvalent",
      abbreviation: "IP",
      numYears: 3
    });
    
    const sfFiliere = this.createFiliere({
      name: "Sage Femme",
      abbreviation: "SF",
      numYears: 3
    });
    
    const ip1Class = this.createClass({
      filiereId: ipFiliere.id,
      name: "Infirmier Polyvalent 1ère Année",
      abbreviation: "IP1"
    });
    
    const ip2Class = this.createClass({
      filiereId: ipFiliere.id,
      name: "Infirmier Polyvalent 2ème Année",
      abbreviation: "IP2"
    });
    
    const ip3Class = this.createClass({
      filiereId: ipFiliere.id,
      name: "Infirmier Polyvalent 3ème Année",
      abbreviation: "IP3"
    });
    
    const sf1Class = this.createClass({
      filiereId: sfFiliere.id,
      name: "Sage Femme 1ère Année",
      abbreviation: "SF1"
    });
    
    // Add some services (internship locations)
    const chpEdderak = this.createService({
      name: "CHP EDDERAK",
      location: "Oujda"
    });
    
    const cliniqueMoulouya = this.createService({
      name: "Clinique MOULOUYA",
      location: "Nador"
    });
    
    const hopitalRegional = this.createService({
      name: "Hôpital Régional",
      location: "Berkane"
    });
    
    // Add internship periods
    const periodOne = this.createPeriodeDeStage({
      name: "Period 1",
      startDate: new Date("2023-01-10"),
      endDate: new Date("2023-02-10")
    });
    
    const periodTwo = this.createPeriodeDeStage({
      name: "Period 2",
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-04-01")
    });
    
    // Add some rooms
    this.createRoom({ name: "Room 201" });
    this.createRoom({ name: "Room 105" });
    this.createRoom({ name: "Room 305" });
    
    // Add some subjects
    this.createSubject({ name: "Anatomy" });
    this.createSubject({ name: "Pharmacology" });
    this.createSubject({ name: "Critical Care" });
  }
  
  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Filiere management
  async getFilieres(): Promise<Filiere[]> {
    return Array.from(this.filieres.values());
  }
  
  async getFiliere(id: number): Promise<Filiere | undefined> {
    return this.filieres.get(id);
  }
  
  async createFiliere(filiere: InsertFiliere): Promise<Filiere> {
    const id = this.filiereIdCounter++;
    const newFiliere: Filiere = { ...filiere, id };
    this.filieres.set(id, newFiliere);
    return newFiliere;
  }
  
  async updateFiliere(id: number, filiere: Partial<InsertFiliere>): Promise<Filiere | undefined> {
    const existing = this.filieres.get(id);
    if (!existing) return undefined;
    
    const updated: Filiere = { ...existing, ...filiere };
    this.filieres.set(id, updated);
    return updated;
  }
  
  async deleteFiliere(id: number): Promise<boolean> {
    return this.filieres.delete(id);
  }
  
  // Class management
  async getClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }
  
  async getClassesByFiliere(filiereId: number): Promise<Class[]> {
    return Array.from(this.classes.values()).filter(
      (classItem) => classItem.filiereId === filiereId
    );
  }
  
  async getClass(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }
  
  async createClass(classData: InsertClass): Promise<Class> {
    const id = this.classIdCounter++;
    const newClass: Class = { ...classData, id };
    this.classes.set(id, newClass);
    return newClass;
  }
  
  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const existing = this.classes.get(id);
    if (!existing) return undefined;
    
    const updated: Class = { ...existing, ...classData };
    this.classes.set(id, updated);
    return updated;
  }
  
  async deleteClass(id: number): Promise<boolean> {
    return this.classes.delete(id);
  }
  
  // Student management
  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }
  
  async getStudentsByClass(classId: number): Promise<Student[]> {
    return Array.from(this.students.values()).filter(
      (student) => student.classId === classId
    );
  }
  
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }
  
  async createStudent(student: InsertStudent): Promise<Student> {
    const id = this.studentIdCounter++;
    const newStudent: Student = { ...student, id };
    this.students.set(id, newStudent);
    return newStudent;
  }
  
  async updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined> {
    const existing = this.students.get(id);
    if (!existing) return undefined;
    
    const updated: Student = { ...existing, ...student };
    this.students.set(id, updated);
    return updated;
  }
  
  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }
  
  // Service (Internship location) management
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    
    const updated: Service = { ...existing, ...service };
    this.services.set(id, updated);
    return updated;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Internship period management
  async getPeriodeDeStages(): Promise<PeriodeDeStage[]> {
    return Array.from(this.periodeDeStages.values());
  }
  
  async getPeriodeDeStage(id: number): Promise<PeriodeDeStage | undefined> {
    return this.periodeDeStages.get(id);
  }
  
  async createPeriodeDeStage(periode: InsertPeriodeDeStage): Promise<PeriodeDeStage> {
    const id = this.periodeDeStageIdCounter++;
    const newPeriode: PeriodeDeStage = { ...periode, id };
    this.periodeDeStages.set(id, newPeriode);
    return newPeriode;
  }
  
  async updatePeriodeDeStage(id: number, periode: Partial<InsertPeriodeDeStage>): Promise<PeriodeDeStage | undefined> {
    const existing = this.periodeDeStages.get(id);
    if (!existing) return undefined;
    
    const updated: PeriodeDeStage = { ...existing, ...periode };
    this.periodeDeStages.set(id, updated);
    return updated;
  }
  
  async deletePeriodeDeStage(id: number): Promise<boolean> {
    return this.periodeDeStages.delete(id);
  }
  
  // Internship management
  async getInternships(): Promise<Internship[]> {
    return Array.from(this.internships.values());
  }
  
  async getInternshipsByStudent(studentId: number): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(
      (internship) => internship.studentId === studentId
    );
  }
  
  async getInternshipsByService(serviceId: number): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(
      (internship) => internship.serviceId === serviceId
    );
  }
  
  async getInternshipsByPeriod(periodeId: number): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(
      (internship) => internship.periodeDeStageId === periodeId
    );
  }
  
  async getInternship(id: number): Promise<Internship | undefined> {
    return this.internships.get(id);
  }
  
  async createInternship(internship: InsertInternship): Promise<Internship> {
    const id = this.internshipIdCounter++;
    const newInternship: Internship = { ...internship, id };
    this.internships.set(id, newInternship);
    return newInternship;
  }
  
  async updateInternship(id: number, internship: Partial<InsertInternship>): Promise<Internship | undefined> {
    const existing = this.internships.get(id);
    if (!existing) return undefined;
    
    const updated: Internship = { ...existing, ...internship };
    this.internships.set(id, updated);
    return updated;
  }
  
  async deleteInternship(id: number): Promise<boolean> {
    return this.internships.delete(id);
  }
  
  // Attendance management
  async getAttendances(): Promise<Attendance[]> {
    return Array.from(this.attendances.values());
  }
  
  async getAttendancesByStudent(studentId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.studentId === studentId
    );
  }
  
  async getAttendancesByDate(date: Date): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.date.toDateString() === date.toDateString()
    );
  }
  
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendances.get(id);
  }
  
  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const newAttendance: Attendance = { ...attendance, id };
    this.attendances.set(id, newAttendance);
    return newAttendance;
  }
  
  async updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const existing = this.attendances.get(id);
    if (!existing) return undefined;
    
    const updated: Attendance = { ...existing, ...attendance };
    this.attendances.set(id, updated);
    return updated;
  }
  
  async deleteAttendance(id: number): Promise<boolean> {
    return this.attendances.delete(id);
  }
  
  // Internship attendance management
  async getInternshipAttendances(): Promise<InternshipAttendance[]> {
    return Array.from(this.internshipAttendances.values());
  }
  
  async getInternshipAttendancesByInternship(internshipId: number): Promise<InternshipAttendance[]> {
    return Array.from(this.internshipAttendances.values()).filter(
      (attendance) => attendance.internshipId === internshipId
    );
  }
  
  async getInternshipAttendancesByStudent(studentId: number): Promise<InternshipAttendance[]> {
    return Array.from(this.internshipAttendances.values()).filter(
      (attendance) => attendance.studentId === studentId
    );
  }
  
  async getInternshipAttendancesByDate(date: Date): Promise<InternshipAttendance[]> {
    return Array.from(this.internshipAttendances.values()).filter(
      (attendance) => attendance.date.toDateString() === date.toDateString()
    );
  }
  
  async getInternshipAttendance(id: number): Promise<InternshipAttendance | undefined> {
    return this.internshipAttendances.get(id);
  }
  
  async createInternshipAttendance(attendance: InsertInternshipAttendance): Promise<InternshipAttendance> {
    const id = this.internshipAttendanceIdCounter++;
    const newAttendance: InternshipAttendance = { ...attendance, id };
    this.internshipAttendances.set(id, newAttendance);
    return newAttendance;
  }
  
  async updateInternshipAttendance(id: number, attendance: Partial<InsertInternshipAttendance>): Promise<InternshipAttendance | undefined> {
    const existing = this.internshipAttendances.get(id);
    if (!existing) return undefined;
    
    const updated: InternshipAttendance = { ...existing, ...attendance };
    this.internshipAttendances.set(id, updated);
    return updated;
  }
  
  async deleteInternshipAttendance(id: number): Promise<boolean> {
    return this.internshipAttendances.delete(id);
  }
  
  // Teacher management
  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }
  
  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }
  
  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = this.teacherIdCounter++;
    const newTeacher: Teacher = { ...teacher, id };
    this.teachers.set(id, newTeacher);
    return newTeacher;
  }
  
  async updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const existing = this.teachers.get(id);
    if (!existing) return undefined;
    
    const updated: Teacher = { ...existing, ...teacher };
    this.teachers.set(id, updated);
    return updated;
  }
  
  async deleteTeacher(id: number): Promise<boolean> {
    return this.teachers.delete(id);
  }
  
  // Subject management
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }
  
  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = this.subjectIdCounter++;
    const newSubject: Subject = { ...subject, id };
    this.subjects.set(id, newSubject);
    return newSubject;
  }
  
  async updateSubject(id: number, subject: Partial<InsertSubject>): Promise<Subject | undefined> {
    const existing = this.subjects.get(id);
    if (!existing) return undefined;
    
    const updated: Subject = { ...existing, ...subject };
    this.subjects.set(id, updated);
    return updated;
  }
  
  async deleteSubject(id: number): Promise<boolean> {
    return this.subjects.delete(id);
  }
  
  // Room management
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }
  
  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }
  
  async createRoom(room: InsertRoom): Promise<Room> {
    const id = this.roomIdCounter++;
    const newRoom: Room = { ...room, id };
    this.rooms.set(id, newRoom);
    return newRoom;
  }
  
  async updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room | undefined> {
    const existing = this.rooms.get(id);
    if (!existing) return undefined;
    
    const updated: Room = { ...existing, ...room };
    this.rooms.set(id, updated);
    return updated;
  }
  
  async deleteRoom(id: number): Promise<boolean> {
    return this.rooms.delete(id);
  }
  
  // Timetable management
  async getTimetables(): Promise<Timetable[]> {
    return Array.from(this.timetables.values());
  }
  
  async getTimetablesByClass(classId: number): Promise<Timetable[]> {
    return Array.from(this.timetables.values()).filter(
      (timetable) => timetable.classId === classId
    );
  }
  
  async getTimetablesByTeacher(teacherId: number): Promise<Timetable[]> {
    return Array.from(this.timetables.values()).filter(
      (timetable) => timetable.teacherId === teacherId
    );
  }
  
  async getTimetablesByDay(dayOfWeek: number): Promise<Timetable[]> {
    return Array.from(this.timetables.values()).filter(
      (timetable) => timetable.dayOfWeek === dayOfWeek
    );
  }
  
  async getTimetable(id: number): Promise<Timetable | undefined> {
    return this.timetables.get(id);
  }
  
  async createTimetable(timetable: InsertTimetable): Promise<Timetable> {
    const id = this.timetableIdCounter++;
    const newTimetable: Timetable = { ...timetable, id };
    this.timetables.set(id, newTimetable);
    return newTimetable;
  }
  
  async updateTimetable(id: number, timetable: Partial<InsertTimetable>): Promise<Timetable | undefined> {
    const existing = this.timetables.get(id);
    if (!existing) return undefined;
    
    const updated: Timetable = { ...existing, ...timetable };
    this.timetables.set(id, updated);
    return updated;
  }
  
  async deleteTimetable(id: number): Promise<boolean> {
    return this.timetables.delete(id);
  }
}

export const storage = new MemStorage();
