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

// Sorting function for tasks by date
const sortTasksByDate = (tasks) => {
  return [...tasks].sort((a, b) => new Date(a.scheduleDateTime) - new Date(b.scheduleDateTime));
};

export default function SchedulePage() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  // Command & scheduling states
  const [command, setCommand] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [error, setError] = useState("");
  const [session_id, setSession_id] = useState("");
  const [logs, setLogs] = useState([""]);
  const [isSSEconnected, setIsSSEconnected] = useState(false);
  const [promptRespone, setPromptRespone] = useState("");
  // Task list
  const [scheduledTasks, setScheduledTasks] = useState([]);

  // Dummy connected apps
  const [connectedApps] = useState(["Google Calendar", "Google Drive", "Gmail"]);

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
        if (parsedData.step_type !== "interaction_complete" || "plan_final_response") {
          if (parsedData.response) {
            setLogs((prevLogs) => [...prevLogs, parsedData.response]);
          }
          if (parsedData.step_type === "execute_action") {
            setLogs((prevLogs) => [
              ...prevLogs,
              "Executing tool: " + parsedData.executed_action_id,
            ]);
          }
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
  const handleScheduleTask = async () => {
    if (!command.trim() || !scheduleDate || !scheduleTime) {
      console.log("Missing fields, cannot schedule");
      return;
    }
    
    // Create a date object from the user's input
    const userSelectedDate = new Date(`${scheduleDate}T${scheduleTime}`);
    
    // Format the date to match the required format: YYYY-MM-DDThh:mm:ss+05:30
    const year = userSelectedDate.getFullYear();
    const month = String(userSelectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(userSelectedDate.getDate()).padStart(2, '0');
    const hours = String(userSelectedDate.getHours()).padStart(2, '0');
    const minutes = String(userSelectedDate.getMinutes()).padStart(2, '0');
    const seconds = String(userSelectedDate.getSeconds()).padStart(2, '0');
    
    const executionTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
    
    // Create the payload with hardcoded values for user_id and is_recurring
    const taskPayload = {
      user_id: "590f5d1a-a87f-4ab1-9825-ce25e4a08a75",
      query: command,
      execution_time: executionTime,
      is_recurring: false
    };
    
    console.log("Scheduling task with payload:", taskPayload);
    
    try {
      // Send the payload to the specified endpoint
      const response = await fetch("http://ec2-3-91-217-18.compute-1.amazonaws.com:8000/schedule/prompt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskPayload),
      });
      
      const responseData = await response.json();
      console.log("Response:", responseData);
    } catch (error) {
      console.error("Error sending payload:", error);
    }
    
    // Continue with the existing functionality
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

  // Add state for modal
  const [selectedTask, setSelectedTask] = useState(null);

  // Add function to handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Add function to close modal
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  // Add state for logs expansion
  const [logsExpanded, setLogsExpanded] = useState(false);

  return (
    <ThemePage>
      <style>
        {`
          /* Custom scrollbar styles */
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #eee;
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
      <PaddingInternalPages>
        {/* Slightly smaller gap from top */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6 text-base">
          {/* Sidebar - Increased width from 1 to 2 columns */}
          <div
            className="lg:col-span-2 p-4 rounded-2xl shadow-sm"
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FiCloud className="inline-block mr-2 -mt-1" />
              Manage Integrations
            </Button>

            <div className="bg-gray-50 p-5 rounded-lg mt-5 mb-5 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colors.primary }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connected Services
              </h2>
              <ul className="space-y-2">
                {connectedApps.map((app, i) => (
                  <li key={i} className="flex items-center p-2.5 text-sm bg-white rounded-md shadow-sm border border-gray-50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    <span className="font-medium">{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg mb-4 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Scheduled Tasks
              </h2>
              <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  {sortTasksByDate(scheduledTasks).map((task) => (
                    <motion.div
                      key={task.id}
                      className="cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                      onClick={() => handleTaskClick(task)}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`h-1.5 w-full ${
                        task.category === 'Work' ? 'bg-blue-500' : 
                        task.category === 'Personal' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}></div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${
                            task.category === 'Work' ? 'bg-blue-50 text-blue-700' : 
                            task.category === 'Personal' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 mr-1 ${
                              task.category === 'Work' ? 'text-blue-500' : 
                              task.category === 'Personal' ? 'text-emerald-500' : 'text-indigo-500'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {task.category === 'Work' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              ) : task.category === 'Personal' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              )}
                            </svg>
                            {task.category}
                          </div>
                          
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500">
                              {new Date(task.scheduleDateTime).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{task.command}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          {task.recurrence !== 'none' && (
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="text-xs font-medium text-gray-500">{task.recurrence}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center ml-auto">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleEditTask(task.id); 
                              }} 
                              className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors mr-2 flex items-center justify-center"
                              title="Edit Task"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setDeletePopup({ show: true, taskId: task.id }); 
                              }} 
                              className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center"
                              title="Delete Task"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
                onClick={handleCloseModal}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl overflow-hidden max-w-2xl w-full mx-4 shadow-2xl border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header with gradient background matching the category color */}
                  <div className={`p-6 ${
                    selectedTask.category === 'Work' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                    selectedTask.category === 'Personal' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 
                    'bg-gradient-to-r from-indigo-500 to-indigo-600'
                  } text-white`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {selectedTask.category} Task
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(selectedTask.scheduleDateTime).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                            selectedTask.category === 'Work' ? 'bg-blue-50 text-blue-700' : 
                            selectedTask.category === 'Personal' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {selectedTask.category === 'Work' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              ) : selectedTask.category === 'Personal' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              )}
                            </svg>
                            {selectedTask.category}
                          </span>
                        </div>
                        
                        {selectedTask.recurrence !== 'None' && (
                          <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                              />
                            </svg>
                            {selectedTask.recurrence}
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shadow-inner">
                        <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Command</span>
                        </div>
                        <div className="p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-b-lg">
                          {selectedTask.command}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => { handleEditTask(selectedTask.id); handleCloseModal(); }}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Task
                      </button>
                      <button
                        onClick={() => { setDeletePopup({ show: true, taskId: selectedTask.id }); handleCloseModal(); }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Task
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Main Content - Decreased width from 3 to 3 columns */}
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
                  className="text-2xl font-bold flex items-center"
                  style={{ color: colors.primary }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Task Scheduler
                </h1>
                <p className="mt-1 text-sm text-gray-600 font-medium">
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
                    {['Work', 'Personal', 'Team'].map((cat) => (
                      <button
                        key={cat}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          taskCategory === cat
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={{
                          backgroundColor:
                            taskCategory === cat
                              ? colors.primary
                              : colors.backgroundSecondary,
                          color: taskCategory === cat ? '#FFFFFF' : colors.text,
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

            {/* AI Command */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.primary }}
              >
                AI Command
              </label>
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

            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Response
              </h3>
              <div className="bg-white p-4 rounded-md border border-blue-100 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{promptRespone}</p>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-lg shadow-md border border-blue-100">
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setLogsExpanded(!logsExpanded)}
              >
                <h3 className="text-xl font-bold text-indigo-700 mb-0 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2H9M5 7h14M9 15H7a2 2 0 00-2 2v2a2 2 0 002 2h2v-2a2 2 0 002-2v-2a2 2 0 002 2z" />
                  </svg>
                  Logs
                </h3>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {logsExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              
              {logsExpanded && (
                <div className="mt-4 bg-white p-4 rounded-md border border-blue-100 shadow-sm">
                  <ul className="space-y-3 divide-y divide-gray-100">
                    {logs.map((log, index) => {
                      // Check if log contains specific patterns to apply different styling
                      const isToolExecution = log.includes("Executing tool:");
                      const isRetrieveAction = log.includes("retrieve") || log.includes("retrieving");
                      const isEmailLog = log.includes("email");
                      
                      return (
                        <li key={index} className={`pt-2 ${index > 0 ? 'mt-1' : ''}`}>
                          <div className="flex items-start">
                            <span className="mr-3 mt-0.5 flex-shrink-0">
                              {isToolExecution && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                              {isRetrieveAction && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                              {isEmailLog && !isToolExecution && !isRetrieveAction && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
                                </svg>
                              )}
                              {!isToolExecution && !isRetrieveAction && !isEmailLog && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed">{log}</p>
                              {isEmailLog && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {new Date().toLocaleTimeString()} - Email processing
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      </PaddingInternalPages>
    </ThemePage>
  );
}