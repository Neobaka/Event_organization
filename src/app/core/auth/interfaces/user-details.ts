export interface UserDetails {
  id: number;
  firebaseId: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  role: string;
  favoriteEvents: number[];
  plannedEvents: number[];
  fileName: string;
}
