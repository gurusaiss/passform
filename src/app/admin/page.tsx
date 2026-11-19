"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Registration, RegistrationStatus } from "@/types";
import { defaultPlatformConfig } from "@/config/platform.config";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldAlert,
  Search,
  Download,
  Users,
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  ExternalLink,
  Sliders,
  Eye,
  X,
  Sparkles,
  Lock,
  MessageSquare,
  Settings,
  Save,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminPortal() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"registrations" | "settings">("registrations");

  // Data states
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAttendee, setSelectedAttendee] = useState<Registration | null>(null);

  // Settings states
  const [whatsappUrl, setWhatsappUrl] = useState(
    defaultPlatformConfig.onboarding.whatsappGroupUrl
  );
  const [isRegOpen, setIsRegOpen] = useState(
    defaultPlatformConfig.registration.isOpen
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  const fetchRegistrations = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch(
        `/api/admin/registrations?search=${encodeURIComponent(
          search
        )}&status=${statusFilter}&limit=100`
      );

      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoadingData(false);
        return;
      }

      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data || []);
        setTotalCount(json.total || 0);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Fetch registrations error:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [search, statusFilter]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        if (json.settings) {
          if (json.settings.whatsappGroupUrl) {
            setWhatsappUrl(json.settings.whatsappGroupUrl);
          }
          if (typeof json.settings.isRegistrationOpen === "boolean") {
            setIsRegOpen(json.settings.isRegistrationOpen);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, []);

  // Initial check on load
  useEffect(() => {
    fetchRegistrations();
    fetchSettings();
  }, [fetchRegistrations, fetchSettings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchRegistrations();
        fetchSettings();
      } else {
        setLoginError(data.message || "Invalid administrator credentials");
      }
    } catch {
      setLoginError("Network error during login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleStatusChange = async (
    referenceId: string,
    newStatus: RegistrationStatus
  ) => {
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceId, status: newStatus }),
      });

      if (res.ok) {
        fetchRegistrations();
        if (selectedAttendee && selectedAttendee.reference_id === referenceId) {
          setSelectedAttendee((prev) =>
            prev ? { ...prev, registration_status: newStatus } : null
          );
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSavedMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappGroupUrl: whatsappUrl,
          isRegistrationOpen: isRegOpen,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSavedMessage("Settings updated successfully!");
        setTimeout(() => setSettingsSavedMessage(""), 4000);
      } else {
        setSettingsSavedMessage(data.message || "Failed to update settings");
      }
    } catch {
      setSettingsSavedMessage("Network error saving settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.location.href = `/api/admin/export?status=${statusFilter}&search=${encodeURIComponent(
      search
    )}`;
  };

  // If unauthenticated, show clean password prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-slate-800 border border-slate-700 p-8 shadow-2xl text-white">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600/20 text-blue-400 mb-6 mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-center tracking-tight">
            Administrator Access
          </h2>
          <p className="text-slate-400 text-xs text-center mt-1 mb-6">
            Enter your administrative passkey to manage attendee records.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Admin passkey"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />

            {loginError && (
              <p className="text-xs text-red-400 font-medium text-center">
                {loginError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoggingIn}
              className="w-full font-bold"
            >
              Authenticate & Unlock Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  const confirmedCount = registrations.filter(
    (r) => r.registration_status === "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">
                Admin Console
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {defaultPlatformConfig.event.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="text-xs hidden sm:inline-flex">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Live Website
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Registrations
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCount}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Confirmed Passes
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {confirmedCount}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Capacity Status
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {Math.round(
                (totalCount /
                  (defaultPlatformConfig.registration.maxRegistrations || 500)) *
                  100
              )}
              %
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === "registrations"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Registrations ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Platform & Community Settings</span>
          </button>
        </div>

        {activeTab === "settings" ? (
          /* Settings Tab */
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Live Platform Configuration
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update community invitation URLs and registration status in real time. Changes take effect immediately.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* WhatsApp Link Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Official WhatsApp Group Invite Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    required
                    placeholder="https://chat.whatsapp.com/..."
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button type="button" variant="outline" size="sm" className="h-11 px-3">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Attendees will be directed to this invite link upon completing registration.
                </p>
              </div>

              {/* Registration Open/Closed Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRegOpen}
                    onChange={(e) => setIsRegOpen(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Registration Open
                    </span>
                    <p className="text-xs text-slate-500">
                      When unchecked, the public registration form is paused and visitors see a notice.
                    </p>
                  </div>
                </label>
              </div>

              {settingsSavedMessage && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{settingsSavedMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSavingSettings}
                  className="font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Platform Settings
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Registrations Tab */
          <>
            {/* Action Controls Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or reference..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="waitlisted">Waitlisted</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRegistrations}
                  isLoading={isLoadingData}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExportCsv}
                  className="text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Reference</th>
                      <th className="py-3.5 px-4">Attendee Name</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          {isLoadingData
                            ? "Loading registration records..."
                            : "No registration records found."}
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr
                          key={reg.id || reg.reference_id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {reg.reference_id}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {reg.full_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {reg.email}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                            {reg.phone}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              variant={
                                reg.registration_status === "confirmed"
                                  ? "success"
                                  : reg.registration_status === "attended"
                                  ? "info"
                                  : "neutral"
                              }
                            >
                              {reg.registration_status}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs">
                            {formatDate(reg.created_at)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAttendee(reg)}
                              className="h-8 px-2 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Attendee Details Modal */}
      {selectedAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedAttendee(null)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <Badge variant="info">Attendee Record</Badge>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedAttendee.full_name}
              </h3>
              <p className="text-xs font-mono text-blue-600 mt-0.5">
                {selectedAttendee.reference_id}
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm border-y border-slate-100 dark:border-slate-800 py-4">
              <div>
                <span className="text-slate-400 text-xs block">Email:</span>
                <span className="font-semibold">{selectedAttendee.email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">WhatsApp Phone:</span>
                <span className="font-semibold">{selectedAttendee.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Registered At:</span>
                <span>{formatDate(selectedAttendee.created_at)}</span>
              </div>

              {selectedAttendee.custom_fields &&
                Object.keys(selectedAttendee.custom_fields).length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-400 text-xs block mb-1">
                      Custom Application Fields:
                    </span>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 space-y-1.5 text-xs">
                      {Object.entries(selectedAttendee.custom_fields).map(
                        ([key, val]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize text-slate-500 font-medium">
                              {key}:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {String(val)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Quick Status Toggles */}
            <div className="mt-5 flex items-center justify-between gap-2">
              <div className="text-xs font-medium text-slate-500">
                Update Status:
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleStatusChange(selectedAttendee.reference_id, "attended")
                  }
                  className="text-xs"
                >
                  Mark Attended
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    handleStatusChange(selectedAttendee.reference_id, "confirmed")
                  }
                  className="text-xs"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
