import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-70 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent className="p-0" side={"left"}>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
