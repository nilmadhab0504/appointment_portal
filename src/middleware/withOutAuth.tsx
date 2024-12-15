import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withoutAuth = (WrappedComponent: React.ComponentType) => {
  const UnauthenticatedComponent = (props: any) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (session?.user) {
        router.push('/'); // Redirect to home page or another page for authenticated users
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return <div></div>; // Optionally, add a loading spinner here
    }


    return <WrappedComponent {...props} />;
  };

  UnauthenticatedComponent.displayName = `withoutAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return UnauthenticatedComponent;
};

export default withoutAuth;
