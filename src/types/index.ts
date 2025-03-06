import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtpayload extends JwtPayload {
  id?: string;
  role?: string;

  // Other info
  email?: string;
  name?: string;
}
