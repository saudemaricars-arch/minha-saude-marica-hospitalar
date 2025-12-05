import { supabase } from './supabaseClient';
import { EmergencyPatient } from '../types';

export const emergencyService = {
    // Get active emergency visits for a unit
    async getActiveVisits(unitId: string) {
        const { data, error } = await supabase
            .from('emergency_visits')
            .select(`
        *,
        patient:patients(*)
      `)
            .eq('unit_id', unitId)
            .neq('status', 'alta') // Exclude discharged patients
            .order('arrival_time', { ascending: false });

        if (error) throw error;

        // Transform to match EmergencyPatient interface
        return data.map(visit => ({
            id: visit.id,
            patientId: visit.patient_id,
            name: visit.patient?.name || 'Desconhecido',
            age: visit.patient?.age,
            gender: visit.patient?.gender,
            cns: visit.patient?.cns,
            protocolNumber: visit.protocol_number,
            riskLevel: visit.risk_level,
            status: visit.status,
            chiefComplaint: visit.chief_complaint,
            arrivalTime: visit.arrival_time,
            waitTimeMinutes: visit.wait_time_minutes,
            location: visit.location
        })) as EmergencyPatient[];
    },

    // Create a new emergency visit (Check-in)
    async checkIn(patientId: string, unitId: string, complaint: string) {
        // Generate a simple protocol number (in prod use a sequence or UUID)
        const protocol = `EMG-${Date.now().toString().slice(-6)}`;

        const { data, error } = await supabase
            .from('emergency_visits')
            .insert({
                patient_id: patientId,
                unit_id: unitId,
                chief_complaint: complaint,
                status: 'aguardando_triagem',
                protocol_number: protocol,
                risk_level: 'blue', // Default
                arrival_time: new Date()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update triage info (Risk level)
    async triagePatient(visitId: string, riskLevel: string) {
        const { data, error } = await supabase
            .from('emergency_visits')
            .update({
                risk_level: riskLevel,
                status: 'aguardando_medico'
            })
            .eq('id', visitId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
