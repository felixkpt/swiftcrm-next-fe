import Link from "next/link";

const Sidebar = () => {
    return (
        <aside className="rounded min-h-screen bg-base-200 text-base-content">
            <nav>
                <ul className="menu p-4 w-80 min-h-full">
                    <li><Link href="/">Dashboard</Link></li>
                    <li><Link href="/tickets">Tickets</Link></li>
                    <li><Link href="/admin/auto-builders/model-builder">Model builder</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
