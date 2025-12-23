import { supabase } from './supabaseClient';
import { Bed } from '../types';

export const bedService = {
    // Get all beds for a specific unit
    async getBedsByUnit(unitId: string) {
        const { data, error } = await supabase
            .from('beds')
            .select(`
        *,
        patient:patients(*)
      `)
            .eq('unit_id', unitId)
            .order('code');

        if (error) throw error;

        // Transform data to match frontend Bed type if necessary
        // The query above fetches the joined patient data into a 'patient' property
        return data.map(bed => ({
            ...bed,
            patientName: bed.patient?.name, // Map joined patient name to flat structure if needed
            patientGender: bed.patient?.gender,
            patientAge: bed.patient?.age
        })) as Bed[];
    },

    // Update bed status (e.g., occupy, free, clean)
    async updateBedStatus(bedId: string, status: string, patientId?: string | null) {
        const updateData: any = { status, updated_at: new Date() };

        if (status === 'disponivel') {
            updateData.current_patient_id = null;
        } else if (patientId) {
            updateData.current_patient_id = patientId;
        }

        const { data, error } = await supabase
            .from('beds')
            .update(updateData)
            .eq('id', bedId)
            .select()
            .single();

        if (error) throw error;
        return data as Bed;
    }
};
