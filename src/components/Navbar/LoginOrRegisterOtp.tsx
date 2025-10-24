import React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/LoadingButton";

export const OTP_LENGTH = 6;

type LoginOrRegisterOtpProps = {
  otp: string;
  onOtpChange: (value: string) => void;
  loading: boolean;
  onResendOtp: () => Promise<void>;
  contactLabel: string;
};

const LoginOrRegisterOtp: React.FC<LoginOrRegisterOtpProps> = ({
  otp,
  onOtpChange,
  loading,
  onResendOtp,
  contactLabel,
}) => {
  return (
    <div className='w-full space-y-8'>
      <div className='flex justify-center'>
        <InputOTP
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={onOtpChange}
          disabled={loading}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <ul className='space-y-2 rounded-md bg-muted/40 p-4 text-muted-foreground'>
        <li className='text-xs'>We will send order updates to your {contactLabel}.</li>
        <li className='text-xs'>You can manage communication preferences in account settings.</li>
      </ul>

      <div className='flex flex-col items-center justify-center space-y-2'>
        <p className='text-base'>Didn&apos;t get the code?</p>
        <LoadingButton
          type='button'
          variant='ghost'
          disabled={loading}
          loading={loading}
          onClick={() => void onResendOtp()}
          className='underline'
        >
          Resend OTP
        </LoadingButton>
      </div>
    </div>
  );
};

export default LoginOrRegisterOtp;
