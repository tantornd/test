import { Navigation } from '@/components/Navigation';
import { RequestList } from '@/components/requests/RequestList';

export default function MyRequestsPage() {
  return (
    <>
      <Navigation />
      <RequestList showAllRequests={false} />
    </>
  );
}

