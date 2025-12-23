import { supabase } from './supabaseClient';

export interface VaccinationPatient {
    id: string;
    name: string;
    cns: string;
    birth_date: string; // YYYY-MM-DD
    created_at?: string;
    // Computed fields (optional in DB, calculated in frontend or view)
    age?: string;
    complianceRate?: number;
    delayedVaccines?: number;
    records?: VaccinationRecord[];
}

export interface Vaccine {
    id: string;
    name: string;
    batch: string;
    expiration_date: string;
    stock_level: number;
    status: 'Disponível' | 'Baixo' | 'Esgotado' | 'Vencido';
}

export interface VaccinationRecord {
    id: string;
    patient_id: string;
    vaccine_name: string;
    dose: string;
    date_applied?: string;
    date_scheduled?: string;
    status: 'Applied' | 'Scheduled' | 'Late';
    vaccinator?: string;
}

export const vaccinationService = {
    // Fetch all patients with their records
    async fetchPatients() {
        const { data, error } = await supabase
            .from('vaccination_patients')
            .select(`
        *,
        records:vaccination_records(*)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as VaccinationPatient[];
    },

    // Create a new patient
    async createPatient(patient: Omit<VaccinationPatient, 'id' | 'created_at' | 'records'>) {
        const { data, error } = await supabase
            .from('vaccination_patients')
            .insert([patient])
            .select()
            .single();

        if (error) throw error;
        return data as VaccinationPatient;
    },

    // Add a vaccination record (dose)
    async addRecord(record: Omit<VaccinationRecord, 'id'>) {
        const { data, error } = await supabase
            .from('vaccination_records')
            .insert([record])
            .select()
            .single();

        if (error) throw error;
        return data as VaccinationRecord;
    },

    // --- Stock Management ---

    async fetchVaccines() {
        const { data, error } = await supabase
            .from('vaccines')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Vaccine[];
    },

    async addVaccine(vaccine: Omit<Vaccine, 'id' | 'status' | 'created_at'>) {
        const { data, error } = await supabase
            .from('vaccines')
            .insert([vaccine])
            .select()
            .single();

        if (error) throw error;
        return data as Vaccine;
    },

    async updateStock(id: string, newLevel: number) {
        const { data, error } = await supabase
            .from('vaccines')
            .update({ stock_level: newLevel })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Vaccine;
    }
};
