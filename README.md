# EndoAssist Befundung

## Build for production

```bash

# login on server
ssh <username>@endovm

# build client (Angular) app and insert into server
cd frontend/
ng build:prod

# host server 
pm2 start pm2config.json

logout
```
