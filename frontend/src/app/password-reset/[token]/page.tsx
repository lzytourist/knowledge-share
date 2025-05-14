import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import PasswordResetForm from "@/components/forms/password-reset-form";
import {Button} from "@/components/ui/button";

export default async function Page({params}: {params: Promise<{token: string}>}) {
    const {token} = await params;

    return (
        <div className={'container max-w-7xl mx-auto my-8'}>
            <div className={'max-w-xl mx-auto'}>
                <Card>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Please set your account password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PasswordResetForm token={token}/>
                </CardContent>
                <CardFooter>
                    <Button asChild={true} variant={'outline'}>
                        <Link href={'/'}>Cancel</Link>
                    </Button>
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}