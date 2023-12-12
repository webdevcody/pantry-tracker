I'll update this later

## Getting Started

```bash
cp .env.sample env
docker compose up
npm i
npm run db:push
npm run dev
open http://localhost:3000
```

## Project Goals

- Everything works using progressive enhancement (all functionality works with javascript disabled)

## The Architecture

In this project, I am trying to apply clean architecture principles, including a separate data access layer (drizzle), a business layer (use cases and business entities), and a presentational layer (server actions / next rsc data fetchers). This also include following paradigms including dependency inversion, meaning the business layer should know NOTHING about next.js, server actions, the database or ORM, etc. To achieve this, often inside the next server actions, we inject the use case dependencies as functional dependencies (context). I do no like using existing libraries that wire up all the dependencies or using decorators on top of functions which automatically inject things from some type of global registration service object.

To help keep clean boundaries, data that is passed between these layeres must be mapped into data transfer objects (DTO). This means you should not be returning anything related to drizzle back from the data layer, instead you should map results to a DTO. Same with the server actions. Server actions should only pass simple primatives to the use case and should never pass anything related to next or react to the use case. Things like revalidatePath or revalidateTag should never live in the business or persistence layer.

To some this may feel like over engineering, but many could argue this helps build systems that are more maintaible as they grow larger. I've been on a project for almost 5 years at work, and this uses a similar approach for that project which is getting close to half a million lines of typescript. Failing to follow a strict pattern in your code base will set you up for technical debt in the future.

I will say, I've never done this clean architecture type of approach on a next.js project, so I'm trying to get a feel for how I personally like it all setup. I've decided to defer using a mono repo and separating out the business logic / persistence layer until I feel it's necessary.

## TODO

- make everything responsive
