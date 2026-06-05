import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask, logout as apiLogout } from "./services/api";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import AILoading from "./components/AILoading";

const navItems = [
  { id: "all",       label: "โน้ต",      icon: "💡" },
  { id: "todo",      label: "Todo",       icon: "📋" },
  { id: "doing",     label: "กำลังทำ",   icon: "⚡" },
  { id: "done",      label: "เสร็จแล้ว", icon: "✅" },
  { id: "dashboard", label: "Dashboard",  icon: "📊" },
];

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { if (authed) fetchTasks(); }, [authed]);

  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetch tasks failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (taskData) => {
    setSubmitting(true);
    try {
      await createTask(taskData);
      await fetchTasks();
      setShowForm(false);
    } catch (e) {
      console.error("create task failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    await fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const isDashboard = filter === "dashboard";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#202124", color: "#e8eaed" }}>

      {/* AI Loading Overlay */}
      {submitting && <AILoading />}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-60 z-10 pt-16" style={{ backgroundColor: "#202124" }}>
        <nav className="py-2 pr-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setFilter(item.id); setShowForm(false); }}
              className="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all"
              style={{
                borderRadius: "0 50px 50px 0",
                backgroundColor: filter === item.id ? "#fdd663" : "transparent",
                color: filter === item.id ? "#202124" : "#e8eaed",
              }}
              onMouseEnter={(e) => { if (filter !== item.id) e.currentTarget.style.backgroundColor = "#3c3f43"; }}
              onMouseLeave={(e) => { if (filter !== item.id) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-60">

        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-20 flex items-center h-16 px-4 gap-4"
          style={{ backgroundColor: "#202124", borderBottom: "1px solid #3c3f43" }}
        >
          <div className="flex items-center gap-2 w-60 pl-4 shrink-0">
            <span className="text-2xl">🤖</span>
            <span className="text-lg font-medium" style={{ color: "#e8eaed" }}>AI Todo</span>
          </div>

          <div className="flex-1">
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-xl max-w-xl"
              style={{ backgroundColor: "#2d2e30" }}
            >
              <span style={{ color: "#9aa0a6" }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#e8eaed" }}
                disabled={isDashboard}
              />
            </div>
          </div>

          <button
            onClick={() => { apiLogout(); setAuthed(false); }}
            className="text-xs px-3 py-1 rounded-full shrink-0 transition"
            style={{ color: "#9aa0a6", border: "1px solid #3c3f43" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#f28b82"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#9aa0a6"}
          >
            ออกจากระบบ
          </button>
        </header>

        {/* Content */}
        <main className="pt-24 px-8 pb-8">

          {isDashboard ? (
            <Dashboard tasks={tasks} />
          ) : (
            <>
              {/* Create Input */}
              <div className="max-w-lg mx-auto mb-8">
                {!showForm ? (
                  <div
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-text shadow-lg"
                    style={{ backgroundColor: "#2d2e30", border: "1px solid #3c3f43" }}
                  >
                    <span className="text-sm flex-1" style={{ color: "#9aa0a6" }}>จด Task ใหม่...</span>
                    <span style={{ color: "#9aa0a6" }}>☑️</span>
                  </div>
                ) : (
                  <TaskForm onSubmit={handleCreate} loading={submitting} onClose={() => setShowForm(false)} />
                )}
              </div>

              {/* Cards */}
              {loading && tasks.length === 0 ? (
                <p className="text-center mt-16 text-sm" style={{ color: "#9aa0a6" }}>⏳ กำลังโหลด...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center mt-16 text-sm" style={{ color: "#9aa0a6" }}>ไม่มี task ในขณะนี้</p>
              ) : (
                <div style={{ columnCount: 3, columnGap: "16px" }}>
                  {filtered.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
