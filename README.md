# Welcome to the Intelligent Resume Analyzer!

This is your personal AI assistant for understanding resumes. Whether you're a recruiter trying to find the perfect candidate or a job seeker wanting to improve your resume, this tool is for you.

---

## Key Features

*   **Analyze Resumes:** Upload a resume and a job description to see how well they match.
*   **Compare Candidates:** Upload two resumes to see a side-by-side comparison.
*   **Deep AI Insights:** Get more than just a score. See strengths, weaknesses, and even a "resume roast" for fun, constructive feedback.
*   **Career Tools:** Predict salary ranges, check for in-demand skills, and get tips to improve.
*   **User Accounts:** Sign up to save and view your past analysis reports.

---

## How to Get Started (for Developers)

If you want to run this project on your own computer, follow these simple steps.

### What You Need

*   You'll need **Node.js** installed on your computer.

### Step-by-Step Guide

1.  **Install the Project Files:**
    Open your computer's terminal or command line and run this command:
    ```bash
    npm install
    ```

2.  **Get Your Google AI Key:**
    The AI features in this app are powered by Google. You need a special key to use them.
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get your free API key.

3.  **Add Your Key to the Project:**
    *   In the main project folder, find the file named `.env`.
    *   Open it and you will see a line that says `GEMINI_API_KEY="YOUR_API_KEY_HERE"`.
    *   Replace `"YOUR_API_KEY_HERE"` with the key you just got from Google.

4.  **Start the App:**
    Now, run this command in your terminal:
    ```bash
    npm run dev
    ```
    Your app will be running at [http://localhost:9002](http://localhost:9002). Open this link in your web browser to see it!

---

## Technology Used

*   **Framework:** Next.js
*   **Artificial Intelligence:** Google Gemini
*   **User Interface:** React, Tailwind CSS, and shadcn/ui
*   **Backend:** Firebase (for user accounts and data storage)
