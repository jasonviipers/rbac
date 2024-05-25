import PermissionForm from "./_components/permission-form";

export default function PermissionPage({ params }: { params: { id: string } }) {

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PermissionForm />
            </div>
        </div>
    );
}