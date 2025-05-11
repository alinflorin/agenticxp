import useToaster from "@/hooks/useToaster"
import toolsService from "@/services/tools.service";
import { Button } from "@chakra-ui/react";
import { useCallback } from "react";

export default function Home() {
    const showToast = useToaster();

    const testBe = useCallback(async () => {
        const reply = await toolsService.get();
        console.log(reply);
    }, []);

    return <div>Home<br />
    <Button onClick={() => showToast('test title', 'test message', 'error', {label: 'hey', onClick: () => {alert(1)}})}>Test toast</Button>
    <Button onClick={testBe}>Test BE</Button>
    </div>
}