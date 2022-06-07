# Exam #1: "StudyPlan"
## Student: s294889 CAVENATI MARCO 

## React Client Application Routes

TODO

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/v1/courses`

    Get all the courses offered by the university.

    **Sample request:** get /api/v1/courses

    **Sample response:** 200 OK
    ```
    [
        {
            "code": "02GOLOV",
            "name": "Architetture dei sistemi di elaborazione",
            "credits": 12,
            "students": 2,
            "maxStudents": 5,
            "preparatoryCourse": null,
            "incompatibleCourses": ['02LSEOV']
        },
        // TODO add other courses
    ]
    ```
    **Other responses:** 500 Internal Server Error

- GET `/api/v1/studyPlans/:studentId`

    Get the study plan of the logged in user.

    **Sample request:** get /api/v1/studyPlans/1

    **Sample response:** 200 OK
    ```
    {
        "isPartTime": true,
        "courses": [ '02GOLOV', '01SQLOV' ]
    }
    ```

    **Other responses:** 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error

- POST `/api/v1/studyPlans`

    Add a study plan for the logged in student.

    **Sample request:** post /api/v1/studyPlans
    ```
    {
        "isPartTime": true,
        "courses": [ '02GOLOV', '01SQLOV' ]
    }
    ```

    **Sample response:** 201 Created

    **Other responses:** 401 Unauthorized, 409 Conflict, 422 Unprocessable Entity, 500 Internal Server Error

- PUT `/api/v1/studyPlans/:studentId`

    Replace the study plan of the student.

    **Sample request:** put /api/v1/studyPlans/1
    ```
    {
        "isPartTime": false,
        "courses": [ '02GOLOV', '01SQLOV' ]
    }
    ```

    **Sample response:** 200 OK

    **Other responses:** 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity, 500 Internal Server Error

- DELETE `/api/v1/studyPlans/:studentId`

    Delete the study plan of the student.

    **Sample request:** delete /api/v1/studyPlans/1

    **Sample response:** 204 No Content

    **Other responses:** 401 Unauthorized, 403 Forbidden, 500 Internal Server Error

- POST `/api/v1/sessions`
Perform the login.

    **Sample request:** post /api/v1/sessions
    ```
    {
        "username": "s123456@studenti.polito.it",
        "password": "password"
    }
    ```

    **Sample response:** 201 Created

    **Other responses:** 401 Unauthorized, 422 Unprocessable Entity, 500 Internal Server Error

- DELETE `/api/v1/sessions/:studentId`

    Perform the logout.

    **Sample request:** delete /api/v1/sessions/1

    **Sample response:** 205 Reset Content

    **Other responses:** 401 Unauthorized, 403 Forbidden, 500 Internal Server Error


## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
