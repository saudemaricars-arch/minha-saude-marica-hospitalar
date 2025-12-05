
import { supabase } from './services/supabaseClient';

const MASTER_UNIT = {
    id: 'master', // Assuming 'id' is text/uuid. If it's pure UUID we might need a real UUID, but 'master' works if the column allows text.
    // NOTE: 'health_units.id' is likely UUID. If so, 'master' will fail. 
    // Let's check if I can assume it's UUID.
    // '1', '2', '3' are used in Mock data, but DB might be different.
    // SAFEST: Generate a fixed UUID for master.
    name: 'Gestão Central (Secretaria)',
    type: 'Administrativo'
};

const MASTER_UUID = '00000000-0000-0000-0000-000000000000'; // Special UUID for Master if needed

async function seedMaster() {
    console.log('Starting Master User Seed...');

    // 1. Insert Master Unit
    // We try transparent ID 'master' first. If it fails (invalid input for uuid), we try the UUID.

    let unitIdToUse = 'master';

    // Try to insert unit
    const { error: unitError } = await supabase
        .from('health_units')
        .upsert({
            id: MASTER_UUID, // Use UUID to be safe with Postgres 'uuid' type columns
            name: MASTER_UNIT.name,
            type: MASTER_UNIT.type
        }, { onConflict: 'id' });

    if (unitError) {
        console.error('Error inserting Master Unit:', unitError);
        // If error is about invalid input syntax for type uuid, it confirms we need UUID.
        // If it worked, great.
        return;
    }
    console.log('Master Unit upserted successfully.');

    // 2. Insert Master Profile
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            email: '00000000000', // Using CPF as email/username
            name: 'Gestor Máximo',
            role: 'master',
            unit_id: MASTER_UUID,
            // Add other required fields if any. 'status' maybe?
            status: 'active'
        }, { onConflict: 'email' });

    if (profileError) {
        console.error('Error inserting Master Profile:', profileError);
        return;
    }
    console.log('Master Profile upserted successfully.');

    console.log('Seeding complete! You can now login with CPF 00000000000.');
}

seedMaster();
