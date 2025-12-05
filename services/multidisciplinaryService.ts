import { supabase } from './supabaseClient';

export interface MultidisciplinaryAppointment {
    id: string;
    patient_name: string;
    patient_id?: string;
    specialty: 'Fisioterapia' | 'Psicologia' | 'Fonoaudiologia' | 'Social' | 'Nutrição';
    professional: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status: 'scheduled' | 'checked-in' | 'completed' | 'canceled';
    notes?: string;
    unit_id?: string;
    created_at?: string;
}

export const multidisciplinaryService = {
    // Fetch appointments with optional filters
    async fetchAppointments(date?: string, specialty?: string) {
        let query = supabase
            .from('multidisciplinary_appointments')
            .select('*')
            .order('time', { ascending: true });

        if (date) {
            query = query.eq('date', date);
        }

        if (specialty && specialty !== 'Todos') {
            query = query.eq('specialty', specialty);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }

        return data as MultidisciplinaryAppointment[];
    },

    // Create a new appointment
    async createAppointment(appointment: Omit<MultidisciplinaryAppointment, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('multidisciplinary_appointments')
            .insert([appointment])
            .select()
            .single();

        if (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }

        return data as MultidisciplinaryAppointment;
    },

    // Update an appointment (status, notes, etc.)
    async updateAppointment(id: string, updates: Partial<MultidisciplinaryAppointment>) {
        const { data, error } = await supabase
            .from('multidisciplinary_appointments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }

        return data as MultidisciplinaryAppointment;
    },

    // Delete an appointment
    async deleteAppointment(id: string) {
        const { error } = await supabase
            .from('multidisciplinary_appointments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting appointment:', error);
            throw error;
        }
    }
};
