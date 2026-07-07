import React from "react";

const fmtRs = (n) => {
  const v = parseFloat(n) || 0;
  return "₹ " + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MIN_ROWS = 6;

export default function InvoiceTable({ items }) {
  const fillers = Math.max(0, MIN_ROWS - items.length);

  return (
    <div className="w-full">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr style={{ background: "#d71920", color: "#fff" }}>
            <th className="py-2 px-2 text-center font-bold border border-red-700 w-7">#</th>
            <th className="py-2 px-3 text-left font-bold border border-red-700">Item Name</th>
            <th className="py-2 px-2 text-center font-bold border border-red-700 w-16">HSN/SAC</th>
            <th className="py-2 px-2 text-center font-bold border border-red-700 w-16">Quantity</th>
            <th className="py-2 px-2 text-right font-bold border border-red-700 w-20">Price/Unit</th>
            <th className="py-2 px-2 text-right font-bold border border-red-700 w-28">GST</th>
            <th className="py-2 px-2 text-right font-bold border border-red-700 w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const gstPct = (parseFloat(item.CGST) || 0) + (parseFloat(item.SGST) || 0);
            const itemGst =
              parseFloat(item.GST_Amount) ||
              (parseFloat(item.Total_Amount) - parseFloat(item.Sub_Total)) ||
              0;
            return (
              <tr
                key={item.Sale_ID || i}
                className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-1.5 px-2 text-center border border-gray-200">{i + 1}</td>
                <td className="py-1.5 px-3 text-left border border-gray-200">{item.Product_Name}</td>
                <td className="py-1.5 px-2 text-center border border-gray-200">{item.HSN_SAC || ""}</td>
                <td className="py-1.5 px-2 text-center border border-gray-200">{item.Quantity}</td>
                <td className="py-1.5 px-2 text-right border border-gray-200">
                  ₹ {parseFloat(item.Price).toFixed(1)}
                </td>
                <td className="py-1.5 px-2 text-right border border-gray-200">
                  {fmtRs(itemGst)} ({gstPct}.0%)
                </td>
                <td className="py-1.5 px-2 text-right border border-gray-200">
                  {fmtRs(item.Total_Amount)}
                </td>
              </tr>
            );
          })}
          {Array.from({ length: fillers }).map((_, i) => (
            <tr key={"f" + i} className={((items.length + i) % 2 === 1) ? "bg-gray-50" : "bg-white"}>
              {[...Array(7)].map((_, j) => (
                <td key={j} className="py-1.5 px-2 border border-gray-200 h-7">&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
