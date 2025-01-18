# Arbora

![Logo](https://github.com/AustinGTI/Arbora/blob/master/arbora-fe/public/screenshots/logo.png)

Arbora is an AI-powered study companion that transforms your notes into an interactive learning experience, visualized as a growing virtual forest. Built for the Google Gemini Competition 2024, it combines innovative note visualization with adaptive learning powered by the Gemini API.

## 🎥 Watch the Demo
[![Demo](https://img.shields.io/badge/Demo-Video-red?style=for-the-badge&logo=youtube)](https://youtube.com/watch?v=IGXaZzqHnhc&feature=youtu.be)

## 🌳 Overview

Arbora revolutionizes the study experience by representing your knowledge as a living, breathing forest. Each document becomes a tree, with branches representing topics and canopies showing your mastery level through color gradients. As you learn and interact with the content, your forest flourishes, providing an intuitive visual representation of your learning journey.

![Home Page](https://github.com/AustinGTI/Arbora/blob/master/arbora-fe/public/screenshots/home.png)

## ✨ Key Features

### 📝 Intelligent Document Management
- Rich markdown editor for organizing study materials
- Hierarchical organization using header tags
- Toggle between edit and view modes
- Auto-saves your progress

### 🌲 Dynamic Knowledge Visualization
- Documents visualized as interactive trees
- Branches represent topic hierarchies
- Color-coded canopies indicate mastery level (orange to green)
- Hover and click navigation between notes and tree elements

### 🤖 AI-Powered Learning Tools

#### 1. Flash Cards
- AI-generated flash cards from your notes
- Customizable number of cards
- Difficulty tracking for adaptive learning

#### 2. Quizzes
- Multiple choice and open-ended questions
- AI-generated based on your content
- Detailed feedback and scoring
- Performance tracking for targeted practice

#### 3. Teaching Assistant (Arby)
- Interactive chatbot for knowledge validation
- Learn through teaching
- Real-time feedback and guidance
- Keeps you focused on key concepts

## 🌱 Knowledge Retention
- Visual progress tracking through tree colors
- Automatic degradation over time to encourage review
- At-a-glance understanding of what needs attention
- Forest view for managing multiple study topics

## 🛠️ Built With
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework for building APIs with Python.
- [React (TypeScript)](https://react.dev/) - Frontend library for building user interfaces.
- [MongoDB](https://www.mongodb.com/) - NoSQL database for scalable storage.
- [Vite](https://vitejs.dev/) - Build tool for frontend development.
- [Google Gemini API](https://cloud.google.com/ai) - AI-powered APIs by Google.

## 🚀 Getting Started

Follow these steps to set up and run the project:

### Backend Setup (arbora-be)
1. Navigate to the `arbora-be` directory.
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the `.env` file with your own values for the following keys:
   ```env
   MONGODB_URL=[insert your MongoDB connection URL here]
   JWT_SECRET_KEY=[insert your JWT secret key here]
   JWT_ALGORITHM=HS256
   DB_NAME=[insert your database name here]
   GOOGLE_AI_API_KEY=[insert your Google AI API key here]
   ```
4. Run the backend:
   ```bash
   python app/main.py
   ```

### Frontend Setup (arbora-fe)
1. Navigate to the `arbora-fe` directory.
2. Install the required npm packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 License

This project is open-sourced under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).  
You are free to use, modify, and distribute the project for non-commercial purposes, with appropriate credit.


---
Built for the Google Gemini Competition 2024 with ❤️


