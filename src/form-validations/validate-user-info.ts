import type { LoginFormValues } from "@/components/Navbar/LoginOrRegisterForm";
import { emailRegex } from "@/form-validations/customer";
import { isPossiblePhoneNumber } from "react-phone-number-input/min";

type ValidationErrors = Partial<Record<keyof LoginFormValues, string>>;

export function validateUserInfo(values: LoginFormValues): ValidationErrors {
  const { isPhoneInput, customerName, lastName, identifierString } = values;

  const errors: ValidationErrors = {};

  const nameRegex = /^[a-zA-Z\s'-]*$/;

  if (!customerName) {
    errors.customerName = 'First name is required';
  } else if (!nameRegex.test(customerName)) {
    errors.customerName = 'Please enter a valid first name';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required';
  } else if (!nameRegex.test(lastName)) {
    errors.lastName = 'Please enter a valid last name';
  }
  if (!isPhoneInput && !identifierString) {
    errors.identifierString = 'Please enter email address';
  }
  if (!isPhoneInput && identifierString && !emailRegex.test(identifierString)) {
    errors.identifierString = 'Please enter a valid email address';
  }

  if (isPhoneInput && !identifierString) {
    errors.identifierString = 'Please enter a valid phone number';
  }

  if (isPhoneInput && identifierString && !isPossiblePhoneNumber(identifierString)) {
    errors.identifierString = 'Please enter a valid phone number';
  }
  return errors;
}
