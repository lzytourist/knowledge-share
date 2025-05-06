import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface PendingButtonProps extends ButtonProps {
    isPending?: boolean
}

export default function PendingButton({isPending = false, disabled = false, ...props}: PendingButtonProps) {
    return (
        <Button
            disabled={isPending || disabled}
            {...props}>
            {props.children}
            {isPending && <Loader2 className={'animate-spin size-4 shrink-0'}/>}
        </Button>
    )
}