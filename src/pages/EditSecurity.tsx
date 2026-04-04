import PageMeta from "../components/common/PageMeta";
import { EditSecurity } from "../components/UserProfile/EditSecurity";

export default function EditSecurityPage() {
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | Octagames - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for Octagames - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="dark: lg:p-6">
        <div className="space-y-6">
            <EditSecurity />
        </div>
      </div>
    </>
  );
}
