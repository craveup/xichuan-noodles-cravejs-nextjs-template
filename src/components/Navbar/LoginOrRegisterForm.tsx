import React, { useState } from "react";
import type { FormikProps } from "formik";
import InputWithLabel from "@/components/ui/InputWithLabel";
import { PhoneInput } from "@/components/ui/phone-input";
import { formatApiError } from "@/lib/format-api-error";
import { apiPost } from "@/lib/api";
import { setAuthToken } from "@/lib/local-storage";
import { toast } from "sonner";
import LoginOrRegisterOtp, { OTP_LENGTH } from "./LoginOrRegisterOtp";

export type LoginView = "loginView" | "otpView";

export type LoginFormValues = {
  customerName: string;
  lastName: string;
  identifierString: string;
  currentView: LoginView;
  isPhoneInput: boolean;
};

type LoginFormProps = {
  formik: FormikProps<LoginFormValues>;
  isPhoneNumber: boolean;
  onLoginSuccess: () => Promise<void> | void;
  otpMethodId: string;
  handleResendOtp: () => Promise<void>;
  otpLoading: boolean;
  setOtpLoading: (value: boolean) => void;
  children: React.ReactNode;
};

const LoginForm: React.FC<LoginFormProps> = ({
  formik,
  isPhoneNumber,
  onLoginSuccess,
  otpMethodId,
  handleResendOtp,
  otpLoading,
  setOtpLoading,
  children,
}) => {
  const { values, handleSubmit, handleChange, touched, errors, setFieldValue, handleBlur } = formik;
  const [otpValue, setOtpValue] = useState("");

  const verifyOtp = async (submittedOtp: string) => {
    if (submittedOtp.length !== OTP_LENGTH) return;

    if (!otpMethodId) {
      toast.error("Request a verification code first");
      return;
    }

    try {
      setOtpLoading(true);
      const otpResponse = await apiPost<{ token: string }>(`/api/v1/verify-otp`, {
        methodId: otpMethodId,
        otp: submittedOtp,
        identifierString: values.identifierString,
      });
      setAuthToken(otpResponse.token);
      await onLoginSuccess();
      toast.success("Logged in successfully");
    } catch (error) {
      const { message } = formatApiError(error);
      toast.error(message);
    } finally {
      setOtpLoading(false);
      setOtpValue("");
    }
  };

  const handleOtpChange = (nextOtp: string) => {
    setOtpValue(nextOtp);
    if (nextOtp.length === OTP_LENGTH && !otpLoading) {
      void verifyOtp(nextOtp);
    }
  };

  if (values.currentView === "otpView") {
    return (
      <LoginOrRegisterOtp
        otp={otpValue}
        onOtpChange={handleOtpChange}
        loading={otpLoading}
        onResendOtp={handleResendOtp}
        contactLabel={isPhoneNumber ? "phone number" : "email"}
      />
    );
  }

  return (
    <div className='w-full space-y-6'>
      <form id='user-login-dialog' onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InputWithLabel
            placeholder='Enter first name'
            label='First name'
            id='customerName'
            name='customerName'
            type='text'
            onBlur={handleBlur}
            value={values.customerName}
            onChange={handleChange}
            hasError={Boolean(errors.customerName && touched.customerName)}
            helperText={touched.customerName ? errors.customerName : ""}
          />
          <InputWithLabel
            placeholder='Enter last name'
            label='Last name'
            id='lastName'
            name='lastName'
            type='text'
            onBlur={handleBlur}
            value={values.lastName}
            onChange={handleChange}
            hasError={Boolean(errors.lastName && touched.lastName)}
            helperText={touched.lastName ? errors.lastName : ""}
          />
        </div>
        {isPhoneNumber ? (
          <div>
            <PhoneInput
              label='Phone Number'
              name='identifierString'
              value={values.identifierString}
              onChange={(value) => setFieldValue("identifierString", value ?? "")}
            />
            {errors.identifierString && touched.identifierString && (
              <p className='mt-2 text-xs text-destructive'>{errors.identifierString}</p>
            )}
          </div>
        ) : (
          <InputWithLabel
            label='Email'
            placeholder='Enter email'
            id='identifierString'
            name='identifierString'
            type='email'
            onBlur={handleBlur}
            value={values.identifierString}
            onChange={handleChange}
            hasError={Boolean(errors.identifierString && touched.identifierString)}
            helperText={touched.identifierString ? errors.identifierString : ""}
          />
        )}
      </form>

      <p className='text-xs text-muted-foreground'>
        To verify your account, we will send a one-time password (OTP) to the {isPhoneNumber ? "phone number" : "email"} you provide. By continuing, you consent to receiving this OTP via {isPhoneNumber ? "SMS" : "email"}.
      </p>

      {children}
    </div>
  );
};

export default LoginForm;
