import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  X, 
  CheckCheck, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { CustomerNotification, Customer } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CustomerNotification[];
  customers: Customer[];
  onSendManualNotification: (notif: Partial<CustomerNotification>) => Promise<any>;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  customers,
  onSendManualNotification
}) => {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'compose'>('inbox');
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.companyName || 'PT Indofood Sukses Makmur Tbk');
  const [containerNo, setContainerNo] = useState('SPIL-892103-4');
  const [eventType, setEventType] = useState<'gate_in' | 'gate_out' | 'discharged' | 'loaded' | 'customs_cleared'>('gate_out');
  const [channel, setChannel] = useState<'WhatsApp' | 'Email' | 'Both'>('WhatsApp');
  const [customNotes, setCustomNotes] = useState('Supir: Bambang Supriyanto (B 9812 UEN). Estimasi tiba di pabrik Cikarang 14:30 WIB.');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const matchedCust = customers.find(c => c.companyName === selectedCustomer) || customers[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const titleMap = {
      gate_in: 'Konfirmasi Gate-In Peti Kemas di Terminal',
      gate_out: 'Notifikasi Gate-Out & Pengantaran Truk (On Road)',
      discharged: 'Peti Kemas Selesai Dibongkar dari Kapal',
      loaded: 'Peti Kemas Telah Dimuat ke Kapal Pelayaran',
      customs_cleared: 'Persetujuan Bea Cukai SPPB Selesai'
    };

    const message = `Halo ${matchedCust?.picName || 'Bapak/Ibu'}, notifikasi resmi dari PT Pelayaran & Terminal Peti Kemas: Peti kemas ${containerNo} berstatus ${titleMap[eventType]}. Catatan: ${customNotes}. Pantau realtime via portal TOS. Terima kasih.`;

    await onSendManualNotification({
      customerName: matchedCust?.companyName || selectedCustomer,
      customerPhone: matchedCust?.whatsappNumber || '+6281234567890',
      customerEmail: matchedCust?.email || 'ops@customer.com',
      recipientName: matchedCust?.companyName || selectedCustomer,
      recipientPhone: matchedCust?.whatsappNumber || '+6281234567890',
      recipientEmail: matchedCust?.email || 'ops@customer.com',
      channel: channel === 'Both' ? 'WhatsApp' : channel,
      eventType: eventType === 'gate_in' ? 'GATE_IN_CONFIRMED' :
                 eventType === 'gate_out' ? 'GATE_OUT_DELIVERY' :
                 eventType === 'discharged' ? 'DISCHARGE_COMPLETED' :
                 eventType === 'loaded' ? 'TRUCK_ON_WAY' : 'CUSTOMS_CLEARED',
      containerNo: containerNo,
      title: titleMap[eventType],
      message: message,
      status: 'Delivered'
    });

    setIsSending(false);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setActiveSubTab('inbox');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Pusat Notifikasi Otomatis Pelanggan (WhatsApp & Email)
              </h3>
              <p className="text-xs text-slate-400">
                Layanan pengiriman notifikasi otomatis status kargo dan pengiriman real-time ke Shipper
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'inbox'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Notifikasi Terkirim ({notifications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('compose')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
              activeSubTab === 'compose'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Notifikasi Manual</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          {activeSubTab === 'inbox' ? (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  Belum ada riwayat notifikasi.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-md ${
                          notif.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notif.channel === 'WhatsApp' ? <Phone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                        </span>
                        <div>
                          <strong className="text-slate-900 font-semibold text-xs">{notif.customerName || notif.recipientName}</strong>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {notif.customerPhone || notif.recipientPhone} • {notif.sentAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        <span>{notif.status} (Delivered)</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-blue-900 pt-1">
                      {notif.title}
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>No Kontainer Terkait: <strong className="font-mono text-slate-800">{notif.containerNo}</strong></span>
                      <span className="text-emerald-700 font-medium">Gateway WhatsApp TOS Api Aktif</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {sentSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-800 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Notifikasi WhatsApp berhasil dikirimkan ke nomor pelanggan!</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Pelanggan / Shipper Penerima
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.companyName}>
                      {c.companyName} ({c.picName} - {c.whatsappNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kanal Pengiriman</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="WhatsApp">WhatsApp Gateway Resmi</option>
                    <option value="Email">Email Notifikasi</option>
                    <option value="Both">Keduanya (WhatsApp + Email)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pemicu Status Kargo (Event)</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="gate_out">Gate-Out (Truk Berangkat)</option>
                    <option value="gate_in">Gate-In (Tiba di Terminal)</option>
                    <option value="discharged">Bongkar dari Kapal (Discharge)</option>
                    <option value="loaded">Dimuat ke Kapal (Loading)</option>
                    <option value="customs_cleared">Customs SPPB Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Peti Kemas</label>
                <input
                  type="text"
                  required
                  value={containerNo}
                  onChange={(e) => setContainerNo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan & Info Driver</label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Supir: Bambang Supriyanto (B 9812 UEN). Estimasi tiba di pabrik Cikarang 14:30 WIB."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('inbox')}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pesan WhatsApp Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
