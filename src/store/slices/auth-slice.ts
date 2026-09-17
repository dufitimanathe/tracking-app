import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/types";
import { company, currentUser, riderUser, supervisorUser } from "@/data/mock";

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  userId: string;
  userName: string;
  userEmail: string;
  avatarInitials: string;
  companyId: string;
  companyName: string;
  companyInitials: string;
}

const initialState: AuthState = {
  isAuthenticated: true,
  role: "COMPANY_ADMIN",
  userId: currentUser.id,
  userName: currentUser.name,
  userEmail: currentUser.email,
  avatarInitials: currentUser.avatarInitials,
  companyId: company.id,
  companyName: company.name,
  companyInitials: company.logoInitials,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
      if (action.payload === "SUPERVISOR") {
        state.userId = supervisorUser.id;
        state.userName = supervisorUser.name;
        state.userEmail = supervisorUser.email;
        state.avatarInitials = supervisorUser.avatarInitials;
      } else if (action.payload === "RIDER") {
        state.userId = riderUser.id;
        state.userName = riderUser.name;
        state.userEmail = riderUser.email;
        state.avatarInitials = riderUser.avatarInitials;
      } else {
        state.userId = currentUser.id;
        state.userName = currentUser.name;
        state.userEmail = currentUser.email;
        state.avatarInitials = currentUser.avatarInitials;
      }
    },
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { setRole, login, logout } = authSlice.actions;
export default authSlice.reducer;
