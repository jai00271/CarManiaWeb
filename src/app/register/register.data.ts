export class Register {
  password: string;
  username: string;
  email: string;
  emailVerified: true
}

export class RegisterResponse {
  id: true;
  username: string;
  email: string;
  emailVerified: string;
}
