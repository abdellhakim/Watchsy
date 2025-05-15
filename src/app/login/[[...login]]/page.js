import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="m-auto">
                <SignIn />
             </div>
        </div>
    );
    }