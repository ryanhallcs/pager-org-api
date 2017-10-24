# pager-org-api
CRUD Api: AWS ECS, Postgres DB, Cloudform

Working deployment at: http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/
Sample queries:
- Get http and timing metrics: GET to http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/metrics
    - curl: ```curl http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/metrics```
- Get a JWT: POST payload { id: 1 } to http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/login
    - curl: ```curl -d '{"id":"1"}' -H "Content-Type: application/json" -X POST http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/login```
- Create an Organization: Ensure valid JWT in Authorization header and POST a valid payload to http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization
    - curl: ```curl -d '{"name":"unique name 29","description":"some description","code":"UNIQUE_CODE_29","url":"http://www.validurl.com","type":"health system"}' -H "Content-Type: application/json" -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTUwODc4MDM0NX0.O2iZBQkrIJHO0RP8VaqJ5s035UnzqZJreVeNskbZUkk" -X POST http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization```
- Get an Organization by id: Ensure valid JWT in Authorization header and GET to http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization/1
    - curl: ```curl -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTUwODc4MDM0NX0.O2iZBQkrIJHO0RP8VaqJ5s035UnzqZJreVeNskbZUkk" http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization/1```
- Search for an Organization by code: Ensure valid JWT in Authorization header and GET to http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization?code=MY_SEARCH_CODE
    - curl: ```curl -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTUwODc4MDM0NX0.O2iZBQkrIJHO0RP8VaqJ5s035UnzqZJreVeNskbZUkk" http://pager-org-api-1612248399.us-west-2.elb.amazonaws.com/api/v1/organization?code=TEST3```

# Features
1. Highly available CRUD API for Organizations written in JS using Hapi
1. Request and DB schema level validation
1. DI and IoC using [inversify js](https://github.com/inversify/InversifyJS)
1. JWT Authorization on all CRUD endpoints, not auth on /metrics and /api/v1/login endpoints
1. Basic unit testing of services and controllers utilizing Hapi's ```.inject()``` functionality
1. Postgres database
    1. [sequelize](http://docs.sequelizejs.com/) ORM
    1. Migrations to create main table in ```/lib/migrations``` folder
    1. Indexes aligned with basic query patters of the search logic
        1. PK on id column, associated with ```/api/v1/organization/{id}```
        1. Unique BTREE indexes on code and name columns for ```/api/v1/organization?code=code``` and ```/api/v1/organization?name=name``` endpoints
1. Request level metrics available through ```/metrics```
1. Dockerized service, pushed to AWS ECR
1. gulp building and task running with argument injection
    1. Build: ```gulp```
    1. Run server with recomplication on saving: ```gulp serve```
    1. Example of running on a different port and db credentials: ```gulp serve --serverPort=3000 --username=myuser --password=mypass```
    1. Run tests: ```gulp test```
1. AWS Cloudformation setup
    1. Full stack within VPC
    1. Deployment to ECS - ECS deploys containers to and autoscaling group across 2 availability zones (AZ) in private subnets
    1. Postgres RDS deployed also within private subnet
    1. Logging in cloudwatch
    1. Requests from internet routed only to load balancer, outgoing requests routed through NATs in their respective public subnets in each AZ
    1. DB only allows connections from ECS containers (the API services)
    1. Rolling updates utilizing CF and ECS: ```aws cloudformation update-stack```
    1. Custom implementation based off of [this ref arch](https://github.com/awslabs/ecs-refarch-cloudformation) - modified to fit this application and DB
    
# Notes
- CloudFormation was chosen because I didn't plan on using a deployment service and it still fit my requirements of having a declarative, infrastructure-as-code structure. (In the past I've used Terraform for this)
- Migrations are run on server startup, which is not a great pattern, but necessary since DB is not accessible to public and I didn't set up VPN infrastructure. Ideally they would be apart of the deploy process.
- Javascript language specific patterns are not a strong suit of mine as I've never developed a service in JS. I'm hoping instead the concepts of development came across: [SOLID principles](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)), etc
- Deployment was done locally but is not complicated and easily scriptable for a system like Jenkins or Gitlab-CI. It involves:
    1. Building and pushing docker container to ECR ``docker build``` and ```docker push```
    1. Updating /infra/cloudformation files on s3 ```aws s3 sync```
    1. Running ```aws cloudformation update-stack``` and rolling service updates can be seen in cloudformation console (or by CLI if needed)
