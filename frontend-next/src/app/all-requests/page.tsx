import { Navigation } from '@/components/Navigation';
import { RequestList } from '@/components/requests/RequestList';

export default function AllRequestsPage() {
  return (
    <>
      <Navigation />
      <RequestList showAllRequests={true} />
    </>
  );
}