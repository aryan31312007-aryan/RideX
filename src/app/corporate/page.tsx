"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, set, push } from "firebase/database";
import { Briefcase, CreditCard, Users, FileSpreadsheet, Plus, Upload, CheckCircle2, DollarSign, Calendar, Sparkles } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  type: string;
  status: string;
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  price: number;
  createdAt: string;
}

export default function CorporateDashboard() {
  const { user, profile, loading: authLoading } = useFirebase();
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empDept, setEmpDept] = useState("Logistics");
  const [empSuccess, setEmpSuccess] = useState(false);

  // Bulk dispatch
  const [bulkInput, setBulkInput] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Set page-level light mode background override
  useEffect(() => {
    const body = document.body;
    const prevBg = body.style.backgroundColor;
    const prevColor = body.style.color;
    
    body.style.backgroundColor = "#fafaff";
    body.style.color = "#0f172a";
    
    const html = document.documentElement;
    const hasDark = html.classList.contains("dark");
    if (hasDark) {
      html.classList.remove("dark");
    }

    return () => {
      body.style.backgroundColor = prevBg;
      body.style.color = prevColor;
      if (hasDark) {
        html.classList.add("dark");
      }
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Sync corporate employees
    const empRef = ref(db, `corporates/${user.uid}/employees`);
    const unsubscribeEmp = onValue(empRef, (snapshot) => {
      if (snapshot.exists()) {
        setEmployees(Object.values(snapshot.val()));
      } else {
        setEmployees([
          { id: "e1", name: "Pepper Potts", email: "pepper@stark.com", department: "Operations" },
          { id: "e2", name: "Happy Hogan", email: "happy@stark.com", department: "Security/Transit" }
        ]);
      }
    });

    // Sync all orders filtered by customerId
    const ordersRef = ref(db, "orders");
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const all = Object.values(snapshot.val()) as Order[];
        const corpOrders = all.filter((o) => o.customerId === user.uid);
        setOrders(corpOrders);
      } else {
        setOrders([]);
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    return () => {
      unsubscribeEmp();
      unsubscribeOrders();
    };
  }, [user, authLoading, profile, router]);

  // Add Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !empName || !empEmail) return;
    try {
      const empId = `emp_${Date.now()}`;
      const newEmp = { id: empId, name: empName, email: empEmail, department: empDept };
      await set(ref(db, `corporates/${user.uid}/employees/${empId}`), newEmp);
      
      setEmpSuccess(true);
      setEmpName("");
      setEmpEmail("");
      setTimeout(() => setEmpSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk batch dispatch simulation
  const handleBulkDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bulkInput) return;
    setBulkLoading(true);
    try {
      // Sample bulk items separated by newlines: "Pickup Address | Drop Address | Fare"
      const lines = bulkInput.split("\n").filter((l) => l.trim() !== "");
      
      for (const line of lines) {
        const parts = line.split("|");
        const pick = parts[0]?.trim() || "Headquarters";
        const dropAddr = parts[1]?.trim() || "Warehouse Hub B";
        const fareVal = parseFloat(parts[2]?.trim()) || 450;

        const newOrderRef = push(ref(db, "orders"));
        const orderId = newOrderRef.key || `bulk_${Date.now()}_${Math.random()}`;

        await set(ref(db, `orders/${orderId}`), {
          id: orderId,
          customerId: user.uid,
          customerName: profile?.companyName || "Stark Corp Client",
          type: "delivery",
          status: "pending",
          pickup: { address: pick, lat: 28.6139 + (Math.random() - 0.5) * 0.05, lng: 77.2090 + (Math.random() - 0.5) * 0.05 },
          drop: { address: dropAddr, lat: 28.6139 + (Math.random() - 0.5) * 0.05, lng: 77.2090 + (Math.random() - 0.5) * 0.05 },
          price: fareVal,
          vehicleType: "truck",
          parcelType: "heavy",
          createdAt: new Date().toISOString()
        });
      }

      setBulkSuccess(`Manifest Processed! Dispatched ${lines.length} orders successfully.`);
      setBulkInput("");
      setTimeout(() => setBulkSuccess(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setBulkLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-[#fafaff] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const creditUsed = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="w-full min-h-screen bg-[#fafaff] py-12 px-6 md:px-12 text-left relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/30 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-purple-650" />
              Corporate Logistics Portal
            </h1>
            <p className="text-xs text-slate-505 mt-1">
              Company profile: {profile?.companyName || "Stark Industries Logistics"}. Batch coordinate routes and employees invoicing.
            </p>
          </div>
        </div>

        {/* Corporate Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-light p-6 rounded-2xl border border-slate-200/60 flex items-center gap-4 bg-white/60">
            <div className="bg-purple-100 p-3.5 rounded-xl border border-purple-200 text-purple-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Credit Limit Available</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">
                ₹{((profile?.balance || 50000) - creditUsed).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="glass-card-light p-6 rounded-2xl border border-slate-200/60 flex items-center gap-4 bg-white/60">
            <div className="bg-blue-100 p-3.5 rounded-xl border border-blue-200 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Staff Authorized List</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{employees.length} Users</span>
            </div>
          </div>

          <div className="glass-card-light p-6 rounded-2xl border border-slate-200/60 flex items-center gap-4 bg-white/60">
            <div className="bg-emerald-100 p-3.5 rounded-xl border border-emerald-200 text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Invoiced Dispatches</span>
              <span className="text-xl font-extrabold text-slate-800 mt-1 block">{orders.length} Deliveries</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Bulk Dispatch sheet and Employees */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Bulk Dispatcher input */}
            <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col gap-4 bg-white/70">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                Batch Shipment Manifest Dispatcher
              </h3>
              
              {bulkSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> {bulkSuccess}
                </div>
              )}

              <form onSubmit={handleBulkDispatch} className="flex flex-col gap-3.5 text-xs text-left">
                <label className="text-slate-500 leading-relaxed block font-medium">
                  Paste delivery addresses. Separate lines using the format:<br />
                  <code className="text-purple-600 font-mono block mt-1.5 bg-slate-50 p-2 rounded border border-slate-200/50">
                    Pickup Location | Drop Destination | Est. Fare (INR)
                  </code>
                </label>
                <textarea
                  rows={5}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`e.g. Stark Tower A | Saket Depot | 450\nStark Tower A | Noida Cargo Terminal | 920`}
                  className="w-full px-3 py-2.5 rounded-xl glass-input-light text-slate-850 font-mono focus:outline-none resize-none text-xs border border-slate-200/80 bg-white"
                />
                <button
                  type="submit"
                  disabled={bulkLoading || !bulkInput}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-purple-500/10 text-xs"
                >
                  <Upload className="w-4 h-4" />
                  {bulkLoading ? "Dispatched Manifest..." : "Submit Batch Manifest Dispatch"}
                </button>
              </form>
            </div>

            {/* Roster list */}
            <div className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 bg-white/50">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Roster Authorized Employees</h3>
              <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                {employees.map((emp) => (
                  <div key={emp.id} className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{emp.name}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{emp.email}</p>
                    </div>
                    <span className="text-[9px] bg-white border border-slate-200/60 px-2 py-0.5 rounded text-slate-600 uppercase font-bold tracking-wider">
                      {emp.department}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Add Employee & Billing Invoices list */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Add Employee Form */}
            <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col gap-4 bg-white/70">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <Plus className="w-4 h-4 text-purple-600 animate-pulse" />
                Authorize Employee Account
              </h3>
              
              {empSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> Employee authorized successfully.
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="flex flex-col gap-3 text-xs text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-450 font-bold uppercase text-[9px] tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      placeholder="Pepper Potts"
                      className="px-3 py-2.5 rounded-xl glass-input-light text-slate-800 focus:outline-none text-xs border border-slate-200/80 bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-455 font-bold uppercase text-[9px] tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      placeholder="pepper@stark.com"
                      className="px-3 py-2.5 rounded-xl glass-input-light text-slate-800 focus:outline-none text-xs border border-slate-200/80 bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-455 font-bold uppercase text-[9px] tracking-wider">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="px-3 py-2.5 rounded-xl glass-input-light text-slate-800 focus:outline-none cursor-pointer text-xs border border-slate-200/80 bg-white"
                  >
                    <option value="Logistics" className="text-slate-800">Logistics & Supply Chain</option>
                    <option value="Operations" className="text-slate-800">Operations Control</option>
                    <option value="Procurement" className="text-slate-800">Procurement</option>
                    <option value="Executive" className="text-slate-800">Executive Office</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/10"
                >
                  Confirm Authorization
                </button>
              </form>
            </div>

            {/* Invoices List */}
            <div className="glass-card-light p-6 rounded-3xl border border-slate-200/60 flex flex-col gap-4 text-left bg-white/50">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Monthly Credit Invoices</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center font-medium">No logistics invoices generated for this period.</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[150px]">To: {ord.drop.address}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right font-extrabold text-slate-850 text-sm">
                        ₹{ord.price.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
