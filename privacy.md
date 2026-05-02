# Privacy

This tool stores all data locally in your browser (localStorage). Nothing is sent to any server by default.

What is stored
- Check-ins (date, mood rating, emoji, optional notes).
- Journal entries (date, content).

How you can control your data
- Export: use the "Export Data" button in the History tab to download a JSON file containing all your saved data.
- Clear: use the "Clear All Data" button to permanently delete all locally stored data. This action will ask for confirmation.

Security & privacy notes
- Data is stored unencrypted in localStorage. If you keep sensitive personal notes, consider exporting and storing them securely or using device-level encryption.
- If you share your device or use a shared account, your data will be accessible to others who can access the browser profile.
- The app avoids injecting user-provided HTML into the page to reduce XSS risk. However, treat your journal content as sensitive.

Recommendations
- Regularly export and back up entries you want to keep.
- Clear local data before sharing or selling your device.
- For stronger privacy, you can encrypt exported JSON with a password using third-party tools.

Contact
If you have questions or want additional privacy features (e.g., local encryption), open an issue or a PR in the repository.
