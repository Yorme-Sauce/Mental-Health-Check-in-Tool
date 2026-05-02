// Data structure
let appData = {
    entries: [],
    journalEntries: []
};

// Load data from localStorage (safe parse)
function loadData() {
    try {
        const saved = localStorage.getItem('mentalHealthData');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                appData = {
                    entries: Array.isArray(parsed.entries) ? parsed.entries : [],
                    journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : []
                };
            }
        }
    } catch (err) {
        console.error('Failed to load saved data:', err);
        appData = { entries: [], journalEntries: [] };
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('mentalHealthData', JSON.stringify(appData));
    } catch (err) {
        console.error('Failed to save data:', err);
    }
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
    { title: "Take a Break", description: "Step away from your screen. Even 5 minutes in nature or solitude can reset your mind." },
    { title: "Hydrate", description: "Drink a glass of water. Sometimes dehydration directly affects mood and energy." },
    { title: "Breathe Deeply", description: "Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8. Repeat 4 times." },
    { title: "Move Your Body", description: "A short walk, stretch, dance, or yoga can release endorphins and lift your mood." },
    { title: "Connect with Someone", description: "Reach out to a friend, family, or loved one. A simple 'how are you?' can change everything." },
    { title: "Practice Gratitude", description: "Write down 3 things you're grateful for, no matter how small. Shifts perspective." },
    { title: "Meditate or Mindfulness", description: "Even 2 minutes of mindfulness can calm your mind. Try an app if you need guidance." },
    { title: "Play Music", description: "Listen to something that lifts your spirits. Sing if you feel like it!" },
    { title: "Create Something", description: "Draw, write, paint, or build. No talent required. Expression is healing." },
    { title: "Spend Time in Nature", description: "Fresh air and sunlight boost mood naturally. Even 10 minutes helps." },
    { title: "Practice Self-Compassion", description: "Talk to yourself like you'd talk to a good friend. You deserve kindness." },
    { title: "Do Something You Love", description: "Whether it's reading, gaming, cooking—do what brings you joy." }
];

// Utilities
function todayIsoDate() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

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
    // Tabs: click and keyboard
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    tabButtons.forEach((btn, idx) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
        btn.addEventListener('keydown', (e) => {
            const key = e.key;
            let newIndex = idx;
            if (key === 'ArrowRight' || key === 'ArrowDown') newIndex = (idx + 1) % tabButtons.length;
            else if (key === 'ArrowLeft' || key === 'ArrowUp') newIndex = (idx - 1 + tabButtons.length) % tabButtons.length;
            else if (key === 'Home') newIndex = 0;
            else if (key === 'End') newIndex = tabButtons.length - 1;
            else return;

            e.preventDefault();
            const targetBtn = tabButtons[newIndex];
            targetBtn.focus();
            switchTab(targetBtn.dataset.tab, targetBtn);
        });
    });

    // Mood radios change -> show encouragement
    document.querySelectorAll('.mood-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const value = e.target.value;
            showEncouragement(value);
        });
    });

    // Mood form submit
    const moodForm = document.getElementById('mood-form');
    if (moodForm) {
        moodForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveMoodCheckIn();
        });
    }

    // Journal
    const newPromptBtn = document.getElementById('new-prompt-btn');
    if (newPromptBtn) newPromptBtn.addEventListener('click', displayRandomPrompt);
    const saveJournalBtn = document.getElementById('save-journal-btn');
    if (saveJournalBtn) saveJournalBtn.addEventListener('click', saveJournalEntry);
    const clearJournalBtn = document.getElementById('clear-journal-btn');
    if (clearJournalBtn) clearJournalBtn.addEventListener('click', () => {
        const je = document.getElementById('journal-entry');
        if (je) je.value = '';
    });

    // Export & Clear data
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllData);
}

// Tab switching (manages ARIA and hidden)
function switchTab(tabName, buttonElement) {
    const panels = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        const selected = btn.dataset.tab === tabName;
        btn.classList.toggle('active', selected);
        btn.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (selected) btn.focus();
    });

    panels.forEach(panel => {
        const isTarget = panel.id === tabName;
        panel.classList.toggle('active', isTarget);
        if (isTarget) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
    });

    if (tabName === 'history') updateHistory();
}

// Show encouragement message
function showEncouragement(mood) {
    const messages = encouragements[mood];
    if (!messages || messages.length === 0) return;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const messageEl = document.getElementById('message-text');
    if (messageEl) messageEl.textContent = randomMessage;
    const container = document.getElementById('encouragement');
    if (container) container.classList.remove('hidden');
}

// Save mood check-in
function saveMoodCheckIn() {
    const selectedInput = document.querySelector('input[name="mood"]:checked');
    const notesEl = document.getElementById('mood-notes');
    if (!selectedInput) {
        // Accessible alert
        alert('Please select a mood first!');
        return;
    }

    const mood = parseInt(selectedInput.value, 10);
    // Find emoji from the label's .emoji
    let emoji = '';
    const label = selectedInput.closest('label');
    if (label) {
        const emojiEl = label.querySelector('.emoji');
        if (emojiEl) emoji = emojiEl.textContent.trim();
    }

    const notes = notesEl ? notesEl.value : '';
    const timestamp = Date.now();
    const date = todayIsoDate();

    appData.entries.push({
        date,
        mood,
        emoji,
        notes,
        timestamp
    });

    saveData();

    // Confirmation
    alert('✨ Check-in saved! Great job prioritizing your mental health!');

    // Reset form
    if (notesEl) notesEl.value = '';
    const encouragement = document.getElementById('encouragement');
    if (encouragement) encouragement.classList.add('hidden');
    // uncheck radios
    document.querySelectorAll('input[name="mood"]').forEach(i => i.checked = false);

    updateHistory();
}

// Journal prompt
function displayRandomPrompt() {
    const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    const pt = document.getElementById('prompt-text');
    if (pt) pt.textContent = `💭 ${prompt}`;
}

// Save journal entry
function saveJournalEntry() {
    const entryEl = document.getElementById('journal-entry');
    if (!entryEl) return;
    const entry = entryEl.value.trim();
    if (!entry) {
        alert('Please write something first!');
        return;
    }

    const timestamp = Date.now();
    const date = todayIsoDate();

    appData.journalEntries.push({ date, content: entry, timestamp });
    saveData();

    // Show confirmation (aria-live handled in HTML)
    const notification = document.getElementById('journal-saved');
    if (notification) {
        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.add('hidden'), 3000);
    }

    entryEl.value = '';
}

// Populate tips (avoid innerHTML)
function populateTips() {
    const container = document.getElementById('tips-container');
    if (!container) return;
    container.textContent = '';

    selfCareTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        const h4 = document.createElement('h4');
        h4.textContent = tip.title;
        const p = document.createElement('p');
        p.textContent = tip.description;
        card.appendChild(h4);
        card.appendChild(p);
        container.appendChild(card);
    });
}

// Update history display
function updateHistory() {
    // Today's mood
    const today = todayIsoDate();
    const todayEntry = appData.entries.slice().reverse().find(e => e.date === today);
    const todayMoodEl = document.getElementById('today-mood');
    if (todayMoodEl) todayMoodEl.textContent = todayEntry ? todayEntry.emoji : '—';

    // Weekly average (last 7 days by timestamp)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekEntries = appData.entries.filter(e => e.timestamp && e.timestamp >= oneWeekAgo);
    const weekAvg = weekEntries.length > 0
        ? (weekEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / weekEntries.length).toFixed(1)
        : '—';
    const weekAvgEl = document.getElementById('week-avg');
    if (weekAvgEl) weekAvgEl.textContent = weekAvg;

    // Total check-ins
    const totalEl = document.getElementById('total-checkins');
    if (totalEl) totalEl.textContent = String(appData.entries.length || 0);

    // Recent entries
    const historyDiv = document.getElementById('history-entries');
    if (!historyDiv) return;
    historyDiv.textContent = '';

    if (appData.entries.length === 0) {
        const p = document.createElement('p');
        p.style.color = '#999';
        p.style.textAlign = 'center';
        p.textContent = 'No check-ins yet. Start tracking today! 🌟';
        historyDiv.appendChild(p);
        return;
    }

    const recent = appData.entries.slice().reverse().slice(0, 10);
    recent.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-entry';

        const dateDiv = document.createElement('div');
        dateDiv.className = 'history-entry-date';
        dateDiv.textContent = entry.date;

        const moodDiv = document.createElement('div');
        moodDiv.className = 'history-entry-mood';
        moodDiv.textContent = entry.emoji || '';

        div.appendChild(dateDiv);
        div.appendChild(moodDiv);

        if (entry.notes) {
            const notesDiv = document.createElement('div');
            notesDiv.className = 'history-entry-notes';
            notesDiv.textContent = entry.notes;
            div.appendChild(notesDiv);
        }

        historyDiv.appendChild(div);
    });
}

// Export data as JSON file
function exportData() {
    try {
        const dataStr = JSON.stringify(appData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mental-health-data-${todayIsoDate()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to export data:', err);
        alert('Failed to export data. See console for details.');
    }
}

// Clear all data
function clearAllData() {
    const confirmed = confirm('Are you sure? This will delete all your data permanently.');
    if (!confirmed) return;

    appData = { entries: [], journalEntries: [] };
    saveData();
    updateHistory();
    alert('Data cleared. Starting fresh! 🌱');
}
