let currentNote = null;
API_URL = 'http://localhost:3000/api'

// Auth Functions
function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username,email,password })
        });

        if (!response.ok) throw new Error('Registration failed');

        const data = await response.json();
        localStorage.setItem('token', data.token);
        storeUsername(username);
        showApp();
    } catch (error) {
        alert(error.message);
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        localStorage.setItem('token', data.token);

        showApp();
        showWelcomePopup();
    } catch (error) {
        alert(error.message);
    }
}

function showWelcomePopup() {
    const popup = document.getElementById('welcome-popup');
    const message = popup.querySelector('p');
    message.textContent = `Welcome! Thank you for logging in. Start creating your notes!`;
    popup.classList.remove('hidden');
}

function closeWelcomePopup() {
    const popup = document.getElementById('welcome-popup');
    popup.classList.add('hidden');
}

function logout() {
    localStorage.removeItem('token');
    showAuth();
}

// Keep track of current section
let currentSection = 'dashboard';

// Sidebar navigation
function initSidebar() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show the corresponding section
            const sectionName = item.getAttribute('data-section');
            switchSection(sectionName);
        });
    });
}

function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show selected section
    const activeSection = document.getElementById(`${sectionName}-section`);
    activeSection.classList.remove('hidden');
    
    // Update title
    document.getElementById('section-title').textContent = 
        sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    
    // Update current section tracker
    currentSection = sectionName;
}

// Note Functions
async function fetchNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch notes');

        const notes = await response.json();
        displayNotes(notes);
        return notes;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

function displayNotes(notes) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editNote('${note._id}', '${note.title}', '${note.content}')">
                    Edit
                </button>
                <button class="delete-btn" onclick="deleteNote('${note._id}')">
                    Delete
                </button>
            </div>
        `;
        notesList.appendChild(noteCard);
    });
}

async function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }

    try {
        const url = currentNote 
            ? `${API_URL}/notes/${currentNote}`
            : `${API_URL}/notes`;
        
        const method = currentNote ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) throw new Error('Failed to save note');

        clearNoteForm();
        fetchNotes();
    } catch (error) {
        alert(error.message);
    }
}

function editNote(id, title, content) {
    currentNote = id;
    document.getElementById('note-title').value = title;
    document.getElementById('note-content').value = content;
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete note');

        fetchNotes();
    } catch (error) {
        alert(error.message);
    }
}

function clearNoteForm() {
    currentNote = null;
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
}

// UI Functions
function showAuth() {
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('app-container').classList.add('hidden');
}

function showApp() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    fetchNotes();

    const username = localStorage.getItem('username');
    document.getElementById('username-display').textContent = username;
    document.getElementById('settings-username').value = username;

    // Initialize sidebar
    initSidebar();
    
    // Load notes
    fetchNotes();
    
    // Update dashboard stats
    updateDashboardStats();
}

function storeUsername(username) {
    localStorage.setItem('username', username);
}

// Add dashboard stats functionality
function updateDashboardStats() {
    fetchNotes()
        .then(notes => {
            if (!notes) return;
            
            // Update total count
            document.getElementById('total-notes').textContent = notes.length;
            
            // Find last updated note
            if (notes.length > 0) {
                // Sort by updatedAt
                notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                const lastUpdated = new Date(notes[0].updatedAt);
                document.getElementById('last-updated').textContent = 
                    lastUpdated.toLocaleString();
                
                // Show recent notes (up to 3)
                const recentNotesContainer = document.getElementById('recent-notes-list');
                recentNotesContainer.innerHTML = '';
                
                const recentNotes = notes.slice(0, 3);
                recentNotes.forEach(note => {
                    const noteEl = document.createElement('div');
                    noteEl.className = 'note-card';
                    noteEl.innerHTML = `
                        <h3>${note.title}</h3>
                        <p>${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="editNoteAndSwitch('${note._id}', '${note.title}', '${note.content}')">
                                Edit
                            </button>
                        </div>
                    `;
                    recentNotesContainer.appendChild(noteEl);
                });
            }
        });
}

// Function to edit a note and switch to notes section
function editNoteAndSwitch(id, title, content) {
    // Switch to notes section
    switchSection('notes');
    
    // Update sidebar active state
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="notes"]').classList.add('active');
    
    // Set form for editing
    editNote(id, title, content);
}

// Initialize app
function init() {
    const token = localStorage.getItem('token');
    if (token) {
        showApp();
    } else {
        showAuth();
    }
}

init();