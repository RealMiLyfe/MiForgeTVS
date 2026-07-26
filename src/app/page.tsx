"use client";

import { useState, useEffect, useCallback } from "react";

interface Task {
  id: number;
  taskNumber: string;
  description: string;
  status: string;
  output: string | null;
  errorMessage: string | null;
}

interface HealthCheck {
  id: number;
  checkName: string;
  description: string;
  status: string;
  message: string | null;
  lastChecked: string | null;
}

interface Phase {
  id: number;
  phaseNumber: number;
  name: string;
  target: string;
  status: string;
  healthCheckPassed: boolean;
  startedAt: string | null;
  completedAt: string | null;
  errorCount: number;
  retryCount: number;
  notes: string | null;
  tasks: Task[];
  healthChecks: HealthCheck[];
  progress: {
    tasks: { completed: number; total: number };
    healthChecks: { passed: number; total: number };
  };
}

interface Agent {
  id: number;
  agentNumber: number;
  name: string;
  codeName: string;
  role: string;
  model: string;
  status: string;
  mattermostBot: string;
  tools: string[];
  hardRules: string[];
  taskCount: number;
  errorCount: number;
}

interface Workflow {
  id: number;
  workflowNumber: number;
  name: string;
  description: string;
  trigger: string;
  status: string;
  isActive: boolean;
  runCount: number;
  errorCount: number;
}

interface Service {
  id: number;
  name: string;
  port: number;
  category: string;
  status: string;
  description: string;
}

interface BuildLog {
  id: number;
  severity: string;
  message: string;
  source: string | null;
  createdAt: string;
}

interface DashboardData {
  overview: {
    phases: { total: number; completed: number; progress: number };
    tasks: { total: number; completed: number; progress: number };
    agents: { total: number; online: number };
    workflows: { total: number; active: number };
    services: { total: number; healthy: number };
  };
  recentLogs: BuildLog[];
}

const statusColors: Record<string, string> = {
  pending: "bg-slate-600",
  in_progress: "bg-amber-500",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
  blocked: "bg-orange-500",
  skipped: "bg-slate-400",
  unknown: "bg-slate-500",
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  unhealthy: "bg-red-500",
  offline: "bg-slate-600",
  initializing: "bg-blue-500",
  online: "bg-emerald-500",
  error: "bg-red-500",
  maintenance: "bg-purple-500",
};

const severityColors: Record<string, string> = {
  info: "text-blue-400",
  warning: "text-amber-400",
  error: "text-red-400",
  critical: "text-red-600",
};

type TabType = "overview" | "phases" | "agents" | "workflows" | "services";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [phasesRes, agentsRes, workflowsRes, servicesRes, dashboardRes] = await Promise.all([
        fetch("/api/phases"),
        fetch("/api/agents"),
        fetch("/api/workflows"),
        fetch("/api/services"),
        fetch("/api/dashboard"),
      ]);

      const phasesData = await phasesRes.json();
      const agentsData = await agentsRes.json();
      const workflowsData = await workflowsRes.json();
      const servicesData = await servicesRes.json();
      const dashboardData = await dashboardRes.json();

      setPhases(phasesData.phases || []);
      setAgents(agentsData.agents || []);
      setWorkflows(workflowsData.workflows || []);
      setServices(servicesData.services || []);
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Error seeding:", error);
    } finally {
      setSeeding(false);
    }
  };

  const updatePhaseStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/phases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateHealthCheckStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/health-checks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateAgentStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateWorkflowActive = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive, status: isActive ? "completed" : "pending" }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateServiceStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            MiLyfe: Venture Titan Studio
          </h2>
          <p className="text-slate-400 mt-2">Loading Build Control Center...</p>
        </div>
      </div>
    );
  }

  const completionCriteria = [
    { label: "All 10 phases completed", met: dashboard?.overview.phases.completed === 10 },
    { label: "All health checks pass", met: dashboard?.overview.tasks.completed === dashboard?.overview.tasks.total && (dashboard?.overview.tasks.total ?? 0) > 0 },
    { label: "All 11 agents online", met: dashboard?.overview.agents.online === 11 },
    { label: "All 8 workflows active", met: dashboard?.overview.workflows.active === 8 },
    { label: "All services healthy", met: dashboard?.overview.services.healthy === dashboard?.overview.services.total && (dashboard?.overview.services.total ?? 0) > 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  MiLyfe: Venture Titan Studio
                </h1>
                <p className="text-slate-400 text-sm">Build Control Center — Forge Orchestrator v1.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-300 text-sm">Build System Active</span>
              </div>
              <button
                onClick={seedDatabase}
                disabled={seeding}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                {seeding ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Initializing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Initialize Build
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/30 p-1 rounded-xl w-fit">
          {[
            { key: "overview", label: "Overview", icon: "📊" },
            { key: "phases", label: "Build Phases", icon: "🔧" },
            { key: "agents", label: "Agent Crew", icon: "🤖" },
            { key: "workflows", label: "Workflows", icon: "⚙️" },
            { key: "services", label: "Services", icon: "🖥️" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {!dashboard || phases.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
              <span className="text-6xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to MiLyfe Build Control</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Initialize the build system to load all 10 phases, 11 agents, 8 workflows, and 17 services for your AI Workforce Operating System.
            </p>
            <button
              onClick={seedDatabase}
              disabled={seeding}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-xl text-lg font-bold transition-all shadow-lg shadow-emerald-500/25"
            >
              {seeding ? "Initializing Build System..." : "🔥 Initialize Build System"}
            </button>
          </div>
        ) : activeTab === "overview" ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                title="Build Phases"
                value={`${dashboard.overview.phases.completed}/${dashboard.overview.phases.total}`}
                subtitle={`${dashboard.overview.phases.progress}% complete`}
                color="emerald"
                progress={dashboard.overview.phases.progress}
              />
              <StatCard
                title="Tasks"
                value={`${dashboard.overview.tasks.completed}/${dashboard.overview.tasks.total}`}
                subtitle={`${dashboard.overview.tasks.progress}% complete`}
                color="cyan"
                progress={dashboard.overview.tasks.progress}
              />
              <StatCard
                title="Agents"
                value={`${dashboard.overview.agents.online}/${dashboard.overview.agents.total}`}
                subtitle="Online"
                color="purple"
                progress={(dashboard.overview.agents.online / dashboard.overview.agents.total) * 100}
              />
              <StatCard
                title="Workflows"
                value={`${dashboard.overview.workflows.active}/${dashboard.overview.workflows.total}`}
                subtitle="Active"
                color="amber"
                progress={(dashboard.overview.workflows.active / dashboard.overview.workflows.total) * 100}
              />
              <StatCard
                title="Services"
                value={`${dashboard.overview.services.healthy}/${dashboard.overview.services.total}`}
                subtitle="Healthy"
                color="blue"
                progress={(dashboard.overview.services.healthy / dashboard.overview.services.total) * 100}
              />
            </div>

            {/* Completion Criteria */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>✅</span> Completion Criteria
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {completionCriteria.map((criterion, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      criterion.met ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-slate-700/30 border border-slate-600"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      criterion.met ? "bg-emerald-500" : "bg-slate-600"
                    }`}>
                      {criterion.met ? "✓" : "○"}
                    </div>
                    <span className={criterion.met ? "text-emerald-400" : "text-slate-400"}>
                      {criterion.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Progress Overview */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Build Progress</h3>
              <div className="space-y-3">
                {phases.map((phase) => (
                  <div key={phase.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
                      {phase.phaseNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300 truncate">{phase.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${statusColors[phase.status]} text-white`}>
                          {phase.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            phase.status === "completed" ? "bg-emerald-500" :
                            phase.status === "in_progress" ? "bg-amber-500" :
                            phase.status === "failed" ? "bg-red-500" : "bg-slate-600"
                          }`}
                          style={{
                            width: `${phase.progress.tasks.total > 0
                              ? (phase.progress.tasks.completed / phase.progress.tasks.total) * 100
                              : 0}%`
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 w-16 text-right">
                      {phase.progress.tasks.completed}/{phase.progress.tasks.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📜</span> Build Log
              </h3>
              <div className="space-y-2 max-h-64 overflow-auto">
                {dashboard.recentLogs.length === 0 ? (
                  <p className="text-slate-500 text-sm">No logs yet</p>
                ) : (
                  dashboard.recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <span className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                      <span className={`font-mono text-xs uppercase ${severityColors[log.severity]}`}>
                        [{log.severity}]
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : activeTab === "phases" ? (
          <div className="space-y-4">
            {phases.map((phase) => (
              <div key={phase.id} className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                        phase.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                        phase.status === "in_progress" ? "bg-amber-500/20 text-amber-400" :
                        phase.status === "failed" ? "bg-red-500/20 text-red-400" :
                        "bg-slate-700 text-slate-400"
                      }`}>
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">PHASE {phase.phaseNumber} — {phase.name}</h3>
                        <p className="text-sm text-slate-400">{phase.target}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-slate-400">
                          Tasks: {phase.progress.tasks.completed}/{phase.progress.tasks.total}
                        </p>
                        <p className="text-sm text-slate-400">
                          Health: {phase.progress.healthChecks.passed}/{phase.progress.healthChecks.total}
                        </p>
                      </div>
                      <select
                        value={phase.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updatePhaseStatus(phase.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[phase.status]} text-white border-0 cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedPhase === phase.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedPhase === phase.id && (
                  <div className="border-t border-slate-700 p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Tasks */}
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-3">TASKS</h4>
                        <div className="space-y-2">
                          {phase.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50">
                              <span className="text-xs text-slate-500 font-mono w-8">{task.taskNumber}</span>
                              <span className="flex-1 text-sm text-slate-300 truncate">{task.description}</span>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                className={`px-2 py-1 rounded text-xs ${statusColors[task.status]} text-white border-0 cursor-pointer`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="skipped">Skipped</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Health Checks */}
                      <div>
                        <h4 className="text-sm font-semibold text-cyan-400 mb-3">HEALTH CHECKS</h4>
                        <div className="space-y-2">
                          {phase.healthChecks.map((check) => (
                            <div key={check.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50">
                              <span className="flex-1 text-sm text-slate-300">{check.description}</span>
                              <select
                                value={check.status}
                                onChange={(e) => updateHealthCheckStatus(check.id, e.target.value)}
                                className={`px-2 py-1 rounded text-xs ${statusColors[check.status]} text-white border-0 cursor-pointer`}
                              >
                                <option value="unknown">Unknown</option>
                                <option value="healthy">Healthy</option>
                                <option value="degraded">Degraded</option>
                                <option value="unhealthy">Unhealthy</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : activeTab === "agents" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        agent.status === "online" ? "bg-emerald-500/20" :
                        agent.status === "error" ? "bg-red-500/20" :
                        "bg-slate-700"
                      }`}>
                        🤖
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{agent.name}</h3>
                        <p className="text-xs text-slate-500 font-mono">{agent.mattermostBot}</p>
                      </div>
                    </div>
                    <select
                      value={agent.status}
                      onChange={(e) => updateAgentStatus(agent.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs ${statusColors[agent.status]} text-white border-0 cursor-pointer`}
                    >
                      <option value="offline">Offline</option>
                      <option value="initializing">Initializing</option>
                      <option value="online">Online</option>
                      <option value="error">Error</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{agent.role}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">{agent.model}</span>
                  </div>

                  <button
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {expandedAgent === agent.id ? "Hide details ▲" : "Show details ▼"}
                  </button>

                  {expandedAgent === agent.id && (
                    <div className="mt-3 pt-3 border-t border-slate-700 space-y-3">
                      <div>
                        <p className="text-xs text-emerald-400 mb-1">TOOLS</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.tools.map((tool, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-red-400 mb-1">HARD RULES</p>
                        <ul className="space-y-1">
                          {agent.hardRules.map((rule, idx) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-red-500">⚠</span>
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "workflows" ? (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      workflow.isActive ? "bg-emerald-500/20" : "bg-slate-700"
                    }`}>
                      ⚙️
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Workflow {workflow.workflowNumber}: {workflow.name}</h3>
                      <p className="text-sm text-slate-400">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-slate-500">Trigger</p>
                      <p className="text-sm text-slate-300">{workflow.trigger}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflow.isActive}
                        onChange={(e) => updateWorkflowActive(workflow.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === "services" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-slate-800/30 rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[service.status]}`}></div>
                    <h3 className="font-bold text-white">{service.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono">
                    :{service.port}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                    {service.category}
                  </span>
                  <select
                    value={service.status}
                    onChange={(e) => updateServiceStatus(service.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs ${statusColors[service.status]} text-white border-0 cursor-pointer`}
                  >
                    <option value="unknown">Unknown</option>
                    <option value="healthy">Healthy</option>
                    <option value="degraded">Degraded</option>
                    <option value="unhealthy">Unhealthy</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
  progress,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  progress: number;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  };

  const progressColors: Record<string, string> = {
    emerald: "bg-emerald-500",
    cyan: "bg-cyan-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4`}>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-500 text-xs mb-2">{subtitle}</p>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColors[color]} transition-all`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
