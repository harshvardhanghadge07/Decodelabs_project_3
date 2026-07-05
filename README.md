# Student Enrollment System (Project 3 — Database Integration)

A full CRUD backend built with **Node.js + Express + MongoDB (Mongoose)**, modeling a
Student/Course enrollment platform. This satisfies the Project 3 requirements:

- **Schema design** — `Student`, `Course`, and a junction-style `Enrollment` collection
  that models the many-to-many relationship between students and courses.
- **CRUD operations** — full Create/Read/Update/Delete on all three resources.
- **Data integrity** — required fields, unique constraints (email, course code, and a
  compound unique index preventing duplicate enrollments), value ranges (age, credits,
  capacity), and referential checks (an enrollment can't be created unless the student
  and course actually exist).

## 1. Setup

```bash
cd student-enrollment-system
npm install
cp .env.example .env
# edit .env if your MongoDB URI is different (e.g. MongoDB Atlas connection string)
npm run dev   # or: npm start
```

Requires a running MongoDB instance (local `mongod`, Docker container, or a free
MongoDB Atlas cluster). Server runs at `http://localhost:5000`.

## 2. Data Model

```
Student                     Course
--------                    --------
_id                         _id
name                        title
email (unique)              code (unique)
age                         instructor
enrollmentYear              credits
                            capacity

              Enrollment  (junction collection)
              --------------------------------
              _id
              student  -> ref Student._id
              course   -> ref Course._id
              status   (active | completed | dropped)
              grade    (A | B | C | D | F | null)
              enrollmentDate
              [unique index on (student, course)]
```

## 3. API Reference

### Students — `/api/students`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Create a student |
| GET | `/api/students` | List all students |
| GET | `/api/students/:id` | Get one student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

Example body:
```json
{ "name": "Alice Smith", "email": "alice@example.com", "age": 21 }
```

### Courses — `/api/courses`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Create a course |
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Get one course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

Example body:
```json
{ "title": "Intro to Databases", "code": "cs101", "instructor": "Dr. Rao", "credits": 4, "capacity": 30 }
```

### Enrollments — `/api/enrollments`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/enrollments` | Enroll a student in a course |
| GET | `/api/enrollments` | List all enrollments (with student/course populated) |
| GET | `/api/enrollments/:id` | Get one enrollment |
| PUT | `/api/enrollments/:id` | Update status/grade |
| DELETE | `/api/enrollments/:id` | Remove an enrollment |
| GET | `/api/enrollments/student/:studentId` | All courses for one student |

Example body (create):
```json
{ "student": "<studentId>", "course": "<courseId>" }
```

Example body (update):
```json
{ "status": "completed", "grade": "A" }
```

## 4. Testing the API

Use Postman, Insomnia, or curl. Example flow:

```bash
# 1. Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Smith","email":"alice@example.com","age":21}'

# 2. Create a course
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Intro to Databases","code":"CS101","instructor":"Dr. Rao","credits":4}'

# 3. Enroll the student (use the _id values returned above)
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"student":"<studentId>","course":"<courseId>"}'
```

## 5. What this demonstrates (mapped to the training kit's four pillars)

1. **The Blueprint (Schema & Design)** — Mongoose schemas with validation rules acting
   like SQL constraints (`required` = NOT NULL, `unique` = UNIQUE, `min`/`max` = CHECK).
2. **The Bridge (Integration)** — Mongoose ORM connects Express route handlers to MongoDB.
3. **The Action (CRUD & REST)** — POST=Create, GET=Read, PUT=Update, DELETE=Delete, each
   mapped to a proper HTTP verb and route.
4. **The Shield (Integrity & Security)** — schema validation, duplicate-enrollment
   prevention, referential existence checks, and capacity enforcement, instead of trusting
   raw client input.

## 6. Ideas to extend further

- Add pagination/filtering to `GET /api/courses` and `GET /api/students`.
- Add authentication (JWT) so only admins can create/delete courses.
- Add a `PATCH` route for partial updates.
- Move to PostgreSQL + Prisma to compare the relational approach side-by-side.
