# Project Name

## Overview
This project is built using TypeScript and Angular, with Tailwind CSS for styling. It includes shared DTOs for user and conversation management.

## Project Structure
- `libs/shared/dtos/src/lib/dto/`
  - `user.dto.ts`: Contains the `UserDto` type.
  - `conversation-details.dto.ts`: Contains interfaces for `ConversationDetailsDto`, `MemberDto`, `MessageDto`, and `ReceiveMessageDto`.
  - `conversation.dto.ts`: Contains the `ConversationDto` interface.
- `apps/web/src/styles.scss`: Contains Tailwind CSS imports.

## Technologies Used
- **TypeScript**
- **JavaScript**
- **Angular**
- **Tailwind CSS**
- **npm**

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/project-name.git
    ```
2. Navigate to the project directory:
    ```bash
    cd project-name
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

### Running the Application
To start the development server:
```bash
npm start
