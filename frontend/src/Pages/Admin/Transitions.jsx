import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MainContext } from '../../ContextMain'

export default function TransitionsTable() {
    const { PaymentbaseUrl, BACKEND_URL } = useContext(MainContext)
    const [transitions, setTransitions] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        axios
            .get(BACKEND_URL + PaymentbaseUrl + '/get', { withCredentials: true })
            .then((res) => {
                if (!mounted) return
                setTransitions(res.data.FindPayment || [])
            })
            .catch((err) => console.error(err))
            .finally(() => mounted && setLoading(false))

        return () => (mounted = false)
    }, [BACKEND_URL, PaymentbaseUrl])

    const formatCurrency = (amountObj) => {
        if (!amountObj) return '-'
        try {
            const amt = amountObj.amount ?? amountObj
            // assuming amount is in paise (e.g., 899900 -> 8999.00) OR already in rupees.
            // If your backend returns paise, divide by 100. Adjust as needed.
            const value = amt > 10000 ? amt / 100 : amt
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: amountObj.currency || 'INR' }).format(value)
        } catch (e) {
            return amountObj
        }
    }

    const formatDate = (iso) => {
        if (!iso) return '-'
        const d = new Date(iso)
        return d.toLocaleString('en-IN')
    }

    const getProductsSummary = (order) => {
        if (!order) return '-'
        const items = order.product_detail || []
        if (items.length === 0) return '-'
        if (items.length === 1) return items[0].name || items[0].title || items[0].slug
        return `${items[0].name || items[0].title || items[0].slug} + ${items.length - 1} more`
    }

    async function handleDelete(paymentId) {
        const ok = window.confirm('Delete this payment record? This action cannot be undone.')
        if (!ok) return
        try {
            setDeletingId(paymentId)
            await axios.delete(`${BACKEND_URL}${PaymentbaseUrl}/delete/${paymentId}`, { withCredentials: true })
            setTransitions((prev) => prev.filter((p) => p._id !== paymentId && p.razorpay_payment_id !== paymentId))
        } catch (err) {
            console.error(err)
            alert('Failed to delete. See console for details.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Payments</h2>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : transitions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                                    No payments found
                                </td>
                            </tr>
                        ) : (
                            transitions.map((t) => {
                                const paymentId = t._id || t.razorpay_payment_id || t.razorpay_order_id
                                const orderId = t.order?._id || t.order?.razorpay_order_id || '-'
                                const user = t.user || t.order?.user || {}
                                return (
                                    <tr key={paymentId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="font-medium text-gray-800">{paymentId}</div>
                                            <div className="text-xs text-gray-400">{t.razorpay_payment_id ? 'razorpay' : t.order?.order_payment_type || 'N/A'}</div>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="text-gray-700">{getProductsSummary(t.order)}</div>
                                            <div className="text-xs text-gray-400">Order: {orderId}</div>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="font-medium text-gray-800">{user.name || user.email || '-'}</div>
                                            <div className="text-xs text-gray-400">{user.email || user.phone || '-'}</div>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <div className="font-medium">{formatCurrency(t.amount ?? t.order?.totalAmount ?? t.totalAmount)}</div>
                                            <div className="text-xs text-gray-400">{t.amount?.currency || (t.order?.currency || 'INR')}</div>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${t.status === 'completed' || t.status === 'paid' ? 'bg-green-100 text-green-800' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {t.status || t.order?.status || 'unknown'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(t.createdAt ?? t.updatedAt ?? t.order?.createdAt)}</td>

                                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                            <button
                                                onClick={() => handleDelete(paymentId)}
                                                disabled={deletingId === paymentId}
                                                className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm hover:bg-red-100 transition"
                                            >
                                                {deletingId === paymentId ? (
                                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-3 text-xs text-gray-400">Showing most relevant fields — Payment ID, order summary, user, amount, status and created time.</p>
        </div>
    )
}
