import re

file_path = "frontend/src/app/admin/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update activeTab
content = content.replace(
    'const [activeTab, setActiveTab] = useState<"products" | "quotes" | "ai3d" | "analytics">("products");',
    'const [activeTab, setActiveTab] = useState<"products" | "quotes" | "ai3d" | "analytics" | "sales" | "customers" | "purchases" | "staff">("products");'
)

# 2. Add ERP States
erp_states = """
  // ERP Data states
  const [sales, setSales] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
"""
content = content.replace(
    '  // AI 3D Reconstruction inputs',
    erp_states + '\n  // AI 3D Reconstruction inputs'
)

# 3. Add ERP Fetching logic
erp_fetch = """
  // Fetch ERP data
  useEffect(() => {
    if (!token) return;
    const fetchErpData = async () => {
      try {
        const [salesRes, custRes, purchRes, staffRes] = await Promise.all([
          fetch(`${API_URL}/api/erp/sales`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/erp/customers`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/erp/purchases`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/erp/staff`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (salesRes.ok) setSales(await salesRes.json());
        if (custRes.ok) setCustomers(await custRes.json());
        if (purchRes.ok) setPurchases(await purchRes.json());
        if (staffRes.ok) setStaff(await staffRes.json());
      } catch (err) {
        console.error("Error loading ERP data:", err);
      }
    };
    fetchErpData();
  }, [token]);
"""
content = content.replace(
    '  // Handle Quote Status Edit',
    erp_fetch + '\n  // Handle Quote Status Edit'
)

# 4. Add Tab Buttons in Sidebar
sidebar_tabs = """
            <nav className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "products" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <Layers size={18} /> Catalog
              </button>
              <button
                onClick={() => setActiveTab("quotes")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "quotes" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <ListTodo size={18} /> Quotes
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "sales" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <FileSpreadsheet size={18} /> Sales
              </button>
              <button
                onClick={() => setActiveTab("customers")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "customers" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <BarChart2 size={18} /> Customers
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "purchases" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <ShieldCheck size={18} /> Purchases
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${activeTab === "staff" ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                <Lock size={18} /> Staff Roles
              </button>
"""
# Replace the existing nav structure
content = re.sub(
    r'<nav className="mt-8 flex flex-col gap-2">.*?</nav>',
    sidebar_tabs + '\n            </nav>',
    content,
    flags=re.DOTALL
)

# 5. Render Tab Content
tab_render = """
          {/* ERP: Sales Tab */}
          {activeTab === "sales" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-light text-white mb-6">Sales & Orders</h2>
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/50 text-neutral-400">
                  <tr>
                    <th className="p-4 font-medium rounded-l-lg">ID</th>
                    <th className="p-4 font-medium">Customer ID</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-b border-neutral-800/50">
                      <td className="p-4">#{s.id}</td>
                      <td className="p-4">{s.customer_id}</td>
                      <td className="p-4">${s.total_amount}</td>
                      <td className="p-4">{s.status}</td>
                      <td className="p-4">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-neutral-500">No sales found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ERP: Customers Tab */}
          {activeTab === "customers" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-light text-white mb-6">Customers</h2>
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/50 text-neutral-400">
                  <tr>
                    <th className="p-4 font-medium rounded-l-lg">ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Company</th>
                    <th className="p-4 font-medium rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-neutral-800/50">
                      <td className="p-4">#{c.id}</td>
                      <td className="p-4">{c.name}</td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4">{c.company || "-"}</td>
                      <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-neutral-500">No customers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ERP: Purchases Tab */}
          {activeTab === "purchases" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-light text-white mb-6">Inventory Purchases</h2>
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/50 text-neutral-400">
                  <tr>
                    <th className="p-4 font-medium rounded-l-lg">ID</th>
                    <th className="p-4 font-medium">Supplier</th>
                    <th className="p-4 font-medium">Item</th>
                    <th className="p-4 font-medium">Cost</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-800/50">
                      <td className="p-4">#{p.id}</td>
                      <td className="p-4">{p.supplier_name}</td>
                      <td className="p-4">{p.item}</td>
                      <td className="p-4">${p.cost}</td>
                      <td className="p-4">{p.status}</td>
                      <td className="p-4">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {purchases.length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-neutral-500">No purchases found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ERP: Staff Tab */}
          {activeTab === "staff" && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-2xl font-light text-white mb-6">Staff & Permissions</h2>
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/50 text-neutral-400">
                  <tr>
                    <th className="p-4 font-medium rounded-l-lg">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Products</th>
                    <th className="p-4 font-medium">Sales</th>
                    <th className="p-4 font-medium">Customers</th>
                    <th className="p-4 font-medium">Purchases</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-b border-neutral-800/50">
                      <td className="p-4">{s.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-white/10 rounded-md text-xs">{s.role}</span>
                      </td>
                      <td className="p-4">{s.can_manage_products ? "✅" : "❌"}</td>
                      <td className="p-4">{s.can_manage_sales ? "✅" : "❌"}</td>
                      <td className="p-4">{s.can_manage_customers ? "✅" : "❌"}</td>
                      <td className="p-4">{s.can_manage_purchases ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr><td colSpan={6} className="p-4 text-center text-neutral-500">No staff found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
"""

content = content.replace(
    '{/* --- Main Working Area --- */}',
    '{/* --- Main Working Area --- */}\n' + tab_render
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched admin page successfully.")
