type Listener = (...args: any[]) => void;

class SimpleEventBus {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback,
    );
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb(...args));
  }
}

const eventBus = new SimpleEventBus();

export default eventBus;
