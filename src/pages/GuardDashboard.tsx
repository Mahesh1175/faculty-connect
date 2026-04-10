import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { ScanLine, Download, RefreshCw, LogOut } from "lucide-react";
import GuardLogin from "@/components/GuardLogin";
import api from "@/utils/api";

const GuardDashboard = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("guardAuth") === "true"
  );

  const [scanning, setScanning] = useState(true);

  /* ==============================
     Scanner Logic
  ============================== */
 useEffect(() => {
  if (!isAuth || !scanning) return;

  const scanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: 250 },
    false
  );

  scanner.render(
    async (text) => {
      try {
        const res = await api.post(
          "/api/visitors/verify",
          { id: text }
        );

        if (res.data.valid) {
          setLogs((prev) => [res.data.visitor, ...prev]);
          toast.success("Entry Allowed ✅");

          setScanning(false);
          scanner.clear();
        } else {
          toast.error("Invalid QR ❌");
        }
      } catch {
        toast.error("Scan failed ❌");
      }
    },
    () => {}
  );

  // ✅ CLEANUP FIX
  return () => {
    void scanner.clear(); // ⭐ correct
  };
}, [isAuth, scanning]);


  /* ==============================
     Excel Export
  ============================== */
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(logs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([excelBuffer]), "visitor_logs.xlsx");
  };

  /* ==============================
     Show login first
  ============================== */
  if (!isAuth) return <GuardLogin onLogin={() => setIsAuth(true)} />;

  /* ==============================
     UI
  ============================== */
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold flex gap-2 items-center">
          <ScanLine /> Guard Panel
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setScanning(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <RefreshCw size={18} /> Scan Again
          </button>

          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            <Download size={18} /> Excel
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("guardAuth");
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Scanner */}
      {scanning && (
        <div className="bg-white rounded-2xl shadow p-4">
          <div id="reader" />
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Visitor</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Faculty</th>
              <th className="p-2 hidden md:table-cell">Reason</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((v) => (
              <tr key={v._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{v.visitorName}</td>
                <td className="p-2">{v.mobile}</td>
                <td className="p-2">{v.facultyName}</td>
                <td className="p-2 hidden md:table-cell">{v.reason}</td>
                <td className="p-2">
                  {new Date(v.checkedInAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuardDashboard;
