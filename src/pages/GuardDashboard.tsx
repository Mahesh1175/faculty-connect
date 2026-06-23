import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { ScanLine, Download, RefreshCw, LogOut } from "lucide-react";
import GuardLogin from "@/components/GuardLogin";
import api from "@/utils/api";

const GuardDashboard = () => {
  const scanLock = useRef(false);

  const [logs, setLogs] = useState<any[]>([]);
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("guardAuth") === "true"
  );

// const [processing, setProcessing] = useState(false);

  const [scanning, setScanning] = useState(true);

  /* ==============================
     Fetch Logs
  ============================== */
  useEffect(() => {
    if (!isAuth) return;
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/visitors/guard/logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };
    fetchLogs();
  }, [isAuth]);

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
    // Prevent duplicate scans
    if (scanLock.current) return;

    scanLock.current = true;

    try {
      const res = await api.post("/api/visitors/verify", {
        id: text,
      });

      if (res.data.valid) {
        if (res.data.type === "checkout") {
          setLogs((prev) =>
            prev.map((log) =>
              log._id === res.data.visitor._id
                ? res.data.visitor
                : log
            )
          );

          toast.success("Checkout Successful 🏃");
        } else {
          setLogs((prev) => [
            res.data.visitor,
            ...prev,
          ]);

          toast.success("Entry Allowed ✅");
        }

        // Stop scanner after successful scan
        setScanning(false);

        try {
          await scanner.clear();
        } catch (err) {
          console.log("Scanner already cleared");
        }
      } else {
        toast.error(res.data.message || "Invalid QR ❌");

        // Allow next scan if invalid
        scanLock.current = false;
      }
    } catch (err) {
      toast.error("Scan failed ❌");

      // Allow next scan on error
      scanLock.current = false;
    }
  },
  () => {}
);

  // ✅ CLEANUP FIX
  return () => {
  scanLock.current = false;

  scanner
    .clear()
    .catch(() =>
      console.log("Scanner already cleared")
    );
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
     Helper: Duration
  ============================== */
  const getDuration = (inTime: string, outTime?: string) => {
    if (!outTime) return "In Campus ⏳";
    
    const diff = new Date(outTime).getTime() - new Date(inTime).getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
           onClick={() => {
  scanLock.current = false;
  setScanning(true);
}}
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
              <th className="p-2">Faculty</th>
              <th className="p-2 hidden md:table-cell">Mobile</th>
              <th className="p-2">In Time</th>
              <th className="p-2">Out Time</th>
              <th className="p-2">Duration</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((v) => (
              <tr key={v._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{v.visitorName}</td>
                <td className="p-2">{v.facultyName}</td>
                <td className="p-2 hidden md:table-cell">{v.mobile}</td>
                <td className="p-2 text-green-600 font-medium">
                  {v.checkedInAt ? new Date(v.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-2 text-rose-600 font-medium">
                  {v.checkedOutAt ? new Date(v.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="p-2 font-medium text-blue-600">
                  {v.checkedInAt ? getDuration(v.checkedInAt, v.checkedOutAt) : '-'}
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
