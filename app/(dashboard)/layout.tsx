import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface DashboradLayoutProps {
    children: React.ReactNode;
}

const DashboradLayout: React.FC<DashboradLayoutProps> = ({ children }) => {
    return (
        <div className="h-full">
            <div className="fixed inset-y-0 h-[80px] md:pl-56 w-full z-50">
                <Navbar />
            </div>
            <div className="hidden md:flex w-56 fixed inset-y-0 z-50 flex-col">
                <Sidebar />
            </div>
            <main className="md:pl-56 h-full">{children}</main>
        </div>
    );
};

export default DashboradLayout;
