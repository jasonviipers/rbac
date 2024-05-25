import PermissionClient from "./_components/permission";

export default async function( ){
    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <PermissionClient data={[]}/>
            </div>
        </div>
    )
}