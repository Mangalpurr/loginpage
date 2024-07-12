// Initialize the Google Sheets API
function initialize() {
    gapi.load('client', start);
}

async function start() {
    try {
        await gapi.client.init({
            'apiKey': 'AIzaSyAlCn5IlE1tsZyL83EnuXOjp4x07rRfeHM',
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        // Load initial messages from Google Sheets
        loadMessages();
    } catch (error) {
        console.error('Failed to initialize Google Sheets API:', error);
    }
}

// Load messages from Google Sheets
async function loadMessages() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1JdLKn2bTfoGEo8yyJpiwazLSSX8viq82FsBV6pbD5_E',
            range: 'Messages!A:B',
        });
        const messages = response.result.values || [];
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages from Google Sheets:', error);
    }
}

// Display messages on the message board
function displayMessages(messages) {
    const messageBoard = document.getElementById('message-board');
    messageBoard.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${message[0]} (${message[1]})`;
        messageBoard.appendChild(messageElement);
    });
}

// Send a new message
async function sendMessage() {
    const messageInput = document.getElementById('message-input').value.trim();
    if (messageInput === '') return;

    const timestamp = new Date().toLocaleString();
    const message = [messageInput, timestamp];

    try {
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1JdLKn2bTfoGEo8yyJpiwazLSSX8viq82FsBV6pbD5_E',
            range: 'Messages!A:B',
            valueInputOption: 'RAW',
            resource: {
                values: [message]
            }
        });
        // Update the message board
        loadMessages();
        // Clear the input field
        document.getElementById('message-input').value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Load the Google Sheets API on page load
initialize();
