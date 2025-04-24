import useToaster from "@/hooks/useToaster"
import { Button } from "@chakra-ui/react";

export default function Home() {
    const showToast = useToaster();

    return <div>Home<br />
    <Button onClick={() => showToast('test title', 'test message', 'error', {label: 'hey', onClick: () => {alert(1)}})}>Test toast</Button>
    </div>
}