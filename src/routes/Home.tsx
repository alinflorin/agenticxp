import useToaster from "@/hooks/useToaster"
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useCallback } from "react";

export default function Home() {
    const showToast = useToaster();

    const testBe = useCallback(async () => {
        const reply = await axios.get('/api/hello');
        alert(reply.data);
    }, []);

    return <div>Home<br />
    <Button onClick={() => showToast('test title', 'test message', 'error', {label: 'hey', onClick: () => {alert(1)}})}>Test toast</Button>
    <Button onClick={testBe}>Test BE</Button>
    </div>
}