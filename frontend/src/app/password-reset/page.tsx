import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import PasswordResetRequestForm from "@/components/forms/password-reset-request-form";

export default function Page() {
    return (
        <div className={'container mx-auto max-w-7xl my-8'}>
            <div className={'max-w-xl mx-auto'}>
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>Please enter your registered email. We will send a password reset
                            link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasswordResetRequestForm/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}