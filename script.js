class PomodoroTimer {
    constructor() {
        this.workDuration = 25 * 60; // 25 minutes
        this.breakDuration = 5 * 60; // 5 minutes
        this.timeLeft = this.workDuration;
        this.isRunning = false;
        this.currentMode = 'work';
        this.pomodoroCount = 0;
        this.interval = null;

        this.initElements();
        this.attachEventListeners();
        this.updateDisplay();
    }

    initElements() {
        this.minutesEl = document.getElementById('minutes');
        this.secondsEl = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.pomodoroCountEl = document.getElementById('pomodoroCount');
        this.sessionModeEl = document.getElementById('sessionMode');
        this.modeBtns = document.querySelectorAll('.mode-btn');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.modeBtns.forEach(btn => btn.disabled = true);

        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.modeBtns.forEach(btn => btn.disabled = false);
    }

    reset() {
        this.pause();
        this.timeLeft = this.currentMode === 'work' ? this.workDuration : this.breakDuration;
        this.updateDisplay();
    }

    switchMode(mode) {
        if (this.isRunning) return;

        this.currentMode = mode;
        this.timeLeft = mode === 'work' ? this.workDuration : this.breakDuration;
        this.updateDisplay();

        // Update active button
        this.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update session mode text
        this.sessionModeEl.textContent = mode === 'work' ? 'Работа' : 'Перерыв';
    }

    complete() {
        clearInterval(this.interval);
        this.isRunning = false;

        if (this.currentMode === 'work') {
            this.pomodoroCount++;
            this.pomodoroCountEl.textContent = this.pomodoroCount;
            this.showNotification('Поздравляем! Работа завершена.', 'Пора на перерыв!');
            this.switchMode('break');
        } else {
            this.showNotification('Перерыв закончился!', 'Готовы к новой сессии?');
            this.switchMode('work');
        }

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.modeBtns.forEach(btn => btn.disabled = false);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        this.minutesEl.textContent = String(minutes).padStart(2, '0');
        this.secondsEl.textContent = String(seconds).padStart(2, '0');

        // Update page title
        document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - Pomodoro`;
    }

    showNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '🍅'
            });
        } else if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '🍅'
                    });
                }
            });
        }

        // Also play a simple alert
        alert(`${title}\n${message}`);
    }
}

// Initialize the timer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});