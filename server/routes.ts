import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertFiliereSchema, 
  insertClassSchema, 
  insertStudentSchema, 
  insertServiceSchema, 
  insertPeriodeDeStageSchema, 
  insertInternshipSchema, 
  insertAttendanceSchema, 
  insertInternshipAttendanceSchema,
  insertSubjectSchema,
  insertRoomSchema,
  insertTimetableSchema,
  insertTeacherSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { ensureAuthenticated, ensureAdmin, ensureTeacher } = setupAuth(app);

  // Error handling middleware for Zod validation errors
  const validateRequest = (schema: any) => {
    return (req: any, res: any, next: any) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          next(error);
        }
      }
    };
  };

  // Filiere routes
  app.get("/api/filieres", ensureAuthenticated, async (req, res) => {
    try {
      const filieres = await storage.getFilieres();
      res.json(filieres);
    } catch (error) {
      res.status(500).json({ message: "Failed to get filieres" });
    }
  });

  app.get("/api/filieres/:id", ensureAuthenticated, async (req, res) => {
    try {
      const filiere = await storage.getFiliere(Number(req.params.id));
      if (!filiere) {
        return res.status(404).json({ message: "Filiere not found" });
      }
      res.json(filiere);
    } catch (error) {
      res.status(500).json({ message: "Failed to get filiere" });
    }
  });

  app.post("/api/filieres", ensureAdmin, validateRequest(insertFiliereSchema), async (req, res) => {
    try {
      const filiere = await storage.createFiliere(req.body);
      res.status(201).json(filiere);
    } catch (error) {
      res.status(500).json({ message: "Failed to create filiere" });
    }
  });

  app.put("/api/filieres/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedFiliere = await storage.updateFiliere(Number(req.params.id), req.body);
      if (!updatedFiliere) {
        return res.status(404).json({ message: "Filiere not found" });
      }
      res.json(updatedFiliere);
    } catch (error) {
      res.status(500).json({ message: "Failed to update filiere" });
    }
  });

  app.delete("/api/filieres/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteFiliere(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Filiere not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete filiere" });
    }
  });

  // Class routes
  app.get("/api/classes", ensureAuthenticated, async (req, res) => {
    try {
      const filiereId = req.query.filiereId ? Number(req.query.filiereId) : undefined;
      const classes = filiereId 
        ? await storage.getClassesByFiliere(filiereId)
        : await storage.getClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get classes" });
    }
  });

  app.get("/api/classes/:id", ensureAuthenticated, async (req, res) => {
    try {
      const classObj = await storage.getClass(Number(req.params.id));
      if (!classObj) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(classObj);
    } catch (error) {
      res.status(500).json({ message: "Failed to get class" });
    }
  });

  app.post("/api/classes", ensureAdmin, validateRequest(insertClassSchema), async (req, res) => {
    try {
      const classObj = await storage.createClass(req.body);
      res.status(201).json(classObj);
    } catch (error) {
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.put("/api/classes/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedClass = await storage.updateClass(Number(req.params.id), req.body);
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(updatedClass);
    } catch (error) {
      res.status(500).json({ message: "Failed to update class" });
    }
  });

  app.delete("/api/classes/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteClass(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete class" });
    }
  });

  // Student routes
  app.get("/api/students", ensureAuthenticated, async (req, res) => {
    try {
      const classId = req.query.classId ? Number(req.query.classId) : undefined;
      const students = classId 
        ? await storage.getStudentsByClass(classId)
        : await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to get students" });
    }
  });

  app.get("/api/students/:id", ensureAuthenticated, async (req, res) => {
    try {
      const student = await storage.getStudent(Number(req.params.id));
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to get student" });
    }
  });

  app.post("/api/students", ensureAdmin, validateRequest(insertStudentSchema), async (req, res) => {
    try {
      const student = await storage.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  app.put("/api/students/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedStudent = await storage.updateStudent(Number(req.params.id), req.body);
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteStudent(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // Service (Internship location) routes
  app.get("/api/services", ensureAuthenticated, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  app.get("/api/services/:id", ensureAuthenticated, async (req, res) => {
    try {
      const service = await storage.getService(Number(req.params.id));
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to get service" });
    }
  });

  app.post("/api/services", ensureAdmin, validateRequest(insertServiceSchema), async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  app.put("/api/services/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedService = await storage.updateService(Number(req.params.id), req.body);
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ message: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteService(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  // Periode de Stage routes
  app.get("/api/periode-de-stages", ensureAuthenticated, async (req, res) => {
    try {
      const periodeDeStages = await storage.getPeriodeDeStages();
      res.json(periodeDeStages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get periode de stages" });
    }
  });

  app.get("/api/periode-de-stages/:id", ensureAuthenticated, async (req, res) => {
    try {
      const periodeDeStage = await storage.getPeriodeDeStage(Number(req.params.id));
      if (!periodeDeStage) {
        return res.status(404).json({ message: "Periode de Stage not found" });
      }
      res.json(periodeDeStage);
    } catch (error) {
      res.status(500).json({ message: "Failed to get periode de stage" });
    }
  });

  app.post("/api/periode-de-stages", ensureAdmin, validateRequest(insertPeriodeDeStageSchema), async (req, res) => {
    try {
      const periodeDeStage = await storage.createPeriodeDeStage(req.body);
      res.status(201).json(periodeDeStage);
    } catch (error) {
      res.status(500).json({ message: "Failed to create periode de stage" });
    }
  });

  app.put("/api/periode-de-stages/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedPeriodeDeStage = await storage.updatePeriodeDeStage(Number(req.params.id), req.body);
      if (!updatedPeriodeDeStage) {
        return res.status(404).json({ message: "Periode de Stage not found" });
      }
      res.json(updatedPeriodeDeStage);
    } catch (error) {
      res.status(500).json({ message: "Failed to update periode de stage" });
    }
  });

  app.delete("/api/periode-de-stages/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deletePeriodeDeStage(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Periode de Stage not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete periode de stage" });
    }
  });

  // Internship routes
  app.get("/api/internships", ensureAuthenticated, async (req, res) => {
    try {
      const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
      const serviceId = req.query.serviceId ? Number(req.query.serviceId) : undefined;
      const periodeId = req.query.periodeId ? Number(req.query.periodeId) : undefined;
      
      let internships;
      if (studentId) {
        internships = await storage.getInternshipsByStudent(studentId);
      } else if (serviceId) {
        internships = await storage.getInternshipsByService(serviceId);
      } else if (periodeId) {
        internships = await storage.getInternshipsByPeriod(periodeId);
      } else {
        internships = await storage.getInternships();
      }
      
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Failed to get internships" });
    }
  });

  app.get("/api/internships/:id", ensureAuthenticated, async (req, res) => {
    try {
      const internship = await storage.getInternship(Number(req.params.id));
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      res.status(500).json({ message: "Failed to get internship" });
    }
  });

  app.post("/api/internships", ensureTeacher, validateRequest(insertInternshipSchema), async (req, res) => {
    try {
      const internship = await storage.createInternship(req.body);
      res.status(201).json(internship);
    } catch (error) {
      res.status(500).json({ message: "Failed to create internship" });
    }
  });

  app.put("/api/internships/:id", ensureTeacher, async (req, res) => {
    try {
      const updatedInternship = await storage.updateInternship(Number(req.params.id), req.body);
      if (!updatedInternship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(updatedInternship);
    } catch (error) {
      res.status(500).json({ message: "Failed to update internship" });
    }
  });

  app.delete("/api/internships/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteInternship(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete internship" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", ensureAuthenticated, async (req, res) => {
    try {
      const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      let attendances;
      if (studentId) {
        attendances = await storage.getAttendancesByStudent(studentId);
      } else if (date) {
        attendances = await storage.getAttendancesByDate(date);
      } else {
        attendances = await storage.getAttendances();
      }
      
      res.json(attendances);
    } catch (error) {
      res.status(500).json({ message: "Failed to get attendances" });
    }
  });

  app.get("/api/attendance/:id", ensureAuthenticated, async (req, res) => {
    try {
      const attendance = await storage.getAttendance(Number(req.params.id));
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get attendance record" });
    }
  });

  app.post("/api/attendance", ensureTeacher, validateRequest(insertAttendanceSchema), async (req, res) => {
    try {
      const attendance = await storage.createAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to create attendance record" });
    }
  });

  app.put("/api/attendance/:id", ensureTeacher, async (req, res) => {
    try {
      const updatedAttendance = await storage.updateAttendance(Number(req.params.id), req.body);
      if (!updatedAttendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(updatedAttendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to update attendance record" });
    }
  });

  app.delete("/api/attendance/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteAttendance(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete attendance record" });
    }
  });

  // Internship attendance routes
  app.get("/api/internship-attendance", ensureAuthenticated, async (req, res) => {
    try {
      const internshipId = req.query.internshipId ? Number(req.query.internshipId) : undefined;
      const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      let attendances;
      if (internshipId) {
        attendances = await storage.getInternshipAttendancesByInternship(internshipId);
      } else if (studentId) {
        attendances = await storage.getInternshipAttendancesByStudent(studentId);
      } else if (date) {
        attendances = await storage.getInternshipAttendancesByDate(date);
      } else {
        attendances = await storage.getInternshipAttendances();
      }
      
      res.json(attendances);
    } catch (error) {
      res.status(500).json({ message: "Failed to get internship attendances" });
    }
  });

  app.get("/api/internship-attendance/:id", ensureAuthenticated, async (req, res) => {
    try {
      const attendance = await storage.getInternshipAttendance(Number(req.params.id));
      if (!attendance) {
        return res.status(404).json({ message: "Internship attendance record not found" });
      }
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get internship attendance record" });
    }
  });

  app.post("/api/internship-attendance", ensureTeacher, validateRequest(insertInternshipAttendanceSchema), async (req, res) => {
    try {
      const attendance = await storage.createInternshipAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to create internship attendance record" });
    }
  });

  app.put("/api/internship-attendance/:id", ensureTeacher, async (req, res) => {
    try {
      const updatedAttendance = await storage.updateInternshipAttendance(Number(req.params.id), req.body);
      if (!updatedAttendance) {
        return res.status(404).json({ message: "Internship attendance record not found" });
      }
      res.json(updatedAttendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to update internship attendance record" });
    }
  });

  app.delete("/api/internship-attendance/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteInternshipAttendance(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Internship attendance record not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete internship attendance record" });
    }
  });
  
  // Subject routes
  app.get("/api/subjects", ensureAuthenticated, async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get subjects" });
    }
  });

  app.get("/api/subjects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const subject = await storage.getSubject(Number(req.params.id));
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      res.status(500).json({ message: "Failed to get subject" });
    }
  });

  app.post("/api/subjects", ensureAdmin, validateRequest(insertSubjectSchema), async (req, res) => {
    try {
      const subject = await storage.createSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  app.put("/api/subjects/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedSubject = await storage.updateSubject(Number(req.params.id), req.body);
      if (!updatedSubject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.json(updatedSubject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update subject" });
    }
  });

  app.delete("/api/subjects/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteSubject(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subject" });
    }
  });
  
  // Room routes
  app.get("/api/rooms", ensureAuthenticated, async (req, res) => {
    try {
      const rooms = await storage.getRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rooms" });
    }
  });

  app.get("/api/rooms/:id", ensureAuthenticated, async (req, res) => {
    try {
      const room = await storage.getRoom(Number(req.params.id));
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to get room" });
    }
  });

  app.post("/api/rooms", ensureAdmin, validateRequest(insertRoomSchema), async (req, res) => {
    try {
      const room = await storage.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.put("/api/rooms/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedRoom = await storage.updateRoom(Number(req.params.id), req.body);
      if (!updatedRoom) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(updatedRoom);
    } catch (error) {
      res.status(500).json({ message: "Failed to update room" });
    }
  });

  app.delete("/api/rooms/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteRoom(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete room" });
    }
  });
  
  // Timetable routes
  app.get("/api/timetables", ensureAuthenticated, async (req, res) => {
    try {
      const classId = req.query.classId ? Number(req.query.classId) : undefined;
      const teacherId = req.query.teacherId ? Number(req.query.teacherId) : undefined;
      const dayOfWeek = req.query.dayOfWeek ? Number(req.query.dayOfWeek) : undefined;
      
      let timetables;
      if (classId) {
        timetables = await storage.getTimetablesByClass(classId);
      } else if (teacherId) {
        timetables = await storage.getTimetablesByTeacher(teacherId);
      } else if (dayOfWeek !== undefined) {
        timetables = await storage.getTimetablesByDay(dayOfWeek);
      } else {
        timetables = await storage.getTimetables();
      }
      
      res.json(timetables);
    } catch (error) {
      res.status(500).json({ message: "Failed to get timetables" });
    }
  });

  app.get("/api/timetables/:id", ensureAuthenticated, async (req, res) => {
    try {
      const timetable = await storage.getTimetable(Number(req.params.id));
      if (!timetable) {
        return res.status(404).json({ message: "Timetable not found" });
      }
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ message: "Failed to get timetable" });
    }
  });

  app.post("/api/timetables", ensureAdmin, validateRequest(insertTimetableSchema), async (req, res) => {
    try {
      const timetable = await storage.createTimetable(req.body);
      res.status(201).json(timetable);
    } catch (error) {
      res.status(500).json({ message: "Failed to create timetable" });
    }
  });

  app.put("/api/timetables/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedTimetable = await storage.updateTimetable(Number(req.params.id), req.body);
      if (!updatedTimetable) {
        return res.status(404).json({ message: "Timetable not found" });
      }
      res.json(updatedTimetable);
    } catch (error) {
      res.status(500).json({ message: "Failed to update timetable" });
    }
  });

  app.delete("/api/timetables/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteTimetable(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Timetable not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timetable" });
    }
  });

  // Teacher routes
  app.get("/api/teachers", ensureAuthenticated, async (req, res) => {
    try {
      const teachers = await storage.getTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teachers" });
    }
  });

  app.get("/api/teachers/:id", ensureAuthenticated, async (req, res) => {
    try {
      const teacher = await storage.getTeacher(Number(req.params.id));
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to get teacher" });
    }
  });

  app.post("/api/teachers", ensureAdmin, validateRequest(insertTeacherSchema), async (req, res) => {
    try {
      const teacher = await storage.createTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to create teacher" });
    }
  });

  app.put("/api/teachers/:id", ensureAdmin, async (req, res) => {
    try {
      const updatedTeacher = await storage.updateTeacher(Number(req.params.id), req.body);
      if (!updatedTeacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.json(updatedTeacher);
    } catch (error) {
      res.status(500).json({ message: "Failed to update teacher" });
    }
  });

  app.delete("/api/teachers/:id", ensureAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteTeacher(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete teacher" });
    }
  });

  // User management routes
  app.get("/api/users", ensureAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      
      // Remove passwords from the response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
