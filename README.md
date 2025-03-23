# Project Setup Instructions

Follow the steps below to set up and run the application locally:

## Step 1: Clone the Repository

Clone the repository to your local machine.

## Step 2: Install the packages with following command.

`npm i`

## Step 3: Environment Setup

Create a .env file in the root directory and add following environment varialbes to it.

```
DATABASE_URL=
JWT_AT_SECRET=
JWT_RT_SECRET=
```

You can add a random secret values for access token(AT) and refresh token(RT) secrets.

## Step 4: Database setup

MongoDB is the database for the project with [Prisma](https://www.prisma.io/) ORM.
Add a mongodb connection URI to `DATABASE_URL` in the .env file.

Then run the following two commands.

`npx prisma generate`<br>
`npx prisma db push`

## Step 4: Run the project by following command

`npm run start`

#### Swagger Url: go to `http://localhost:3000/api#/` in your browser
