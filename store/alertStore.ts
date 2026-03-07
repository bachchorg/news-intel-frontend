import { create } from 'zustand';
import { SpikeAlert } from '@/types/analytics';

interface AlertStore {
  alerts: SpikeAlert[];
  addAlert: (alert: SpikeAlert) => void;
  dismissAlert: (keyword: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 10) })),
  dismissAlert: (keyword) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.keyword !== keyword) })),
  clearAlerts: () => set({ alerts: [] }),
}));
