# Welcome to the Intelligent Resume Analyzer!

This app is your personal AI assistant for understanding resumes. Whether you're a recruiter looking for the perfect candidate or a job seeker aiming to improve your resume, this tool is for you.

---

## What Can It Do?

*   **Analyze Resumes:** Upload a resume and a job description to see how well they match.
*   **Compare Two Candidates:** Upload two resumes to get a side-by-side comparison.
*   **Get Deep AI Insights:** Go beyond simple scores. Discover strengths, weaknesses, and even get a fun "resume roast" for constructive feedback.
*   **Explore Career Tools:** Predict salary ranges, check for in-demand skills, and get personalized tips for improvement.
*   **Save Your Work:** Sign up for a free account to save and review your analysis reports anytime.

---

## How to Run This App on Your Computer (for Developers)

This guide will walk you through setting up and running the project on your own machine.

### Before You Start: What You Need

*   **Node.js:** Make sure you have Node.js installed on your computer. This is what runs the application.

### Step 1: Install the Project Files

First, you need to download all the project's code packages.

*   Open your computer's **terminal** (also known as a command line or command prompt).
*   Run this command:
    ```bash
    npm install
    ```

### Step 2: Get Your Free Google AI API Key

The AI features in this app are powered by Google Gemini. To use them, you need a personal (and free) API key.

*   **What's an API Key?** Think of it as a password that gives you access to Google's AI services.
*   **Why do I need my own?** For security, every developer must use their own key. It's unique to you and must be kept secret. This also ensures you have your own usage quota. The process to get one is quick and free.

*   **Get your key here:**
    *   Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
    *   Follow the simple steps to create and copy your new API key.

### Step 3: Add Your API Key to the Project

Now, you need to tell the project what your API key is.

*   In the main project folder, find the file named **`.env`**.
*   Open it and you will see this line: `GEMINI_API_KEY="YOUR_API_KEY_HERE"`
*   Replace `"YOUR_API_KEY_HERE"` with the unique key you just got from Google.
    *   For example: `GEMINI_API_KEY="AIzaSy...your...key...here..."`

### Step 4: Start the App!

You're all set! To start the application, run this command in your terminal:

```bash
npm run dev
```

Your app will now be running at **[http://localhost:9002](http://localhost:9002)**. Open this link in your web browser to see it in action.

---

## Technology We Use

*   **Framework:** Next.js
*   **Artificial Intelligence:** Google Gemini
*   **User Interface:** React, Tailwind CSS, and shadcn/ui
*   **Backend:** Firebase (for user accounts and data storage)
