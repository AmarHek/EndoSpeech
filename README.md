# EndoAssist Befundung

backend contains all code for the node-server
frontent is the angular project
build contains .exes and folders for deployment
test-build contains the same folders, but for testing environment

## Build for production

```bash

# login on server
ssh <username>@endovm

# build client (Angular) app and insert into server (automatically done)
cd frontend/
ng build:prod

# either host server 
cd ..
pm2 start pm2config.json

# or build to exe
cd backend/
npm build

logout
```
