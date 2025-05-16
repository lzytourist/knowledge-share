import ProfileUpdateForm from "@/components/forms/profile-update-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {getAuthUser} from "@/actions/auth";
import {AuthUser} from "@/lib/types";
import PasswordUpdateForm from "@/components/forms/password-update-form";

export default async function Page() {
  const user = await getAuthUser();

  return (
    <div className={'space-y-6'}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>You can update your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileUpdateForm user={user as AuthUser}/>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordUpdateForm/>
        </CardContent>
      </Card>
    </div>
  );
}