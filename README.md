# todolist

## description
a graphql backend for a todolist app, part of NorthOne code challenge,

## How to run
### requirements
A nodejs capable device & terminal

if you have that, then just do
```bash
npm install
node app.js
```

Once it's up and running head over to http://localhost:4000 and consult the GraphQL Schema for what you need to do.

note that for all API's except login and register, you will need to supply a token in the request header in the following format

```
//you can get a token from the login or register mutations
{
  "authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QyIiwiaWF0IjoxNjE4OTAyMDExfQ.wvVWOOpJb-aiTNVQJf-5nSDO6h34_1Fm6VW9lTSIDxA"
}
```
