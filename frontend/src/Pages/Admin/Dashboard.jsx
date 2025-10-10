import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../../Components/Admin/Card'
import { MainContext } from '../../ContextMain'

// Recharts
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts'

const COLORS = ['#4ade80', '#f59e0b', '#f97316', '#ef4444', '#60a5fa']

export default function Dashboard() {
    const { PaymentbaseUrl, OrderBaseUrl, CartBaseUrl, ProductBaseUrl, UserBaseUrl, BACKEND_URL } = useContext(MainContext)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [carts, setCarts] = useState([])
    const [orders, setOrders] = useState([])
    const [payments, setPayments] = useState([])
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setError(null)

        const fetchAll = async () => {
            try {
                const [cRes, oRes, pRes, prodRes, uRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}${CartBaseUrl}/get-admin`, { withCredentials: true }),
                    axios.get(`${BACKEND_URL}${OrderBaseUrl}/admin/get`, { withCredentials: true }),
                    axios.get(`${BACKEND_URL}${PaymentbaseUrl}/get`, { withCredentials: true }),
                    axios.get(`${BACKEND_URL}${ProductBaseUrl}/get-all`, { withCredentials: true }),
                    axios.post(`${BACKEND_URL}${UserBaseUrl}/find-all`, {}, { withCredentials: true }),
                ])

                if (!mounted) return
                setCarts(cRes.data?.data || cRes.data || [])
                setOrders(oRes.data?.data || oRes.data || [])
                setPayments(pRes.data?.FindPayment || pRes.data || [])
                setProducts(prodRes.data?.FindAllProduct || prodRes.data || [])
                setUsers(uRes.data?.FindAll || uRes.data || [])
            } catch (err) {
                console.error(err)
                if (!mounted) return
                setError('Failed to load dashboard data')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchAll()
        return () => (mounted = false)
    }, [BACKEND_URL, CartBaseUrl, OrderBaseUrl, PaymentbaseUrl, ProductBaseUrl, UserBaseUrl])

    // Helpers to build chart-friendly datasets
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const buildMonthlySeries = (items, dateKey = 'createdAt', valueKey = 'totalAmount') => {
        const map = Array.from({ length: 12 }, () => ({ count: 0, total: 0 }))
        items.forEach((it) => {
            const date = it[dateKey] ? new Date(it[dateKey]) : null
            if (!date || isNaN(date)) return
            const m = date.getMonth()
            const val = Number((it[valueKey] && it[valueKey].amount) || it[valueKey] || it.totalAmount || 0) || 0
            // assume paise if big number
            const normalized = val > 10000 ? val / 100 : val
            map[m].count += 1
            map[m].total += normalized
        })
        return map.map((m, i) => ({ month: months[i], orders: m.count, revenue: Math.round(m.total) }))
    }

    const paymentsStatusDistribution = (paymentsList) => {
        const dist = {}
        paymentsList.forEach((p) => {
            const st = (p.status || p.payment_status || (p.order && p.order.status) || 'unknown').toString()
            dist[st] = (dist[st] || 0) + 1
        })
        return Object.keys(dist).map((k) => ({ name: k, value: dist[k] }))
    }

    const usersGrowthSeries = (usersList) => {
        const map = Array.from({ length: 12 }, () => 0)
        usersList.forEach((u) => {
            const d = u.createdAt ? new Date(u.createdAt) : null
            if (!d || isNaN(d)) return
            map[d.getMonth()] += 1
        })
        return map.map((v, i) => ({ month: months[i], users: v }))
    }

    const monthlyOrders = buildMonthlySeries(orders, 'createdAt', 'totalAmount')
    const monthlyPayments = buildMonthlySeries(payments, 'createdAt', 'amount')
    const paymentsDistribution = paymentsStatusDistribution(payments)
    const usersGrowth = usersGrowthSeries(users)

    const money = (val) => {
        if (val == null) return '-'
        const v = typeof val === 'object' ? (val.amount ?? val) : val
        const value = v > 10000 ? v / 100 : v
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    }

    return (
        <Card>
            <div className="space-y-6">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                        <p className="text-sm text-gray-500">Visual insights — orders, payments, users and products (powered by Recharts)</p>
                    </div>
                </header>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                {/* Top metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Active Carts</div>
                        <div className="mt-2 text-2xl font-semibold">{loading ? '...' : carts.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Live carts in system</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Orders</div>
                        <div className="mt-2 text-2xl font-semibold">{loading ? '...' : orders.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Total orders</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Payments</div>
                        <div className="mt-2 text-2xl font-semibold">{loading ? '...' : payments.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Transactions</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Products</div>
                        <div className="mt-2 text-2xl font-semibold">{loading ? '...' : products.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Catalog size</div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Users</div>
                        <div className="mt-2 text-2xl font-semibold">{loading ? '...' : users.length}</div>
                        <div className="text-xs text-gray-400 mt-1">Registered users</div>
                    </div>
                </div>

                {/* Charts grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Trend (Line) */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <strong>Monthly Revenue</strong>
                            <span className="text-xs text-gray-400">This year</span>
                        </div>
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyOrders} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Revenue aggregated from orders (normalized)</div>
                    </div>

                    {/* Orders vs Payments (Bar) */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <strong>Orders vs Payments</strong>
                            <span className="text-xs text-gray-400">Monthly</span>
                        </div>
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyOrders} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="orders" stackId="a" barSize={12} />
                                    <Bar dataKey="revenue" stackId="a" barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Orders (count) and Revenue (value)</div>
                    </div>

                    {/* Payments distribution (Pie) */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <strong>Payment Status</strong>
                            <span className="text-xs text-gray-400">Summary</span>
                        </div>
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={paymentsDistribution} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={3} label>
                                        {paymentsDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Shows distribution across payment statuses</div>
                    </div>
                </div>

                {/* Users growth */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <strong>Users Growth (by month)</strong>
                        <span className="text-xs text-gray-400">Registrations</span>
                    </div>
                    <div style={{ height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usersGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa'" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#60a5fa'" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={0.2} fill="#93c5fd" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">User signups per month</div>
                </div>

                <div className="text-xs text-gray-400">* Charts use Recharts — ensure package `recharts` is installed (npm i recharts) and Card component provides padding background.</div>
            </div>
        </Card>
    )
}
