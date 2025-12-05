import { supabase } from './supabaseClient';

export interface DiseaseNotification {
    id: string;
    disease: string;
    patient_name: string;
    notification_date: string;
    status: 'suspeito' | 'confirmado' | 'descartado';
    investigation_status: 'em_andamento' | 'concluido';
    week?: number;
    unit_id?: string;
    created_at?: string;
}

export const agravosService = {
    // Fetch all notifications
    async fetchNotifications() {
        const { data, error } = await supabase
            .from('disease_notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as DiseaseNotification[];
    },

    // Create a new notification
    async createNotification(notification: Omit<DiseaseNotification, 'id' | 'created_at' | 'status' | 'investigation_status'>) {
        const { data, error } = await supabase
            .from('disease_notifications')
            .insert([{
                ...notification,
                status: 'suspeito',
                investigation_status: 'em_andamento',
                week: getEpidemiologicalWeek(new Date())
            }])
            .select()
            .single();

        if (error) throw error;
        return data as DiseaseNotification;
    }
};

// Helper to calculate epidemiological week (simple approximation)
function getEpidemiologicalWeek(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}
