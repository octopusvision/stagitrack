# Nursing School Management System

A comprehensive web application for managing the academic structure and operations of a nursing school.

## Table of Contents

- [Project Overview](#project-overview)
- [Technical Stack](#technical-stack)
- [Core Features](#core-features)
  - [Authentication System](#authentication-system)
  - [Academic Structure Management](#academic-structure-management)
  - [Course Management](#course-management)
  - [Evaluation System](#evaluation-system)
- [UI/UX Implementation](#uiux-implementation)
- [Data Management](#data-management)
- [Navigation System](#navigation-system)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Technical Details](#technical-details)
- [Lessons Learned and Common Issues](#lessons-learned-and-common-issues)
- [Future Features](#future-features)

## Project Overview

The Nursing School Management System is a full-stack web application designed to manage all aspects of a nursing school's academic structure and operations. The system follows a hierarchical academic structure where:

- Programs (Filières) contain Promotions
- Promotions contain Classes
- Classes contain Program Blocks (semesters)
- Program Blocks contain Training Units (modules)
- Training Units contain Sequences (teaching sessions)
- Sequences have Teacher Assignments and Evaluations

## Technical Stack

### Frontend
- **Framework**: React + Vite
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Build System**: Vite + esbuild

### Backend
- **Framework**: Node.js/Express
- **Language**: TypeScript
- **Database**: Drizzle ORM
- **Authentication**: Custom session-based
- **File Storage**: Built-in file handling

## Core Features

### Authentication System

- **Implementation**:
  - Custom authentication endpoints
  - Protected routes using React Router
  - Session management with secure cookies
  - Role-based access control
  - Password hashing and security measures

### Academic Structure Management

#### Programs (Filières)
- **Features**:
  - Create and manage different nursing programs
  - Set program durations (e.g., IP = 3 years, IA = 2 years)
  - Track program-specific requirements
  - Manage program relationships

#### Promotions
- **Features**:
  - Create promotions based on entry years
  - Manage promotion cohorts
  - Track promotion progress
  - Maintain relationships with programs
  - Fixed duplicate header issue by:
    - Removing component-level AppLayout wrappers
    - Using React fragments
    - Maintaining proper section titles

#### Program Blocks (Semesters)
- **Features**:
  - Divide academic years into blocks (semesters)
  - Manage block-specific content
  - Track block progress
  - Maintain relationships with classes
  - Fixed duplicate header issue similar to Promotions

### Course Management

#### Training Units (Modules)
- **Features**:
  - Create and manage training units
  - Assign credits to units
  - Track unit prerequisites
  - Manage unit relationships with program blocks
  - Implement validation for unit requirements

#### Sequences
- **Features**:
  - Create teaching sequences
  - Track volume horaire (teaching hours)
  - Manage teacher assignments
  - Implement sequence scheduling
  - Track sequence prerequisites

### Evaluation System

- **Features**:
  - Create and manage evaluations
  - Track student scores
  - Implement different evaluation types
  - Manage evaluation weights
  - Export evaluation results
  - Track evaluation progress

## UI/UX Implementation

- **Layout System**:
  - Implemented AppLayout component for consistent headers
  - Created responsive sidebar navigation
  - Added proper spacing and padding
  - Implemented consistent color scheme

- **Component Library**:
  - Used shadcn/ui components
  - Created custom components for academic structure
  - Implemented proper form validation
  - Added loading states and error handling

## Data Management

- **Database Schema**:
  - Implemented proper relationships between entities
  - Added validation schemas
  - Created proper indexes
  - Implemented data integrity checks

- **API Implementation**:
  - Created RESTful endpoints
  - Implemented proper error handling
  - Added authentication middleware
  - Implemented rate limiting

## Navigation System

- **Sidebar Implementation**:
  - Created dynamic navigation based on user role
  - Implemented collapsible submenu for academic structure
  - Added proper routing for all pages
  - Implemented active state highlighting

## Error Handling

- **Global Error Boundaries**:
  - Implemented error boundaries
  - Added toast notifications
  - Created proper error states
  - Implemented validation feedback

## Performance Optimization

- **Data Fetching**:
  - Implemented React Query for efficient data fetching
  - Added proper caching
  - Implemented pagination
  - Added loading states

- **Build Optimization**:
  - Used Vite for fast development builds
  - Implemented code splitting
  - Added proper tree shaking
  - Optimized bundle size

## Technical Details

### Database Design

The database design follows a normalized structure that maintains the academic hierarchy while ensuring data integrity and performance. Here's a detailed breakdown:

#### Core Academic Structure

1. **Programs (Filières)**
```sql
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    duration_years INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Promotions**
```sql
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    program_id INTEGER REFERENCES programs(id),
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Classes**
```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    promotion_id INTEGER REFERENCES promotions(id),
    year INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Program Blocks (Semesters)**
```sql
CREATE TABLE program_blocks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class_id INTEGER REFERENCES classes(id),
    semester INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Course Management

1. **Training Units (Modules)**
```sql
CREATE TABLE training_units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    program_block_id INTEGER REFERENCES program_blocks(id),
    description TEXT,
    credits INTEGER,
    prerequisites TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Sequences**
```sql
CREATE TABLE sequences (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    training_unit_id INTEGER REFERENCES training_units(id),
    description TEXT,
    volume_horaire INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Evaluation System

1. **Evaluations**
```sql
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    sequence_id INTEGER REFERENCES sequences(id),
    evaluation_type VARCHAR(50) NOT NULL,
    max_score INTEGER NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **Evaluation Results**
```sql
CREATE TABLE evaluation_results (
    id SERIAL PRIMARY KEY,
    evaluation_id INTEGER REFERENCES evaluations(id),
    student_id INTEGER REFERENCES students(id),
    score INTEGER,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Teacher Management

1. **Teacher Sequence Assignments**
```sql
CREATE TABLE teacher_sequence_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    sequence_id INTEGER REFERENCES sequences(id),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexes and Constraints

```sql
-- Indexes for frequently queried fields
CREATE INDEX idx_promotions_program_id ON promotions(program_id);
CREATE INDEX idx_classes_promotion_id ON classes(promotion_id);
CREATE INDEX idx_program_blocks_class_id ON program_blocks(class_id);
CREATE INDEX idx_training_units_program_block_id ON training_units(program_block_id);
CREATE INDEX idx_sequences_training_unit_id ON sequences(training_unit_id);
CREATE INDEX idx_evaluations_sequence_id ON evaluations(sequence_id);
CREATE INDEX idx_evaluation_results_evaluation_id ON evaluation_results(evaluation_id);
CREATE INDEX idx_evaluation_results_student_id ON evaluation_results(student_id);

-- Unique constraints
ALTER TABLE programs ADD CONSTRAINT unique_program_abbreviation UNIQUE (abbreviation);
ALTER TABLE promotions ADD CONSTRAINT unique_promotion_name UNIQUE (name);
ALTER TABLE classes ADD CONSTRAINT unique_class_name UNIQUE (name);
ALTER TABLE training_units ADD CONSTRAINT unique_training_unit_name UNIQUE (name);
```

#### Data Integrity

1. **Foreign Key Constraints**
   - All relationships are enforced with proper foreign key constraints
   - Cascade delete is implemented for parent-child relationships
   - Null constraints are properly defined for required fields

2. **Validation Rules**
   - Programs: Duration must be between 1-6 years
   - Promotions: Start year must be less than end year
   - Classes: Year must be within program duration
   - Program Blocks: Semester must be between 1-2
   - Training Units: Credits must be positive
   - Sequences: Volume horaire must be positive
   - Evaluations: Weight must be between 0-1
   - Evaluation Results: Score must be between 0 and max_score

#### Performance Considerations

1. **Indexes**
   - Added indexes on frequently queried fields
   - Created composite indexes for common queries
   - Implemented covering indexes for specific queries

2. **Query Optimization**
   - Added proper JOIN conditions
   - Implemented proper WHERE clause ordering
   - Added LIMIT clauses for large datasets
   - Implemented proper GROUP BY clauses

3. **Caching**
   - Added query caching for frequently accessed data
   - Implemented result set caching
   - Added proper cache invalidation

### API Design

- **RESTful Endpoints**:
  - Implemented consistent URL structure
  - Used HTTP methods appropriately (GET, POST, PUT, DELETE)
  - Added proper error responses
  - Implemented rate limiting

- **Authentication**:
  - Custom session-based authentication
  - JWT token refresh mechanism
  - Role-based access control
  - Secure password hashing

### Frontend Architecture

- **Component Structure**:
  - Implemented proper component hierarchy
  - Created reusable UI components
  - Implemented proper state management
  - Added proper error boundaries

- **State Management**:
  - Used React Query for data fetching
  - Implemented proper caching
  - Added optimistic updates
  - Implemented error handling

### Performance Optimization

- **Frontend**:
  - Implemented code splitting
  - Added proper tree shaking
  - Optimized bundle size
  - Implemented lazy loading

- **Backend**:
  - Added database indexes
  - Implemented query optimization
  - Added caching layer
  - Implemented connection pooling

## Lessons Learned and Common Issues

### Common Issues and Solutions

1. **Duplicate Headers Issue**
   - **Problem**: Multiple headers appearing on academic structure pages
   - **Solution**: 
     - Removed component-level AppLayout wrappers
     - Used React fragments instead
     - Maintained proper section titles with CardHeader
     - Ensured consistent layout across all pages

2. **Data Integrity Issues**
   - **Problem**: Inconsistent data across related entities
   - **Solution**: 
     - Implemented proper foreign key constraints
     - Added validation schemas
     - Created proper error handling
     - Implemented cascade delete

3. **Performance Issues**
   - **Problem**: Slow page loads and data fetching
   - **Solution**: 
     - Implemented proper caching
     - Added database indexes
     - Optimized queries
     - Implemented lazy loading

4. **Authentication Issues**
   - **Problem**: Session management and role-based access
   - **Solution**: 
     - Implemented proper session handling
     - Added role-based access control
     - Created proper error handling
     - Added security measures

### Best Practices

1. **Code Organization**
   - Maintain consistent file structure
   - Use proper naming conventions
   - Implement proper error handling
   - Add proper documentation

2. **Error Handling**
   - Implement proper error boundaries
   - Add proper error logging
   - Create user-friendly error messages
   - Implement proper error recovery

3. **Performance**
   - Implement proper caching
   - Add database indexes
   - Optimize queries
   - Implement lazy loading

4. **Security**
   - Implement proper authentication
   - Add proper validation
   - Use secure password hashing
   - Implement proper error handling

## Future Features

### Academic Management

1. **Timetable Management**
   - Create and manage class schedules
   - Implement teacher availability tracking
   - Generate conflict-free timetables
   - Add room allocation system

2. **Student Progress Tracking**
   - Implement student progression tracking
   - Add academic warning system
   - Create student performance reports
   - Implement academic counseling system

3. **Teacher Management**
   - Add teacher workload management
   - Implement teacher evaluation system
   - Create teaching assignment optimization
   - Add professional development tracking

### Course Management

1. **Curriculum Management**
   - Implement curriculum versioning
   - Add course content management
   - Create learning outcome tracking
   - Implement competency mapping

2. **Resource Management**
   - Add digital resource library
   - Implement course material management
   - Create resource sharing system
   - Add multimedia content support

### Assessment System

1. **Advanced Evaluation**
   - Implement continuous assessment
   - Add peer evaluation system
   - Create self-assessment tools
   - Implement rubric-based grading

2. **Exam Management**
   - Add online exam system
   - Implement exam scheduling
   - Create exam paper management
   - Add plagiarism detection

### Student Services

1. **Student Portal**
   - Create student dashboard
   - Add course registration system
   - Implement gradebook access
   - Create schedule viewer

2. **Support Services**
   - Add counseling system
   - Implement academic advising
   - Create student support tracking
   - Add resource booking system

### Administrative Features

1. **Reporting System**
   - Add comprehensive reporting
   - Implement analytics dashboard
   - Create custom report builder
   - Add data export options

2. **Document Management**
   - Add document workflow
   - Implement digital signatures
   - Create document repository
   - Add version control

### Integration Features

1. **External Systems**
   - Add LMS integration
   - Implement email notifications
   - Create calendar sync
   - Add video conferencing

2. **Mobile Access**
   - Create mobile app
   - Implement push notifications
   - Add offline support
   - Create mobile-optimized UI

### Technical Enhancements

1. **Performance**
   - Add real-time updates
   - Implement data caching
   - Create load balancing
   - Add database optimization

2. **Security**
   - Add two-factor authentication
   - Implement audit logging
   - Create data encryption
   - Add security monitoring

### Community Features

1. **Communication**
   - Add internal messaging
   - Create discussion forums
   - Implement announcement system
   - Add feedback system

2. **Collaboration**
   - Add group project tools
   - Implement peer review
   - Create shared workspaces
   - Add collaboration tracking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for production)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
