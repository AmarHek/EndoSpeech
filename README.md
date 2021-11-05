# EndoAssist Befundung

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
