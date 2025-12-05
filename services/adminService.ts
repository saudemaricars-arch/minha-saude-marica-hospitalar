import { supabase } from './supabaseClient';

export interface KpiMetric {
    id: string;
    title: string;
    value: string;
    trend: 'up' | 'down' | 'neutral' | 'stable';
    trend_label: string;
    trend_color: string;
    bg_color?: string;
    icon_name: string;
    icon_color: string;
    category: string;
}

export interface KpiChart {
    id: string;
    title: string;
    chart_type: 'bar' | 'line';
    data_points: number[];
    labels?: string[];
    color: string;
    category: string;
}

export interface KpiGoal {
    id: string;
    name: string;
    current_value: number;
    target_value: number;
    unit: string;
    status: 'success' | 'warning' | 'danger';
    trend: 'up' | 'down' | 'stable';
    category?: string;
}

export const adminService = {
    // Fetch Metrics by Category
    async fetchMetrics(category: string) {
        const { data, error } = await supabase
            .from('kpi_metrics')
            .select('*')
            .eq('category', category)
            .order('title'); // Simple sort

        if (error) throw error;
        return data as KpiMetric[];
    },

    // Fetch Charts by Category
    async fetchCharts(category: string) {
        const { data, error } = await supabase
            .from('kpi_charts')
            .select('*')
            .eq('category', category)
            .order('title');

        if (error) throw error;
        return data as KpiChart[];
    },

    // Fetch All Goals
    async fetchGoals() {
        const { data, error } = await supabase
            .from('kpi_goals')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as KpiGoal[];
    }
};
