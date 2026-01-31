import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProjectHeader from "@/components/ProjectHeader";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header at top */}
      <Header />

      {/* Main content area with Sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed left */}
        <Sidebar />

        {/* Main content area - offset by sidebar width */}
        <main className="flex-1 ml-[280px] overflow-auto">
          <ProjectHeader />
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
}
