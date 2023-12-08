export interface UsuarioInterface {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  token: string | null;
  confirmado: boolean;
  isCritic: boolean;
  timestamps: boolean;
  verificarPassword: (password: string) => Promise<boolean>;
}
