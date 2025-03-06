import { CustomJwtpayload } from "@/types";

// to make the file a module and avoid the TypeScript error
export {};

declare module "http" {
  interface IncomingMessage {
    auth: CustomJwtpayload;
  }
}
