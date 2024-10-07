// Function to convert the datetime string using the user's timezone offset
function convertAndAddTime(dateString, timezoneOffset) {
    let date = new Date(dateString);
    let offsetInMs = timezoneOffset * 60 * 60 * 1000;
    date.setTime(date.getTime() + offsetInMs);

    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Convert time to Persian/Arabic numerals
    return toPersianNumerals(`${hours}:${minutes}`);
}

// Helper function to convert English numbers to Persian/Arabic numerals
function toPersianNumerals(numberString) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return numberString.replace(/\d/g, digit => persianDigits[digit]);
}

// Function to update all <time> elements on the page
function updateTimeTags(timezoneOffset) {
    const timeElements = document.querySelectorAll('time');
    timeElements.forEach(timeElement => {
        const datetimeValue = timeElement.getAttribute('datetime');
        if (datetimeValue) {
            const newTime = convertAndAddTime(datetimeValue, timezoneOffset);
            timeElement.innerText = newTime;
        }
    });
}

// Function to get user's timezone offset
function getUserTimezoneOffset() {
    const now = new Date();
    return -now.getTimezoneOffset() / 60; // Returns offset in hours
}

// Function to fetch live content from the original website
async function fetchLiveContent() {
    try {
        const response = await fetch('https://www.iranintl.com'); // URL to fetch the live content
        const html = await response.text();

        // Parse the HTML to extract the content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newFrame = doc.querySelector('.frame');

        // Replace the current frame with the fetched content
        const currentFrame = document.querySelector('.frame');
        if (currentFrame && newFrame) {
            currentFrame.innerHTML = newFrame.innerHTML;

            // Adjust time tags for the new content
            const timezoneOffset = getUserTimezoneOffset();
            updateTimeTags(timezoneOffset);
        }
    } catch (error) {
        console.error('Failed to fetch live content:', error);
    }
}

// Set an interval to fetch live content every 15 minutes
setInterval(fetchLiveContent, 60 * 1000);

// Fetch and update content immediately on page load
fetchLiveContent();
