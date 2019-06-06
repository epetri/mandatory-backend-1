import { BehaviorSubject } from "rxjs";

export const user$ = new BehaviorSubject(
  window.localStorage.getItem("user") || null
);

export function updateUser(newUser) {
  if (!newUser) {
    window.localStorage.removeItem("user");
  } else {
    window.localStorage.setItem("user", newUser);
  }

  user$.next(newUser);
}
