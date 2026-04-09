// src/leaderboard.js

/**
 * Leaderboard management class.
 * Currently uses localStorage for persistence, designed to be swapped 
 * for a real backend (Firebase/Supabase/Stitch) easily.
 */
class Leaderboard {
    constructor() {
        this.storageKey = 'stellar_guardian_scores';
        this.scores = this.loadLocal();
    }

    loadLocal() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load leaderboard from storage", e);
            return [];
        }
    }

    saveLocal() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (e) {
            console.error("Failed to save leaderboard to storage", e);
        }
    }

    /**
     * Submit a new score to the leaderboard.
     * @param {string} name - Player name
     * @param {number} score - Achievement score
     */
    async submitScore(name, score) {
        if (!name || name.trim() === "") name = "RECRUIT";
        
        const entry = { 
            name: name.toUpperCase(), 
            score: score, 
            timestamp: Date.now() 
        };

        this.scores.push(entry);
        
        // Sort descending and keep top 10
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, 10);
        
        this.saveLocal();

        // Simulator for external Cloud sync (e.g. Stitch)
        this.syncWithCloud(entry);
        
        return true;
    }

    /**
     * Retrieves the top 10 scores.
     * @returns {Promise<Array>} List of score objects.
     */
    async getTopScores() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.scores);
            }, 300); // Simulate network latency
        });
    }

    async syncWithCloud(entry) {
        // Placeholder for Stitch/Firebase sync
        console.log("Syncing score to cloud...", entry);
    }
}

export const leaderboard = new Leaderboard();
