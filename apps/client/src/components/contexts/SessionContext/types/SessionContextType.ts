export interface SessionContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}
