# Discloser API - Documentation

## API Overview

The backend for the Discloser application, providing REST API endpoints for user management, test record processing, and reminder services.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [API Endpoints](#api-endpoints)
5. [Document Processing Pipeline](#document-processing-pipeline)
6. [Data Models](#data-models)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Sample Test Files](#sample-test-files)

## Features

### Document Processing

- PDF and image parsing to extract medical test results
- OCR capabilities for converting image-based documents to text
- Intelligent pattern matching to identify test types and results

### Secure Storage

- Object storage integration for secure document management
- Database storage for structured test result data

### Reminder System

- Testing schedule management based on user risk level

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **MySQL** - Relational database
- **Knex.js** - SQL query builder and migrations
- **Tesseract.js** - OCR processing for document parsing
- **MinIO** - Object storage for documents
- **PDF-lib & pdf2pic** - PDF manipulation libraries

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/discloser-api.git
   cd discloser-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:

   ```
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=discloser
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9001
   MINIO_ACCESS_KEY=youraccesskey
   MINIO_SECRET_KEY=yoursecretkey
   MINIO_USE_SSL=false
   MINIO_BUCKET_NAME=discloser
   ```

4. Set up the database:

   ```bash
   npm run migrate
   npm run seed
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

6. The API will be available at http://localhost:8000

## API Endpoints

### User Management

- `GET /users/:id` - Get user information
- `POST /users` - Create a new user

### Records Management

- `POST /records/upload` - Upload and process test records
- `GET /records` - Get all records for a user
- `GET /records/:id` - Get a specific record
- `POST /records/update` - Update records

### Test Results

- `GET /results/record/:test_record_id` - Get results for a record
- `GET /results/:id` - Get a specific result
- `DELETE /results/:id` - Delete a result

### Reminders

- `GET /reminders/:user_id/reminders` - Get reminders for a user
- `POST /reminders/:user_id/reminders` - Create a new reminder
- `PUT /reminders/:user_id/reminders/:id` - Update a reminder
- `DELETE /reminders/:user_id/reminders/:id` - Delete a reminder

### Sharing

- `GET /share/:userId` - Get shareable test results for a user

## Document Processing Pipeline

The API includes a the following document processing pipeline:

1. **Upload Handling**

   - Files are received via multipart form data
   - Initial validation for file type and size limits

2. **Document Type Detection**

   - Identifies PDFs vs. image formats
   - Routes to appropriate processing stream

3. **PDF Processing**

   - Conversion to images for OCR processing
   - Page-by-page extraction

4. **Image Processing**

   - Preprocessing with sharp.js for better OCR results
   - Image enhancement and normalization

5. **OCR Processing**

   - Text extraction using Tesseract.js
   - Optimized settings for medical document formats

6. **Text Analysis**

   - Pattern matching for known test types
   - Regular expressions for result extraction
   - Date extraction and standardization

7. **Result Structuring**

   - Categorization of test types
   - Standardization of result values
   - Context extraction for notes

8. **Storage**
   - Original document saved to MinIO
   - Structured results saved to MySQL
   - Relationship linking between documents and results

## Data Models

### User

- `id` (PK)
- `name`
- `screen_name`
- `email`
- `avatar_file_path`
- `birth_date`
- `bio`
- `is_active`
- `created_at`
- `updated_at`

### TestRecord

- `id` (PK)
- `user_id` (FK)
- `test_date`
- `file_path`
- `file_type`
- `file_metadata`
- `is_active`
- `created_at`
- `updated_at`

### TestResult

- `id` (PK)
- `test_record_id` (FK)
- `test_type`
- `result`
- `notes`
- `is_active`
- `created_at`
- `updated_at`

### TestingReminders

- `id` (PK)
- `user_id` (FK)
- `frequency`
- `next_test_date`
- `last_notified_date`
- `is_active`
- `created_at`
- `updated_at`

## Deployment

The API is deployed using Google Cloud Build with the following components:

- **Server**: Google Cloud Run
- **Database**: Google Cloud SQL (MySQL)
- **Object Storage**: Wasabi

Deployment process:

1. Push to main branch triggers Cloud Build
2. Docker container is built and deployed to Cloud Run
3. Environment variables are injected from Secret Manager
4. Database migrations are run if needed
