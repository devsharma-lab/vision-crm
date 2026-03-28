import React from 'react';
import { Quotation, Lead } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { FileText, Download, CheckCircle2, Clock, XCircle, MoreVertical, Plus } from 'lucide-react';

interface QuotationListProps {
  quotations: Quotation[];
  leads: Lead[];
  onAddQuotation: () => void;
  onDownloadPDF: (quotation: Quotation) => void;
}

export function QuotationList({ quotations, leads, onAddQuotation, onDownloadPDF }: QuotationListProps) {
  const getLeadName = (leadId: string) => leads.find(l => l.id === leadId)?.name || 'Unknown Lead';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SENT': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Quotations & Invoices</h2>
        <button 
          onClick={onAddQuotation}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all text-sm md:text-base"
        >
          <Plus size={18} />
          Create Quotation
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quotation Details</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lead</th>
                <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created On</th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <FileText size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] md:text-sm">QTN-{quotation.id.slice(0, 6)}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-xs md:text-sm font-bold text-slate-700 truncate max-w-[100px] block">{getLeadName(quotation.leadId)}</span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider", getStatusColor(quotation.status))}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <span className="font-bold text-slate-900 text-xs md:text-sm">{formatCurrency(quotation.totalAmount)}</span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span className="text-sm text-slate-500">{formatDate(quotation.createdAt)}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button 
                        onClick={() => onDownloadPDF(quotation)}
                        className="p-1.5 md:p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                        title="Download PDF"
                      >
                        <Download size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      <button className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                        <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
