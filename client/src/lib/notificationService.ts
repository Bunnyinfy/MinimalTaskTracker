class NotificationService {
  private static instance: NotificationService;
  private checkInterval: number | null = null;
  private notifications: Map<number, NodeJS.Timeout> = new Map();

  private constructor() {
    // Private constructor to enforce singleton
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  scheduleNotification(task: Task) {
    if (!task.deadline || !task.reminderMinutes || task.completed) return;

    const deadlineDate = new Date(task.deadline);
    const reminderTime = new Date(deadlineDate.getTime() - task.reminderMinutes * 60000);
    const now = new Date();

    if (reminderTime <= now) return;

    // Clear any existing notification for this task
    this.clearNotification(task.id);

    // Schedule new notification
    const timeout = setTimeout(() => {
      this.showNotification(task);
    }, reminderTime.getTime() - now.getTime());

    this.notifications.set(task.id, timeout);
  }

  private showNotification(task: Task) {
    if (Notification.permission === "granted") {
      const notification = new Notification("Task Reminder", {
        body: `Reminder: "${task.title}" is due in ${task.reminderMinutes} minutes`,
        icon: "/favicon.ico",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  clearNotification(taskId: number) {
    const timeout = this.notifications.get(taskId);
    if (timeout) {
      clearTimeout(timeout);
      this.notifications.delete(taskId);
    }
  }

  startCheckingDeadlines(tasks: Task[]) {
    // Clear any existing interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Set up new interval to check and schedule notifications
    this.checkInterval = setInterval(() => {
      tasks.forEach(task => this.scheduleNotification(task));
    }, 60000); // Check every minute
  }

  stopCheckingDeadlines() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // Clear all scheduled notifications
    for (const [taskId, timeout] of this.notifications) {
      clearTimeout(timeout);
    }
    this.notifications.clear();
  }
}

export const notificationService = NotificationService.getInstance();
