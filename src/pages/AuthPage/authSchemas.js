import * as yup from "yup";
import { emailRules, nameRules, passwordRules } from "../../utils/validationSchemas";

export const loginSchema = yup.object({
  email: emailRules,
  password: passwordRules,
});

export const registerSchema = yup.object({
  name: nameRules,
  email: emailRules,
  password: passwordRules,
});
