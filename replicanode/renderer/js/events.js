const listeners = {};

export function on(event, cb) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(cb);
}

export function emit(event, data) {
  if (!listeners[event]) return;
  listeners[event].forEach(cb => cb(data));
}
