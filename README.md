# Samyag Gyan #

## Project Overview ##


***Samyag Gyan*** is an innovative web-based platform designed to transform the way we **interact with online articles and documents**. In a world where a vast amount of academic and professional content exists in a digital, yet static, format, this project ***bridges the gap between the convenience of digital reading and the active learning experience of a physical book***.

The platform solves the core problem that traditional websites are not interactive.
Unlike a physical book where a student can highlight key passages and write notes in the margins, online articles lack these essential tools. This leads to a ***fragmented and inefficient workflow***, where users must jump between the content and an external note-taking application.

By integrating highlighting, bookmarking, and note-making directly into the website, Samyag Gyan creates a seamless, all-in-one interactive reading and knowledge-building experience.

### Core Features ###

- **Interactive Reading** :Highlight, bookmark, add notes content directly on the website.

- **Integrated Note-Making**: Create and save notes that are directly tied to the specific article on the website.

- **Personalized Database**: All user interactions are stored in a database, allowing for easy access and review.

- **Downloadable Summaries**: Users can download their highlights and notes into a single document for offline use and reference.

## Getting Started ##
This project is in its final phase, and the foundation is ready for developers to begin coding. This section will be updated with more specific instructions once the core development has begun.



### Contribution Guidelines ###
All contributions to this project must be made through a Pull Request. Do not push directly to the main branch. All Pull Requests will be reviewed before they are merged.

**Contact**
For any questions, feel free to contact the Project Owner, Deepanshu Anand.



# Instruction module for Developers #

# Samyag Gyan

## 1. Project Overview
Samyag Gyan is a web-based platform designed to transform the way users interact with online articles and documents. Unlike traditional websites where content is static and overwhelming, this platform provides an all-in-one interactive reading and knowledge-building experience by integrating highlighting, bookmarking, and note-making directly into the content.

The core problem we are solving is information overload. We are moving away from the social media model of infinite scrolling and toward a focused, one-at-a-time content consumption model. The platform is designed to be mobile-first, ensuring a seamless user experience across all devices.

---

## 2. Technical Instructions (Front-End)
The front end is a single, self-contained HTML file with inline JavaScript and CSS. It's built to present a clean, digestible user interface while containing a large amount of content on a single page.

### Key Features and Implementation

- **Collapsible Articles**: All articles for a given date are present on the same page, but they are initially hidden behind collapsible "tiles" to prevent visual clutter.  
  - **Implementation**: A click event listener is attached to each article tile. When a tile is clicked, the JavaScript function ensures that any currently open article (div) is collapsed before the selected article is expanded. This ensures only one article is visible at any time.

- **Interactive Reading Experience**: The front end includes logic for interactive highlighting and a context-aware note-making feature.  
  - **Implementation**: The JavaScript code contains functions to get the selected text from the user's cursor selection. This highlighted text, along with the corresponding article ID and user ID, is sent to the backend API for storage.

- **User Authentication**: The platform uses Telegram for user authentication, which is handled via a dedicated widget on the front end.  
  - **Implementation**: The Telegram login widget handles the initial authentication. The front-end code is prepared to receive a user token, which will be used for all subsequent API calls to store user-specific data like highlights and notes.

- **Article-Specific Data Handling**: Every article is uniquely identified by a `data-article-id`.  
  - **Implementation**: This unique ID is a crucial part of every API request. When a user highlights text or makes a note, the `data-article-id` is sent to the backend to ensure the highlight is correctly associated with the specific article.

---

## 3. Back-End & API Logic (Separate Repository)
The back-end system is designed to support the front-end's interactive features. The core logic is built around managing users and their content interactions.

### Database Tables

- **users**: Stores user-specific information, including `user_id`, `date_of_joining`, `language`, and `referral_code`.
- **articles**: Contains the content of each article, including `article_id`, `title`, and `total_word_count`.
- **highlights**: This is the central table for user interactions. It stores each highlight and is linked to a specific user and article.

### API Endpoints

#### `POST /highlights`
- **Purpose**: To save a new highlight from the front end.  
- **Logic**: The API accepts a `user_id`, `article_id`, and the `highlighted_text`. Before saving, it performs a critical validation: it checks if the new highlight's word count, combined with the user's existing highlights for that article, exceeds **20% of the article's total word count**. If the limit is exceeded, a specific error message is returned to the front end.

#### `GET /users/:userId/highlights`
- **Purpose**: To retrieve all highlights for a specific user.  
- **Logic**: The API takes a `userId` from the URL and fetches all corresponding highlight records from the database. This allows the front end to display a user's past highlights when they revisit an article.

#### `GET /users/:userId/notes/:today`
- **Purpose**: To generate a downloadable text file containing a user's notes and highlights for a specific day.  
- **Logic**: The API compiles the relevant notes and highlights, formats them into a simple text file, and sends the file to the front end. The front end's JavaScript then handles the download process by creating a temporary link and triggering a click.


