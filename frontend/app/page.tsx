import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProjectHeader } from "@/components/ProjectHeader";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area - offset for fixed header (pt-16) and sidebar (ml-[280px]) */}
      <main className="pt-16 ml-[280px] h-screen flex flex-col overflow-hidden">
        <ProjectHeader />
        <KanbanBoard />
      </main>
    </div>
  );
}
