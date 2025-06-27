export interface User {
    email: string;
    full_name?: string;
    age?: number;
}

export interface QrPayload {
    email_enc: string;
    iv: string;
    tag: string;
    issued_at: string;
    sig: string;
}

export type UserRole = 'admin' | 'participant' | null;

export interface AuthContextType {
  loggedIn: boolean;
  roles: UserRole[] | null;
  idToken: string | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  completeNewPassword: (newPassword: string) => Promise<void>;
}

export interface UserState {
  loggedIn: boolean;
  roles: UserRole[] | null;
  idToken: string | null;
  accessToken: string | null;
}
