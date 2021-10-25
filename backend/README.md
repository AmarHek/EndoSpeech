Backend Working Structure:

- server.ts sets up Server on Port 8000 and is the file that has to be executed
- app.ts connects to MongoDB, sets CORSE Headers and defines basic API Path
- MongoDB must be installed locally, port and database names can be set in config/db.config.ts

Folder config:
- cors origins in cors.config.ts
- mongo config in db.config.ts

Folder models:

- dict.schema.ts defines how a template looks like in the database (a template and its name),
  have in mind that an id is automatically added as well
- dict.model.ts defines how a template and its substructures look like in json / from excel
- record.schema.ts defines records

Folder controllers:
- all functions for HTTP requests are defined here

Folder Routes:
- defines proper routing for all HTTP requests
- implements multer for dict excels/jsons

Folder middleware:
- contains excelParser middleware for parsing xlsx files into jsons

Public folders:
- dist for angular output
- data for excels and jsons (records are saved as plain text in mongodb)
