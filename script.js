// Data structure
let appData = {
    entries: [],
    journalEntries: []
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('mentalHealthData');
    if (saved) {
        appData = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('mentalHealthData', JSON.stringify(appData));
}

// Encouraging messages based on mood
const encouragements = {
    1: [
        "It's okay to not be okay. This feeling is temporary. 💙",
        "You've survived 100% of your worst days. You're stronger than you think.",
        "Consider reaching out to someone you trust. You don't have to do this alone.",
        "Small steps count. Just breathe. You're doing your best.",
        "Your pain is valid, but it doesn't define your future.",
        "This is a moment, not your forever. Better days are coming."
    ],
    2: [
        "You're going through something tough, and that's valid. Be gentle with yourself.",
        "This is a season, not your destiny. Better days are coming.",
        "You've overcome challenges before. You can do it again.",
        "Self-care isn't selfish—it's necessary. Do something kind for yourself today.",
        "It's okay to not be strong all the time. Rest when you need to.",
        "One small step forward is still progress. You're doing better than you think."
    ],
    3: [
        "Neutral days are okay. Rest if you need to. 🌤️",
        "You're keeping it together—that's something to be proud of.",
        "Try one thing today that makes you smile.",
        "You're doing better than you think you are.",
        "This is a good time to practice self-care and prepare for better days.",
        "Stability is a strength. You're holding steady. Well done!"
    ],
    4: [
        "That's wonderful! Hold onto this feeling. 😊",
        "You're radiating positive energy. Keep it up!",
        "Celebrate this moment—you earned it.",
        "This is what resilience looks like. Be proud of yourself.",
        "You're making progress. Notice and appreciate this good feeling.",
        "Your effort is paying off. Keep nurturing what makes you feel good."
    ],
    5: [
        "You're absolutely shining today! Keep being awesome! ✨",
        "This is the energy! Spread it around.",
        "You're crushing it! Remember this feeling on harder days.",
        "You're a source of light. Thank you for being you!",
        "This is what thriving looks like! You deserve this happiness.",
        "You're unstoppable today! Celebrate yourself! 🎉"
    ]
};

// Journaling prompts
const journalPrompts = [
    "What made you smile today?",
    "What are you grateful for right now?",
    "What's something you're proud of today?",
    "How did you take care of yourself today?",
    "What would make tomorrow better?",
    "Who has made a positive impact on your life?",
    "What's something you learned about yourself recently?",
    "What brings you peace?",
    "How are you growing?",
    "What do you need right now?",
    "Describe your ideal day.",
    "What's a challenge you overcame?",
    "What does self-love mean to you?",
    "What are you working towards?",
    "How can you be kind to yourself today?",
    "What's a happy memory you cherish?",
    "What fears are holding you back, and can you face them?",
    "What does success look like for you?",
    "How can you help someone else today?",
    "What's your superpower?"
];

// Self-care tips
const selfCareTips = [
    {
        title: "Take a Break",
        description: "Step away from your screen. Even 5 minutes in nature or solitude can reset your mind."
    },
    {
        title: "Hydrate",
        description: "Drink a glass of water. Sometimes dehydration directly affects mood and energy."
    },
    {
        title: "Breathe Deeply",
        description: "Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8. Repeat 4 times."
    },
    {
        title: "Move Your Body",
        description: "A short walk, stretch, dance, or yoga can release endorphins and lift your mood."
    },
    {
        title: "Connect with Someone",
        description: "Reach out to a friend, family, or loved one. A simple 'how are you?' can change everything."
    },
    {
        title: "Practice Gratitude",
        description: "Write down 3 things you're grateful for, no matter how small. Shifts perspective."
    },
    {
        title: "Meditate or Mindfulness",
        description: "Even 2 minutes of mindfulness can calm your mind. Try an app if you need guidance."
    },
    {
        title: "Play Music",
        description: "Listen to something that lifts your spirits. Sing if you feel like it!"
    },
    {
        title: "Create Something",
        description: "Draw, write, paint, or build. No talent required. Expression is healing."
    },
    {
        title: "Spend Time in Nature",
        description: "Fresh air and sunlight boost mood naturally. Even 10 minutes helps."
    },
    {
        title: "Practice Self-Compassion",
        description: "Talk to yourself like you'd talk to a good friend. You deserve kindness."
    },
    {
        title: "Do Something You Love",
        description: "Whether it's reading, gaming, cooking—do what brings you joy."
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    populateTips();
    displayRandomPrompt();
    updateHistory();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectMood(this);
        });
    });

    // Save mood check-in
    document.getElementById('save-mood-btn').addEventListener('click', saveMoodCheckIn);

    // Journal
    document.getElementById('new-prompt-btn').addEventListener('click', displayRandomPrompt);
    document.getElementById('save-journal-btn').addEventListener('click', saveJournalEntry);
    document.getElementById('clear-journal-btn').addEventListener('click', () => {
        document.getElementById('journal-entry').value = '';
    });

    // Clear data
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Update history when viewing history tab
    if (tabName === 'history') {
        updateHistory();
    }
}

// Mood selection
function selectMood(element) {
    // Remove previous selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select current
    element.classList.add('selected');

    // Show encouragement
    const mood = element.getAttribute('data-mood');
    showEncouragement(mood);
}

// Show encouragement message
function showEncouragement(mood) {
    const messages = encouragements[mood];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    document.getElementById('message-text').textContent = randomMessage;
    document.getElementById('encouragement').classList.remove('hidden');
}

// Save mood check-in
function saveMoodCheckIn() {
    const selectedBtn = document.querySelector('.mood-btn.selected');
    if (!selectedBtn) {
        alert('Please select a mood first!');
        return;
    }

    const mood = selectedBtn.getAttribute('data-mood');
    const emoji = selectedBtn.getAttribute('data-emoji');
    const notes = document.getElementById('mood-notes').value;
    const today = new Date().toLocaleDateString();

    appData.entries.push({
        date: today,
        mood: parseInt(mood),
        emoji: emoji,
        notes: notes,
        timestamp: new Date().getTime()
    });

    saveData();
    alert('✨ Check-in saved! Great job prioritizing your mental health!');
    
    // Reset form
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('mood-notes').value = '';
    document.getElementById('encouragement').classList.add('hidden');
}

// Journal prompt
function displayRandomPrompt() {
    const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    document.getElementById('prompt-text').textContent = `💭 ${prompt}`;
}

// Save journal entry
function saveJournalEntry() {
    const entry = document.getElementById('journal-entry').value;
    
    if (!entry.trim()) {
        alert('Please write something first!');
        return;
    }

    const today = new Date().toLocaleDateString();
    
    appData.journalEntries.push({
        date: today,
        content: entry,
        timestamp: new Date().getTime()
    });

    saveData();
    
    // Show confirmation
    const notification = document.getElementById('journal-saved');
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);

    document.getElementById('journal-entry').value = '';
}

// Populate tips
function populateTips() {
    const container = document.getElementById('tips-container');
    container.innerHTML = '';

    selfCareTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.innerHTML = `
            <h4>${tip.title}</h4>
            <p>${tip.description}</p>
        `;
        container.appendChild(card);
    });
}

// Update history display
function updateHistory() {
    // Today's mood
    const today = new Date().toLocaleDateString();
    const todayEntry = appData.entries.find(e => e.date === today);
    document.getElementById('today-mood').textContent = todayEntry ? todayEntry.emoji : '—';

    // Weekly average
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekEntries = appData.entries.filter(e => new Date(e.date) >= oneWeekAgo);
    const weekAvg = weekEntries.length > 0 
        ? (weekEntries.reduce((sum, e) => sum + e.mood, 0) / weekEntries.length).toFixed(1)
        : '—';
    document.getElementById('week-avg').textContent = weekAvg;

    // Total check-ins
    document.getElementById('total-checkins').textContent = appData.entries.length;

    // Recent entries
    const historyDiv = document.getElementById('history-entries');
    historyDiv.innerHTML = '';

    if (appData.entries.length === 0) {
        historyDiv.innerHTML = '<p style="color: #999; text-align: center;">No check-ins yet. Start tracking today! 🌟</p>';
        return;
    }

    const recent = appData.entries.slice().reverse().slice(0, 10);
    recent.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-entry';
        div.innerHTML = `
            <div class="history-entry-date">${entry.date}</div>
            <div class="history-entry-mood">${entry.emoji}</div>
            ${entry.notes ? `<div class="history-entry-notes">${entry.notes}</div>` : ''}
        `;
        historyDiv.appendChild(div);
    });
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure? This will delete all your data permanently.')) {
        appData = { entries: [], journalEntries: [] };
        saveData();
        updateHistory();
        alert('Data cleared. Starting fresh! 🌱');
    }
}