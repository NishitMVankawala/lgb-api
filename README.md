LGB Portal API
===

### Development

**1. Environment Variables**

Copy `.env.example` to `.env`

Copy `.drone-secret.example` to `.drone-secret`

Copy `.drone-env.example` to `.drone-env`

---

**2. Update Credentials**

Insert the following credentials in .drone-env

- `dockerhub_username` username for docker hub
- `dockerhub_passwrod` password for docker hub
- `stage_server_password` password for the staging server

---

Install dependencies

`yarn install` or `npm install`

Run drone local execution 

`drone exec --secret-file=.drone-secret --env-file=.drone-env`# lgb-api
