import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { getAuth } from "firebase/auth";
import { SnackService } from '../services/snack.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const isLoggedIn = !!user;

  const service = inject(SnackService);
  if (!isLoggedIn) {
    service.authError();
  }
  return isLoggedIn;
};
