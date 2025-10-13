import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const tableData = [
  { id: "INV-001", client: "Aurora Labs", status: "Paid", amount: "$4,500", issuedOn: "02 Apr 2024" },
  { id: "INV-002", client: "Summit Co.", status: "Pending", amount: "$2,150", issuedOn: "18 Apr 2024" },
  { id: "INV-003", client: "Nimbus Works", status: "Overdue", amount: "$6,980", issuedOn: "30 Mar 2024" },
  { id: "INV-004", client: "Lumen Studio", status: "Paid", amount: "$3,240", issuedOn: "11 Apr 2024" },
  { id: "INV-005", client: "Northwind", status: "Pending", amount: "$1,890", issuedOn: "25 Apr 2024" },
];

const statusStyles = {
  Paid: "text-emerald-600 bg-emerald-50",
  Pending: "text-amber-600 bg-amber-50",
  Overdue: "text-rose-600 bg-rose-50",
};

const AddTable = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Operations</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Invoice Overview</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          This module summarises current billing activity with dummy data so you can preview how tabular insights will render inside
          {" "}
          the admin experience.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Recent invoices with their billing state and amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-border)] text-left text-sm">
              <thead className="bg-[var(--color-muted)] text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Invoice</th>
                  <th scope="col" className="px-4 py-3">Client</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Issued on</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-white">
                {tableData.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{item.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.client}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[item.status] ?? "text-slate-600 bg-slate-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.amount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.issuedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTable;
