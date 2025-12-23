import { supabase } from './supabaseClient';
import { Patient, EmergencyPatient } from '../types';

export const patientService = {
    // Get all patients (optionally filter by unit if needed, though patients are usually global)
    async getPatients() {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Patient[];
    },

    // Get a single patient by ID
    async getPatientById(id: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Patient;
    },

    // Search patients by name or CNS
    async searchPatients(query: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .or(`name.ilike.%${query}%,cns.ilike.%${query}%`)
            .limit(20);

        if (error) throw error;
        return data as Patient[];
    },

    // Create a new patient
    async createPatient(patient: Omit<Patient, 'id'>) {
        const { data, error } = await supabase
            .from('patients')
            .insert(patient)
            .select()
            .single();

        if (error) throw error;
        return data as Patient;
    }
};
