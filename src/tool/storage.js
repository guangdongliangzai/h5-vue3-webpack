const EMPTY_TYPE = {
  String: "",
  Array: [],
  Object: {},
};
export function setSession(name, value) {
  let v = value ? JSON.stringify(value) : "";
  if (typeof value === "string") {
    v = value;
  }
  sessionStorage.setItem(name, v);
}

export function getSession(name) {
  let v = sessionStorage.getItem(name);
  try {
    return JSON.parse(v);
  } catch (e) {
    return v;
  }
}

export function delSession(name) {
  sessionStorage.removeItem(name);
}

export function setLocal(name, value) {
  let v = value ? JSON.stringify(value) : "";
  if (typeof value === "string") {
    v = value;
  }
  localStorage.setItem(name, v);
}

export function getLocal(name, type = "Object") {
  let v = localStorage.getItem(name);
  try {
    return v ? JSON.parse(v) : EMPTY_TYPE[type];
  } catch (e) {
    return v;
  }
}

export function delLocal(name) {
  localStorage.removeItem(name);
}
