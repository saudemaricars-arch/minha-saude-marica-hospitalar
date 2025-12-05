import { supabase } from './supabaseClient';

export interface MaternityVisit {
    id: string;
    room: string;
    mother_name: string;
    baby_name?: string;
    days_post_partum: number;
    type: string; // 'PC', 'PN'
    risk_level: 'Alto' | 'Médio' | 'Baixo';
    status: 'pendente' | 'realizada';
    alerts?: string[];
    unit_id?: string;
    created_at?: string;
}

export const maternityService = {
    // Fetch all visits
    async fetchVisits() {
        const { data, error } = await supabase
            .from('maternity_visits')
            .select('*')
            .order('room', { ascending: true }); // Order by room usually makes sense for rounds

        if (error) throw error;
        return data as MaternityVisit[];
    },

    // Create a new visit (admission of puerpera)
    async createVisit(visit: Omit<MaternityVisit, 'id' | 'created_at' | 'alerts' | 'status'>) {
        const { data, error } = await supabase
            .from('maternity_visits')
            .insert([{
                ...visit,
                status: 'pendente',
                alerts: [] // Default no alerts
            }])
            .select()
            .single();

        if (error) throw error;
        return data as MaternityVisit;
    },

    // Update visit status (e.g. mark as done)
    async updateStatus(id: string, status: 'pendente' | 'realizada') {
        const { data, error } = await supabase
            .from('maternity_visits')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as MaternityVisit;
    }
};
