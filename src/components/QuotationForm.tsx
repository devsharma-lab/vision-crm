import React from 'react';
import { Lead, Quotation } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { X, Save, Plus, Trash2, FileText, IndianRupee } from 'lucide-react';

interface QuotationFormProps {
  lead: Lead;
  onClose: () => void;
  onSubmit: (data: Partial<Quotation>) => void;
}

export function QuotationForm({ lead, onClose, onSubmit }: QuotationFormProps) {
  const [items, setItems] = React.useState<{ description: string; quantity: number; price: number }[]>([
    { description: '', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      leadId: lead.id,
      items,
      totalAmount,
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Create Quotation</h2>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">For: {lead.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3 text-right">Price</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4 md:space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-100 md:border-none">
                  <div className="w-full md:col-span-6">
                    <label className="md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 block">Description</label>
                    <input 
                      type="text" 
                      required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 md:px-4 py-2 bg-white md:bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      placeholder="Item description..."
                    />
                  </div>
                  <div className="flex gap-3 w-full md:col-span-5">
                    <div className="flex-1 md:col-span-2">
                      <label className="md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 block">Qty</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-full px-3 md:px-4 py-2 bg-white md:bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="flex-[2] md:col-span-3 relative">
                      <label className="md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 block">Price</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          required
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                          className="w-full pl-8 pr-3 md:pr-4 py-2 bg-white md:bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-right"
                        />
                        <IndianRupee className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:col-span-1 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="flex items-center gap-2 md:block p-2 text-rose-600 md:text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                      <span className="md:hidden text-xs font-bold">Remove Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline px-2"
            >
              <Plus size={16} />
              Add Another Item
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs md:text-sm">Total Amount</span>
              <span className="text-xl md:text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 md:py-4 bg-white border border-slate-200 text-slate-700 rounded-xl md:rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm md:text-base"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-6 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Save size={18} className="md:w-5 md:h-5" />
                Save Quotation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
