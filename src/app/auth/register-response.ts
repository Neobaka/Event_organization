export interface RegisterResponse {
  accessToken: string;
  user: {
    email: string;
    phoneNumber: string;
    displayName: string;
  };
}
