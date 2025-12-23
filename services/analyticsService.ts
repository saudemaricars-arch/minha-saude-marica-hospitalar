
import {
    HEALTH_UNITS,
    MOCK_BEDS_DETAILED,
    MOCK_EMERGENCY_PATIENTS,
    MOCK_AMBULANCES,
    MOCK_BED_AVAILABILITY
} from '../constants';

export interface GlobalKPIs {
    totalOccupancy: number; // Percentage
    totalPatientsWaiting: number;
    avgWaitTime: string;
    activeStaffRatio: string;
    criticalUnits: number;
}

export interface UnitStatus {
    id: string;
    name: string;
    type: string;
    occupancy: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    patientsWaiting: number;
}

export const AnalyticsService = {
    // Calculate Global KPIs based on "Real" aggregated data
    getGlobalKPIs: (): GlobalKPIs => {
        // 1. Calculate Occupancy
        // For simplicity, we assume MOCK_BEDS_DETAILED represents a sample. 
        // In a real app, we'd sum all beds from all units.
        // Let's use MOCK_BED_AVAILABILITY which is more aggregate.
        let totalBeds = 0;
        let occupiedBeds = 0;

        MOCK_BED_AVAILABILITY.forEach(stat => {
            totalBeds += stat.total;
            occupiedBeds += stat.occupied;
        });

        const totalOccupancy = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

        // 2. Total Patients Waiting (Queue)
        // Aggregating from MOCK_EMERGENCY_PATIENTS (Sample) + extrapolating for demo
        // In a real scenario: count(emergency_visits where status != discharged)
        const sampleWaiting = MOCK_EMERGENCY_PATIENTS.filter(p => p.status !== 'alta').length;
        // Simulating a larger network multiplier
        const totalPatientsWaiting = sampleWaiting * 12;

        // 3. Average Wait Time
        // Calc average from MOCK_EMERGENCY_PATIENTS
        const totalMinutes = MOCK_EMERGENCY_PATIENTS.reduce((acc, curr) => acc + curr.waitTimeMinutes, 0);
        const avgMinutes = MOCK_EMERGENCY_PATIENTS.length > 0 ? Math.round(totalMinutes / MOCK_EMERGENCY_PATIENTS.length) : 0;
        const hours = Math.floor(avgMinutes / 60);
        const mins = avgMinutes % 60;
        const avgWaitTime = `${hours}h ${mins}m`;

        // 4. Critical Units (Simulated Logic)
        // A unit is critical if occupancy > 85% or high wait times
        // We will simulate this count since we don't have detailed bed stats for EVERY unit in the mocks yet
        const criticalUnits = Math.floor(HEALTH_UNITS.length * 0.15); // ~15% of units are critical

        return {
            totalOccupancy,
            totalPatientsWaiting,
            avgWaitTime,
            activeStaffRatio: '82%', // Placeholder for detailed staff scheduling
            criticalUnits
        };
    },

    // Get Risk Status for every unit
    getAllUnitsStatus: (): UnitStatus[] => {
        return HEALTH_UNITS.filter(u => u.id !== 'master').map(unit => {
            // Generate deterministic "real" stats based on unit ID hash
            // This ensures consistency across renders but varies by unit
            const seed = unit.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            let occupancy = (seed % 60) + 30; // 30% to 90%
            if (unit.type === 'Hospital') occupancy += 10; // Hospitals are busier
            if (unit.type === 'UPA') occupancy += 15; // UPAs are very busy

            // Cap at 100
            occupancy = Math.min(occupancy, 100);

            let patientsWaiting = (seed % 20) + 2;
            if (unit.type === 'Hospital') patientsWaiting *= 3;

            // Determine Risk
            let riskLevel: UnitStatus['riskLevel'] = 'low';
            if (occupancy > 70) riskLevel = 'medium';
            if (occupancy > 85) riskLevel = 'high';
            if (occupancy > 95) riskLevel = 'critical';

            return {
                id: unit.id,
                name: unit.name,
                type: unit.type,
                occupancy,
                riskLevel,
                patientsWaiting
            };
        }).sort((a, b) => b.occupancy - a.occupancy); // Sort by busiest
    }
};
