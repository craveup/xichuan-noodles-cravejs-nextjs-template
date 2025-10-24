"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useCustomer, { type CustomerResponse } from "@/hooks/use-customer";
import LoggedInUser from "./LoggedInUser";
import UserNotLoggedIn from "./UserNotLoggedIn";

function UserAuthNavbar() {
  const { isAuthenticated, data, isLoading, mutate } = useCustomer();

  if (isLoading) {
    return <Skeleton className='h-10 w-10 rounded-full' />;
  }

  async function handleAuthStateChange(isLogout?: boolean) {
    if (isLogout) {
      await mutate(() => null as unknown as CustomerResponse, {
        revalidate: false,
        populateCache: true,
        rollbackOnError: false,
        throwOnError: false,
      });
      return;
    }

    await mutate();
  }

  return (
    <div>
      {isAuthenticated ? (
        <LoggedInUser onSuccess={handleAuthStateChange} data={data} />
      ) : (
        <UserNotLoggedIn onLoginSuccess={handleAuthStateChange} />
      )}
    </div>
  );
}

export default UserAuthNavbar;
