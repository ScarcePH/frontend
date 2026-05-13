import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { getStrength } from "@/utils/passwordstrength"
import { useMutation } from "@tanstack/react-query"
import { ChangePassword } from "@/api"


export default function ChangePass(){
    const [password, setPassword] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirm, setConfirm] = useState("")

    const strength = getStrength(newPass)
    const match = newPass && confirm && newPass === confirm

    const mutate = useMutation({
        mutationFn: ({password, newPass}:{password:string, newPass:string}) => 
            ChangePassword(newPass, password)
    })
    return (
        <div className="w-full h-3/4 flex justify-center items-center">
            <Card className="w-xs md:w-md">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                    Use a strong, unique password.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Current */}
                    <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                    />

                    {newPass && (
                        <>
                        <Progress value={strength.score} className={strength.progresscolor}/>
                        <p
                            className={`text-sm font-medium ${strength.color}`}
                        >
                            {strength.label}
                        </p>
                        </>
                    )}
                    </div>

                    <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                    />

                    {confirm && (
                        <p
                        className={`text-sm font-medium ${
                            match ? "text-green-600" : "text-red-600"
                        }`}
                        >
                        {match ? "Passwords match" : "Passwords do not match"}
                        </p>
                    )}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={!match || strength.score < 75 || mutate.isPending}
                        onClick={() => mutate.mutate({password, newPass})}
                    >
                    {mutate.isPending? <span className="animate-pulse">Updating...</span>:<>Update Password</>}
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}
