import { useMemo, useState } from "react";
import { LogOut, Mail, Phone, User2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { apiDelete } from "@/lib/api";
import { deleteAuthToken } from "@/lib/local-storage";
import { formatApiError } from "@/lib/format-api-error";
import { toast } from "sonner";
import type { CustomerResponse } from "@/hooks/use-customer";

const LoggedInUser = ({
  onSuccess,
  data,
}: {
  onSuccess: (isLoggedOut: boolean) => void;
  data?: CustomerResponse;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName = useMemo(() => {
    const names = [data?.customerName, data?.lastName].filter(Boolean);
    if (!names.length) return "Account";
    return names.join(" ");
  }, [data?.customerName, data?.lastName]);

  const detailItems = useMemo(
    () =>
      [
          data?.customerName
              ? { icon: User2, label: "name", value: fullName }
              : undefined,
        data?.customerEmail
          ? { icon: Mail, label: "Email", value: data.customerEmail }
          : undefined,
        data?.phoneNumber
          ? { icon: Phone, label: "Phone", value: data.phoneNumber }
          : undefined,
      ].filter(Boolean) as { icon: typeof Mail; label: string; value: string }[],
    [data?.customerEmail, data?.phoneNumber],
  );

  const closeDialog = () => setIsDialogOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await apiDelete(`/api/v1/customer/logout`);
      deleteAuthToken();
      onSuccess(true);
      closeDialog();
      toast.success("Signed out successfully");
    } catch (error) {
      const { message } = formatApiError(error);
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Open account menu"
      >
        <Avatar className='cursor-pointer'>
            <AvatarFallback>
                <User2 className="h-5 w-5" />
            </AvatarFallback>
        </Avatar>
      </button>

      <ResponsiveDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        title="Account"
        hideMainBtn
        footer={(
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="sm:flex-1"
              onClick={closeDialog}
              disabled={isLoggingOut}
            >
              Close
            </Button>
            <LoadingButton
              type="button"
              onClick={handleLogout}
              loading={isLoggingOut}
              className="sm:flex-1"
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </LoadingButton>
          </div>
        )}
      >
        <div className="space-y-6">
          {detailItems.length > 0 && (
            <div className="space-y-3 text-sm">
              {detailItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <p className="text-xs text-muted-foreground">
            Customer ID: <span className="font-mono text-foreground">{data?.id ?? "Unavailable"}</span>
          </p>
        </div>
      </ResponsiveDialog>
    </>
  );
};

export default LoggedInUser;
