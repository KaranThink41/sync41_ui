// src/pages/SchedulePage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiCalendar,
  FiEdit,
  FiTrash,
  FiZap,
  FiCheckCircle,
  FiCloud,
} from "react-icons/fi";
import ThemePage, { useTheme } from "../layouts/ThemePage";
import PaddingInternalPages from "../layouts/PaddingInternalPages";
import Button from "../components/Button";
import { CloudCog } from "lucide-react";

const backendUrl = "http://13.203.173.137:3000";

// Helper to format ISO date/time
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

// Function to generate random string
function getRandomString(length) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  // Command & scheduling states
  const [command, setCommand] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");
  const [session_id, setSession_id] = useState("");
  const [logs, setLogs] = useState([]);
  const [isSSEconnected, setIsSSEconnected] = useState(false);
  const [promptRespone, setPromptRespone] = useState("Response here");

  // Task list
  const [scheduledTasks, setScheduledTasks] = useState([]);

  // Dummy connected apps
  const [connectedApps] = useState(["Google Calendar", "Slack", "Trello"]);

  // Modal states
  const [deletePopup, setDeletePopup] = useState({ show: false, taskId: null });
  const [editPopup, setEditPopup] = useState({
    show: false,
    taskId: null,
    command: "",
    scheduleDateTime: "",
    category: "Work",
    recurrence: "none",
    dueDate: "",
  });

  // Additional settings
  const [taskCategory, setTaskCategory] = useState("Work");
  const [recurrence, setRecurrence] = useState("none");
  const [dueDate, setDueDate] = useState("");

  // Prompt request function
  async function callPrompt(input, session_id) {
    const requestBody = {
      input: input,
      session_id: session_id,
    };
    try {
      const response = await fetch(`${backendUrl}/prompt`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Prompt function call response: ", result);
        return result;
      }
    } catch (error) {
      console.error("Failed to send prompt request: ", console.error);
    }
  }

  // Handle run prompt now
  const handleRunTask = async () => {
    console.log(`Handle run called with command : ${command}`);
    setLogs([]);
    if (command === "") {
      setError("Command is required");
      return;
    }
    const sessid = getRandomString(10);
    setSession_id(sessid);
    // Log session id
    console.log(`Session id set as ${sessid}`);
    // Start event stream for logs
    const waitForSSE = new Promise((resolve, reject) => {
      const eventSource = new EventSource(`${backendUrl}/logevents/${sessid}`);

      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setIsSSEconnected(true);
        resolve(eventSource); // Resolve the promise when connected
      };

      eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log("Message received: ", parsedData);
        if (parsedData.response) {
          setLogs((prevLogs) => [...prevLogs, parsedData.response]);
        }
        if (parsedData.step_type === "execute_action") {
          setLogs((prevLogs) => [
            ...prevLogs,
            "Executing tool: " + parsedData.executed_action_id,
          ]);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error: ", error);
        setError(error);
        eventSource.close();
        reject(error); // Reject the promise on error
      };

      eventSource.addEventListener("complete", (event) => {
        console.log("Session completed:", event.data);
        eventSource.close();
        setIsSSEconnected(false);
      });
    });
    // Send prompt to backend
    try {
      const eventSource = await waitForSSE;
      const result = await callPrompt(command, sessid);
      console.log(result.message.response);
      setPromptRespone(result.message.response);
      return;
    } catch (error) {
      console.error("Failed to establish sse connection: ", console.error);
    }
  };

  // Handle scheduling
  const handleScheduleTask = () => {
    if (!command.trim() || !scheduleDate || !scheduleTime) {
      console.log("Missing fields, cannot schedule");
      return;
    }
    const combined = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    const newTask = {
      id: Date.now(),
      command,
      scheduleDateTime: combined,
      createdAt: new Date().toISOString(),
      category: taskCategory,
      recurrence,
      dueDate,
      status: "scheduled",
    };

    setScheduledTasks((prev) => [...prev, newTask]);

    // Reset
    setCommand("");
    setScheduleDate("");
    setScheduleTime("");
    setTaskCategory("Work");
    setRecurrence("none");
    setDueDate("");
  };

  // Deletion
  const handleDeleteTask = (taskId) => {
    setScheduledTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Editing
  const handleEditTask = (taskId) => {
    const taskToEdit = scheduledTasks.find((t) => t.id === taskId);
    if (taskToEdit) {
      setEditPopup({
        show: true,
        taskId: taskToEdit.id,
        command: taskToEdit.command,
        scheduleDateTime: taskToEdit.scheduleDateTime,
        category: taskToEdit.category,
        recurrence: taskToEdit.recurrence,
        dueDate: taskToEdit.dueDate,
      });
    }
  };

  const confirmDelete = () => {
    if (deletePopup.taskId) {
      handleDeleteTask(deletePopup.taskId);
      setDeletePopup({ show: false, taskId: null });
    }
  };

  const confirmEdit = () => {
    if (editPopup.taskId) {
      setScheduledTasks((prev) =>
        prev.map((task) =>
          task.id === editPopup.taskId
            ? {
                ...task,
                command: editPopup.command,
                scheduleDateTime: editPopup.scheduleDateTime,
                category: editPopup.category,
                recurrence: editPopup.recurrence,
                dueDate: editPopup.dueDate,
              }
            : task
        )
      );
      setEditPopup({
        show: false,
        taskId: null,
        command: "",
        scheduleDateTime: "",
        category: "Work",
        recurrence: "none",
        dueDate: "",
      });
    }
  };

  // Category pill
  const CategoryPill = ({ category }) => (
    <div
      className={`px-3 py-1 rounded-full flex items-center gap-2 text-sm ${
        category === "Work"
          ? "bg-blue-50 text-blue-600"
          : category === "Personal"
          ? "bg-purple-50 text-purple-600"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <FiZap className="w-4 h-4" />
      <span>{category}</span>
    </div>
  );

  return (
    <ThemePage>
      <PaddingInternalPages>
        {/* Slightly smaller gap from top */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 text-base">
          {/* Sidebar */}
          <div
            className="lg:col-span-1 p-4 rounded-2xl shadow-sm"
            style={{
              boxShadow:
                "0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
              backgroundColor: colors.background,
              color: colors.text,
            }}
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => navigate("/schedule/integrations")}
            >
              <FiCloud className="inline-block mr-2 -mt-1" />
              Manage Integrations
            </Button>

            <h2
              className="text-lg font-semibold mt-5 mb-3"
              style={{ color: colors.primary }}
            >
              <FiCheckCircle className="mr-2 inline-block" />
              Connected Services
            </h2>

            <ul className="space-y-3">
              {connectedApps.map((app, i) => (
                <li
                  key={i}
                  className="flex items-center p-3 rounded-xl border text-sm"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    cursor: "default", // not clickable
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3" />
                  <span
                    className="font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    {app}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <section
            className="lg:col-span-3 p-4 rounded-2xl shadow-sm"
            style={{
              boxShadow:
                "0 8px 20px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
              backgroundColor: colors.background,
              color: colors.text,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: colors.primary }}
                >
                  Task Scheduler
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Automate your workflow with precision
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-lg"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700">
                  System Active
                </span>
              </div>
            </div>

            <div className="text-green-400 font-bold text-xl">
              {promptRespone}
            </div>

            {/* AI Command */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.primary }}
              >
                AI Command
              </label>
              <ul>
                {logs.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
              <div className="relative">
                <textarea
                  rows={5} // bigger text area
                  placeholder="Enter your command..."
                  className="w-full p-2 text-sm rounded-lg border resize-none"
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.border,
                    color: colors.text,
                    minHeight: "100px",
                  }}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
                <div
                  className="absolute bottom-2 right-3 text-xs text-gray-400"
                  style={{ fontSize: "12px" }}
                >
                  {command.length}/500
                </div>
              </div>
            </div>

            {/* Schedule Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Left side (Date, Category) */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.primary }}
                  >
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.primary }}
                  >
                    Task Category
                  </label>
                  <div className="flex space-x-2">
                    {["Work", "Personal", "Team"].map((cat) => (
                      <button
                        key={cat}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          taskCategory === cat
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        style={{
                          backgroundColor:
                            taskCategory === cat
                              ? colors.primary
                              : colors.backgroundSecondary,
                          color: taskCategory === cat ? "#FFFFFF" : colors.text,
                        }}
                        onClick={() => setTaskCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side (Time, Recurrence) */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.primary }}
                  >
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.primary }}
                  >
                    Recurrence
                  </label>
                  <select
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Action Button - Lower & Centered */}
            <div className="mt-4 flex gap-4 justify-center">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleScheduleTask}
                className="px-6 py-2"
              >
                Schedule Task
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleRunTask}
                className="px-6 py-2"
              >
                Execute Now
              </Button>
            </div>

            {/* Scheduled Tasks (in a 2-col grid) */}
            <div className="mt-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: colors.primary }}
              >
                Scheduled Tasks
              </h3>
              {scheduledTasks.length === 0 ? (
                <div className="text-center py-6">
                  <FiClock className="mx-auto text-gray-300 w-8 h-8 mb-2" />
                  <p className="text-gray-500 text-sm">
                    No scheduled tasks found
                  </p>
                </div>
              ) : (
                // 2-col grid with scroll
                <motion.div
                  className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto"
                  // Container for tasks
                >
                  <AnimatePresence>
                    {scheduledTasks
                      .sort(
                        (a, b) =>
                          new Date(a.scheduleDateTime) -
                          new Date(b.scheduleDateTime)
                      )
                      .map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 rounded-lg border text-sm relative"
                          style={{
                            boxShadow:
                              "0 4px 8px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)",
                            backgroundColor: colors.backgroundSecondary,
                            borderColor: colors.border,
                            color: colors.text,
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{task.command}</h4>
                            <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 rounded"
                                style={{
                                  backgroundColor: colors.backgroundSecondary,
                                  color: colors.primary,
                                }}
                                onClick={() => handleEditTask(task.id)}
                              >
                                <FiEdit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="p-1 rounded text-red-600"
                                style={{
                                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                                }}
                                onClick={() =>
                                  setDeletePopup({
                                    show: true,
                                    taskId: task.id,
                                  })
                                }
                              >
                                <FiTrash className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          {/* Category pill */}
                          <CategoryPill category={task.category} />

                          {/* Date/Time Info */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {formatDateTime(task.scheduleDateTime)}
                              </span>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                <span>Due {formatDateTime(task.dueDate)}</span>
                              </div>
                            )}
                            {task.recurrence !== "none" && (
                              <span
                                className="font-medium"
                                style={{ color: colors.primary }}
                              >
                                • {task.recurrence}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </PaddingInternalPages>
    </ThemePage>
  );
}