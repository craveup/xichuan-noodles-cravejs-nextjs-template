import React, { useCallback, useState } from "react";
import { useFormik } from "formik";
import LoginForm, { LoginFormValues } from "@/components/Navbar/LoginOrRegisterForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatApiError } from "@/lib/format-api-error";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { validateUserInfo } from "@/form-validations/validate-user-info";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { LoadingButton } from "@/components/ui/LoadingButton";

const initialValues: LoginFormValues = {
  customerName: "",
  lastName: "",
  identifierString: "",
  currentView: "loginView",
  isPhoneInput: false,
};

const UserNotLoggedIn = ({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [otpMethodId, setOtpMethodId] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const [identifierPreview, setIdentifierPreview] = useState<string>("");

  const loginFormik = useFormik<LoginFormValues>({
    validate: validateUserInfo,
    initialValues,
    onSubmit: async (formValues, { setSubmitting, setFieldValue }) => {
      try {
        const response = await apiPost<{ methodId: string }>(`/api/v1/login-customer`, {
          customerName: formValues.customerName,
          lastName: formValues.lastName,
          identifierString: formValues.identifierString,
        });

        setOtpMethodId(response.methodId);
        setIdentifierPreview(formValues.identifierString);
        setFieldValue("currentView", "otpView");
      } catch (error) {
        const { message } = formatApiError(error);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { isPhoneInput, currentView } = loginFormik.values;
  const isLoginView = currentView === "loginView";

  const handleResendOtp = useCallback(async () => {
    if (!loginFormik.values.identifierString) {
      toast.error("Enter your contact information first");
      return;
    }

    try {
      setOtpLoading(true);
      const response = await apiPost<{ methodId: string }>(`/api/v1/login-customer`, {
        customerName: loginFormik.values.customerName,
        lastName: loginFormik.values.lastName,
        identifierString: loginFormik.values.identifierString,
      });

      setOtpMethodId(response.methodId);
      setIdentifierPreview(loginFormik.values.identifierString);
      toast.success("OTP sent successfully");
    } catch (error) {
      const { message } = formatApiError(error);
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  }, [
    loginFormik.values.customerName,
    loginFormik.values.lastName,
    loginFormik.values.identifierString,
    setOtpLoading,
    setOtpMethodId,
    setIdentifierPreview,
  ]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setOtpMethodId(null);
    setOtpLoading(false);
    setIdentifierPreview("");
    loginFormik.setSubmitting(false);
    loginFormik.resetForm();
  }, [loginFormik, setOtpMethodId, setOtpLoading, setIdentifierPreview]);

  const handleAuthSuccess = useCallback(async () => {
    onLoginSuccess();
    closeDialog();
  }, [closeDialog, onLoginSuccess]);

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeDialog();
    } else {
      setIsOpen(true);
    }
  };

  const dialogTitle = isLoginView
    ? `Enter your details and ${isPhoneInput ? "phone number" : "email address"}`
    : "Enter verification code";

  const dialogDescription = !isLoginView && identifierPreview
    ? `We sent the code to ${identifierPreview}`
    : undefined;

  const handleToggleIdentifierInput = (newIsPhoneInput: boolean) => {
    loginFormik.setFieldValue("isPhoneInput", newIsPhoneInput, false);
    loginFormik.setFieldValue("identifierString", "", false);
    loginFormik.setFieldError("identifierString", undefined);
    loginFormik.setFieldTouched("identifierString", false, false);
    setOtpMethodId(null);
    setIdentifierPreview("");
  };

  const renderFooter = () => {
    if (isLoginView) {
      return (
        <div className='flex flex-col gap-2'>
          <LoadingButton
            type='submit'
            form='user-login-dialog'
            className='w-full'
            loading={loginFormik.isSubmitting}
            disabled={loginFormik.isSubmitting}
          >
            Continue
          </LoadingButton>
          <Button variant='outline' className='w-full' onClick={closeDialog}>
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-2'>
        <Button
          variant='outline'
          className='w-full'
          disabled={otpLoading}
          onClick={() => {
            loginFormik.setFieldValue("currentView", "loginView");
            setOtpMethodId(null);
            setOtpLoading(false);
            setIdentifierPreview("");
          }}
        >
          Back
        </Button>
        <Button
          variant='ghost'
          className='w-full'
          disabled={otpLoading}
          onClick={closeDialog}
        >
          Cancel
        </Button>
      </div>
    );
  };

  const handleOpenDialog = () => {
    loginFormik.resetForm({ values: { ...initialValues } });
    setOtpMethodId(null);
    setOtpLoading(false);
    setIdentifierPreview("");
    setIsOpen(true);
  };

  return (
    <div>
      <Button type='button' onClick={handleOpenDialog} variant='ghost'>
        Sign in / Sign up
      </Button>

      <ResponsiveDialog
        open={isOpen}
        setOpen={handleDialogOpenChange}
        title={dialogTitle}
        description={dialogDescription}
        hideMainBtn
        hideCloseBtn
      >
        <div className='space-y-6'>
          <LoginForm
            formik={loginFormik}
            setOtpLoading={setOtpLoading}
            otpLoading={otpLoading}
            onLoginSuccess={handleAuthSuccess}
            isPhoneNumber={isPhoneInput}
            otpMethodId={otpMethodId ?? ""}
            handleResendOtp={handleResendOtp}
          >
            <div className='flex items-center justify-center space-x-2 pt-4'>
              <Switch
                id='login-method'
                checked={isPhoneInput}
                onCheckedChange={handleToggleIdentifierInput}
              />
              <Label htmlFor='login-method'>
                {isPhoneInput ? "Use email instead" : "Use phone instead"}
              </Label>
            </div>
          </LoginForm>

          {renderFooter()}
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default UserNotLoggedIn;
