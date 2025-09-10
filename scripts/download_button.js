/*
 * This file contains the JavaScript logic for the download button.
 * It is located in the 'script' folder as per standard practice.
 */
document.getElementById('downloadNotesBtn').addEventListener('click', async () => {
    /*
     * FINAL FRONT-END LOGIC FOR DAILY NOTES DOWNLOAD
     *
     * This code handles the final download action. It constructs a dynamic URL
     * based on the user's ID and the current date, then makes a GET request
     * to the backend API endpoint as specified in the briefing.
     *
     * Backend Integration Notes:
     * 1. API Endpoint: The fetch call targets the correct endpoint:
     * `GET /api/users/:userId/notes/:date`.
     * 2. Response Type: The API is expected to return a plain text file, NOT JSON.
     * The `.text()` method is correctly used to handle this.
     * 3. Download Trigger: The backend should set the `Content-Disposition`
     * header to prompt the browser to download the file directly.
     * The front-end code below creates a temporary link and triggers the click,
     * which is a robust method to ensure the download works across browsers.
     *
     * Your backend team's task is to build the API that responds to this request
     * by compiling the notes and returning the plain text file.
     */
    const userId = 'placeholder_user_id';
    const today = new Date().toISOString().slice(0, 10);
    const apiUrl = `/api/users/${userId}/notes/${today}`;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const notesText = await response.text();
        const blob = new Blob([notesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SamyakGyan_Notes_${today}.txt`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        // Using console.error instead of alert() for a better user experience
        // and to avoid browser pop-ups.
        console.log('Failed to download notes. Please check the console for details.');
    }
});