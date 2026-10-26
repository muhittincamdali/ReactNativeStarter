import { Redirect } from 'expo-router';

import { useSession } from '@/lib/session';

/** `/` opens the task list when signed in and the sign-in screen otherwise. */
export default function StartRoute() {
  const signedIn = useSession((state) => state.status === 'signed-in');
  return <Redirect href={signedIn ? '/tasks' : '/sign-in'} />;
}
