"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/context/FirebaseContext";
import { db } from "@/utils/firebase";
import { ref, onValue, set, push } from "firebase/database";
import { Briefcase, CreditCard, Users, FileSpreadsheet, Plus, Upload, CheckCircle2, DollarSign, Calendar } from "lucide-react";

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

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (profile && profile.role !== "corporate") {
      // Allow testing but alert
      console.log("Logged in profile is not corporate. Allowed for test sandbox.");
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
      <div className="w-full min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const creditUsed = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="w-full min-h-screen bg-gray-950 grid-bg py-12 px-6 md:px-12 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-primary" />
              Corporate Logistics Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Company profile: {profile?.companyName || "Stark Industries Logistics"}. Batch coordinate routes and employees invoicing.
            </p>
          </div>
        </div>

        {/* Corporate Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="bg-primary/20 p-3.5 rounded-xl border border-primary/30 text-primary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Credit Limit Available</span>
              <span className="text-xl font-extrabold text-white mt-1 block">
                ₹{((profile?.balance || 50000) - creditUsed).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="bg-green-500/20 p-3.5 rounded-xl border border-green-500/30 text-green-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Staff Authorized List</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{employees.length} Users</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3.5 rounded-xl border border-yellow-500/30 text-yellow-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Invoiced Dispatches</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{orders.length} Deliveries</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Bulk Dispatch sheet and Employees */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Bulk Dispatcher input */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Batch Shipment Manifest Dispatcher
              </h3>
              
              {bulkSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> {bulkSuccess}
                </div>
              )}

              <form onSubmit={handleBulkDispatch} className="flex flex-col gap-3.5 text-xs">
                <label className="text-gray-400 leading-relaxed block">
                  Paste delivery addresses. Separate lines using the format:<br />
                  <code className="text-primary font-mono block mt-1.5 bg-white/5 p-2 rounded border border-white/5">
                    Pickup Location | Drop Destination | Est. Fare (INR)
                  </code>
                </label>
                <textarea
                  rows={5}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`e.g. Stark Tower A | Saket Depot | 450&#10;Stark Tower A | Noida Cargo Terminal | 920`}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-white font-mono focus:outline-none resize-none text-xs"
                />
                <button
                  type="submit"
                  disabled={bulkLoading || !bulkInput}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {bulkLoading ? "Dispatched Manifest..." : "Submit Batch Manifest Dispatch"}
                </button>
              </form>
            </div>

            {/* Roster list */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white">Roster Authorized Employees</h3>
              <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                {employees.map((emp) => (
                  <div key={emp.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{emp.name}</p>
                      <p className="text-gray-400 mt-0.5">{emp.email}</p>
                    </div>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 uppercase font-bold">
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
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary animate-pulse" />
                Authorize Employee Account
              </h3>
              
              {empSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0" /> Employee authorized successfully.
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="flex flex-col gap-3 text-xs text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      placeholder="Pepper Potts"
                      className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[9px]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      placeholder="pepper@stark.com"
                      className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-bold uppercase text-[9px]">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="px-3 py-2.5 rounded-xl glass-input text-white focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="Logistics" className="bg-gray-950">Logistics & Supply Chain</option>
                    <option value="Operations" className="bg-gray-950">Operations Control</option>
                    <option value="Procurement" className="bg-gray-950">Procurement</option>
                    <option value="Executive" className="bg-gray-950">Executive Office</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Confirm Authorization
                </button>
              </form>
            </div>

            {/* Invoices List */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col gap-4 text-left">
              <h3 className="text-sm font-extrabold text-white">Monthly Credit Invoices</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No logistics invoices generated for this period.</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white truncate max-w-[150px]">To: {ord.drop.address}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right font-bold text-white">
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
