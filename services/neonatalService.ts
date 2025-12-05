import { supabase } from './supabaseClient';

export interface NeonatalTest {
    status: 'Normal' | 'Alterado' | 'Inconclusivo' | 'Pendente' | 'Não Realizado';
    date?: string;
    notes?: string;
    value?: string;
}

export interface NeonatalPatient {
    id: string;
    name: string;
    mother_name: string;
    birth_date: string;
    birth_time: string;
    weight: number;
    gestational_age: string;
    tests: {
        pezinho: NeonatalTest;
        orelhinha: NeonatalTest;
        olhinho: NeonatalTest;
        coracaozinho: NeonatalTest;
        linguinha: NeonatalTest;
    };
    unit_id?: string;
    created_at?: string;
}

export const neonatalService = {
    // Fetch all patients
    async fetchPatients() {
        const { data, error } = await supabase
            .from('neonatal_patients')
            .select('*')
            .order('birth_date', { ascending: false });

        if (error) throw error;
        // Ensure tests object exists if it's null in DB
        return data?.map(p => ({
            ...p,
            tests: p.tests || {
                pezinho: { status: 'Pendente' },
                orelhinha: { status: 'Pendente' },
                olhinho: { status: 'Pendente' },
                coracaozinho: { status: 'Pendente' },
                linguinha: { status: 'Pendente' }
            }
        })) as NeonatalPatient[];
    },

    // Create a new patient
    async createPatient(patient: Omit<NeonatalPatient, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('neonatal_patients')
            .insert([patient])
            .select()
            .single();

        if (error) throw error;
        return data as NeonatalPatient;
    },

    // Update patient tests
    async updateTests(id: string, tests: NeonatalPatient['tests']) {
        const { data, error } = await supabase
            .from('neonatal_patients')
            .update({ tests })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as NeonatalPatient;
    }
};
