---
sidebar_position: 1
---

# Introduction

Welcome to the Chat App documentation! This guide will help you understand the project, set it up, and run it.

## Welcome to Our Fun Learning Project!

Hey there! Thanks for checking out Chat App. This project is all about having fun and learning cool stuff. We built it to play around with exciting technologies after our regular work hours. Whether you're a pro coder or just starting out, there's something here for everyone to learn and enjoy.

## Project Overview

Chat App is our playground for testing out different tech tools. We're exploring things like web sockets, Nx, Tailwind, RxAngular, and a special way of updating stuff in Angular without using zones. It's a basic chat app where you can talk to other users and send messages.

### Cool Things Our App Can Do

- Pick a user from a list (no need to sign up!)
- Send and receive messages
- See all your conversations and messages
- Keep your chats in sync, even when you go offline and come back online
- Chat one-on-one or in groups
- Use different languages (but we set this up when we build the app)

## How Our Project is Organized

We've set up our project like a big box with smaller boxes inside. Here's what it looks like:

```
chat-app/
├── apps/
│   ├── api/         # This is where our backend lives (it's like the app's brain)
│   ├── web/         # This is the frontend (what you see on your screen)
│   └── docs/        # You're reading this right now!
├── libs/
│   ├── shared/
│   │   └── dtos/    # Some shared stuff our frontend and backend both use
│   └── web/
│       ├── chat/    # The main chat feature
│       ├── account/ # Stuff about users
│       └── shared/  # Helper tools and settings for the frontend
```

## The Cool Tech We're Using

- **Front End**: Angular with RxAngular and Tailwind CSS (makes things look pretty)
- **Back End**: NestJS with Socket.IO (helps messages travel fast)
- **Database**: Supabase (stores all our chat data)
- **Project Organization**: Nx (keeps everything tidy)
- **Package Manager**: pnpm (installs all the tools we need)
- **Documentation**: Docusaurus (what you're reading right now)

## Getting Started

### What You'll Need

- Node.js (version 18.0 or newer)
- pnpm
- Nx CLI
- A Supabase account (don't worry, it's free!)

### Setting Up

1. Copy our project to your computer:
   ```bash
   git clone https://github.com/michalgrzegorczyk-dev/chat-app.git
   cd chat-app
   ```

2. Install all the necessary tools:
   ```bash
   pnpm install
   ```

3. Set up your secret keys:
   Make a new file called `.env` in the main folder and add these lines:
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   ```
   (You'll get these from your Supabase account)

4. Set up your Supabase database:
  - Create a free Supabase account if you haven't already
  - In your Supabase project, go to the SQL editor
  - Copy the contents of the `database/init.sql` file from our project
  - Paste it into the SQL editor and run it to set up your database

5. Start the app:
   ```bash
   pnpm run dev-all
   ```

## Running the App

To start everything at once:

```bash
pnpm run dev-all
```

If you want to start just one part:

- For the back end:
  ```bash
  nx serve api
  ```

- For the front end:
  ```bash
  nx serve web
  ```

- For this documentation:
  ```bash
  nx serve docs
  ```

## Building the Whole Project

To build everything:

```bash
nx run-many --target=build
```

## Other Helpful Commands

- To check for code errors:
  ```bash
  pnpm run lint-all
  ```

- To run tests (when we add them):
  ```bash
  nx run-many --target=test
  ```

[//]: # (## Contributing)

[//]: # ()

[//]: # (We welcome contributions to the Chat App project. Please refer to our [Contributing Guidelines]&#40;CONTRIBUTING.md&#41; for more information.)

[//]: # ()

[//]: # (## License)

[//]: # ()

[//]: # (This project is licensed under the MIT License. See the [LICENSE]&#40;LICENSE&#41; file for details.)
