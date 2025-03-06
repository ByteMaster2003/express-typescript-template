import z from "zod";

import { validatePassword } from "./custom.validation";

const register = {
  body: z.object({
    fullname: z.string({
      required_error: "fullname is required!"
    }),
    email: z
      .string({
        required_error: "email is required!"
      })
      .email({
        message: "Invalid email address!"
      }),
    mobileNumber: z
      .string({
        required_error: "mobile number is required!"
      })
      .regex(/^\+91\s[6-9]\d{9}$/, {
        message: "Invalid mobile number"
      }),
    password: z
      .string({
        required_error: "password is required!"
      })
      .refine(validatePassword, {
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      })
  })
};

const login = {
  body: z.object({
    email: z
      .string({
        required_error: "email is required!"
      })
      .email({
        message: "Invalid email address"
      }),
    password: z.string({
      required_error: "password is required!"
    })
  })
};

const forgot_password = {
  body: z.object({
    email: z
      .string({
        required_error: "email is required!"
      })
      .email({
        message: "Invalid email address"
      })
  })
};

const reset_password = {
  body: z.object({
    email: z
      .string({
        required_error: "email is required!"
      })
      .email({
        message: "Invalid email address"
      }),
    password: z
      .string({
        required_error: "password is required!"
      })
      .refine(validatePassword, {
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      }),
    otp: z
      .string({
        required_error: "otp is required!"
      })
      .regex(/\d{4}/, { message: "Invalid OTP" })
  })
};

export default { register, login, forgot_password, reset_password };
