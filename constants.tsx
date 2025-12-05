import React from 'react';
import { ModuleItem, HealthUnit, EmergencyPatient, EmergencyRoom, HospitalizationPatient, BedAvailability, Ambulance, AmbulanceMission, Bed, BedRequest, AuthorizationRequest, CensusSectorStat, CensusMovement, CensusDailyHistory, DischargeRequest, SinanNumber, NotificationCase, TbCase, ViolenceCase, IndicatorGoal, NeonatalPatient, MaternityVisit, VaccinationPatient, Vaccine } from './types';

// Simple Icon components to avoid external dependencies issues
export const Icons: Record<string, React.FC<{ className?: string }>> = {
  Users: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  UserPlus: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
  ),
  Lock: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  FileText: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  ),
  AlertCircle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Activity: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  ),
  Ambulance: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="22" height="13" rx="2" ry="2" /><line x1="14" y1="8" x2="14" y2="12" /><line x1="12" y1="10" x2="16" y2="10" /><circle cx="6" cy="19" r="3" /><circle cx="18" cy="19" r="3" /></svg>
  ),
  Map: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
  ),
  Bed: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
  ),
  ClipboardList: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h.01" /><path d="M13 12h2" /><path d="M9 16h.01" /><path d="M13 16h2" /></svg>
  ),
  BarChart2: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
  Baby: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 5 3.3Z" /></svg>
  ),
  Syringe: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>
  ),
  TestTube: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3" /><path d="m16 2 6 6" /><path d="M12 16H4" /></svg>
  ),
  Search: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  Bell: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  ),
  LogOut: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  Menu: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  ShieldAlert: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Building: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
  ),
  ChevronDown: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
  ),
  ChevronRight: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
  ),
  Shield: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Key: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.6 7.6a6 6 0 1 1-3.4-3.4l7-7 2 2 2-2 2 2-2 2-2 2 2-2Z" /><circle cx="7.5" cy="15.5" r="3.5" /></svg>
  ),
  Network: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg>
  ),
  Clock: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  Sliders: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
  ),
  FileSearch: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><circle cx="10" cy="14" r="3" /><line x1="12.12" y1="16.12" x2="14.24" y2="18.24" /></svg>
  ),
  Link: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
  ),
  CreditCard: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
  ),
  Layout: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
  ),
  Database: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
  ),
  Printer: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
  ),
  Eye: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  Edit: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  ),
  Trash: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
  ),
  ChevronLeft: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
  ),
  ArrowLeft: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  ),
  Save: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
  ),
  Download: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
  ),
  Refresh: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
  ),
  Server: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
  ),
  Mail: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ),
  Smartphone: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
  ),
  Globe: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" /></svg>
  ),
  UploadCloud: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
  ),
  PenTool: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
  ),
  Folder: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
  ),
  Scan: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /></svg>
  ),
  Tag: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  ),
  Share2: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
  ),
  Siren: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v6H7v-6Z" /><path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2H5v-2Z" /><path d="M21 12h1" /><path d="M18.5 4.5 18 5" /><path d="M2 12h1" /><path d="M5.5 4.5 6 5" /></svg>
  ),
  Stethoscope: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 0 1 5 2h14a.3.3 0 0 1 .2.3v3.3a.3.3 0 0 1-.2.3L15 8.7a5.5 5.5 0 0 0-5.9 0L5 5.9a.3.3 0 0 1-.2-.3V2.3Z" /><path d="M12 13v5a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-5" /><line x1="12" y1="13" x2="12" y2="20" /><path d="M12 20a2 2 0 0 0 2 2" /></svg>
  ),
  HeartPulse: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>
  ),
  Filter: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
  ),
  Megaphone: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
  ),
  UserCheck: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
  ),
  Thermometer: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>
  ),
  Monitor: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  TrendingUp: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
  ),
  CornerDownRight: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 10 20 15 15 20" /><path d="M4 4v7a4 4 0 0 0 4 4h12" /></svg>
  ),
  PieChart: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
  ),
  Info: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  XCircle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
  ),
  CheckCircle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  Wrench: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  ),
  Fuel: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="15" y2="22" /><line x1="5" y1="17" x2="5.01" y2="17" /><path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5a1 1 0 0 1 1 0Z" /><path d="M20 12h-2" /><path d="M22 7V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2" /><path d="M18 12a2 2 0 0 1-2 2H3v-4a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" /></svg>
  ),
  Navigation: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
  ),
  Truck: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
  ),
  PhoneIncoming: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 2 16 8 22 8" /><line x1="23" y1="1" x2="16" y2="8" /><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Sparkles: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 5h4" /><path d="M3 9h4" /></svg>
  ),
  ArrowRightLeft: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" /></svg>
  ),
  StopCircle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><rect x="9" y="9" width="6" height="6" /></svg>
  ),
  History: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  Briefcase: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  ),
  FilePlus: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
  ),
  Calendar: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  ArrowUpRight: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
  ),
  ArrowDownRight: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="7" x2="17" y2="17" /><polyline points="17 7 17 17 7 17" /></svg>
  ),
  ListOrdered: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
  ),
  EyeOff: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
  ),
  Target: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
  ),
  TrendingDown: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
  ),
  Ear: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" /><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 0 4 0v-1a.5.5 0 0 1 1 0v1a2.5 2.5 0 0 0 5 0v-1a5.5 5.5 0 1 0-11 0" /></svg>
  ),
  Smile: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  ),
  Phone: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  Heart: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
  ),
  Settings: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  CalendarCheck: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
  ),
  Droplet: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>
  ),
  PlusCircle: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
  ),
  MessageSquare: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  Cpu: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>
  ),
};

export const HEALTH_UNITS: HealthUnit[] = [
  { id: '1', name: 'Hospital Geral Central', type: 'Hospital' },
  { id: '2', name: 'UPA Zona Norte', type: 'UPA' },
  { id: '3', name: 'Maternidade Santa Clara', type: 'Maternidade' },
  { id: '4', name: 'UBS Jardim das Flores', type: 'UBS' },
  { id: '5', name: 'Laboratório Central', type: 'Laboratório' },
  { id: 'master', name: 'Gestão Central (Secretaria)', type: 'Administrativo' },
];

export const MOCK_EMERGENCY_PATIENTS: EmergencyPatient[] = [
  {
    id: '1', protocolNumber: '2405-0012', name: 'Carlos Andrade', age: 54, gender: 'M', riskLevel: 'red',
    arrivalTime: '10:15', waitTimeMinutes: 5, status: 'em_atendimento',
    chiefComplaint: 'Dor torácica intensa, sudorese', location: 'Box Emergência 1',
    assignedTeam: { doctor: 'Dr. Roberto', nurse: 'Enf. Juliana' },
    exams: { pending: 1, completed: 1, total: 2 },
    alerts: ['Código Vermelho', 'ECG Pendente']
  },
  {
    id: '2', protocolNumber: '2405-0015', name: 'Maria Helena Souza', age: 72, gender: 'F', riskLevel: 'orange',
    arrivalTime: '10:05', waitTimeMinutes: 15, status: 'aguardando_medico',
    chiefComplaint: 'Dispineia, saturação 88%', location: 'Sala Amarela 2',
    alerts: ['Hipertensa']
  },
  {
    id: '3', protocolNumber: '2405-0018', name: 'João Miguel', age: 8, gender: 'M', riskLevel: 'yellow',
    arrivalTime: '09:50', waitTimeMinutes: 30, status: 'exames',
    chiefComplaint: 'Febre alta (39.5) e vômitos', location: 'Raio-X',
    assignedTeam: { doctor: 'Dra. Ana' },
    exams: { pending: 0, completed: 0, total: 1 }
  },
  {
    id: '4', protocolNumber: '2405-0021', name: 'Ana Beatriz', age: 24, gender: 'F', riskLevel: 'green',
    arrivalTime: '09:30', waitTimeMinutes: 50, status: 'triagem',
    chiefComplaint: 'Dor de garganta e tosse', location: 'Recepção'
  },
  {
    id: '5', protocolNumber: '2405-0025', name: 'Luiz Fernando', age: 45, gender: 'M', riskLevel: 'blue',
    arrivalTime: '09:00', waitTimeMinutes: 80, status: 'aguardando_medico',
    chiefComplaint: 'Troca de curativo', location: 'Sala de Espera'
  },
  {
    id: '6', protocolNumber: '2405-0028', name: 'Roberto Campos', age: 60, gender: 'M', riskLevel: 'orange',
    arrivalTime: '10:18', waitTimeMinutes: 2, status: 'triagem',
    chiefComplaint: 'Confusão mental súbita', location: 'Triagem 2',
    alerts: ['AVC?']
  },
];

export const MOCK_ROOMS: EmergencyRoom[] = [
  { id: '1', name: 'Sala Trauma 1', type: 'trauma', status: 'ocupado', patientId: '1', occupancyTime: '15 min' },
  { id: '2', name: 'Sala Trauma 2', type: 'trauma', status: 'livre' },
  { id: '3', name: 'Box Emergência 1', type: 'box', status: 'ocupado', patientId: '2', occupancyTime: '45 min' },
  { id: '4', name: 'Box Emergência 2', type: 'box', status: 'livre' },
  { id: '5', name: 'Box Emergência 3', type: 'box', status: 'higienizacao' },
  { id: '6', name: 'Sala Sutura', type: 'sutura', status: 'livre' },
];

export const MOCK_HOSPITALIZATION_QUEUE: HospitalizationPatient[] = [
  {
    id: 'H1', name: 'Antonio Marcos', age: 67, gender: 'M', diagnosis: 'Sepse Pulmonar', origin: 'Emergência',
    requestedBedType: 'UTI Geral', priorityScore: 92, riskLevel: 'red', requestTime: '2024-05-11T08:00:00', waitTimeHours: 3,
    requester: 'Dr. João Medeiros', status: 'aguardando', comorbidities: ['Diabetes', 'Hipertensão'], notes: 'Necessidade de ventilação mecânica.'
  },
  {
    id: 'H2', name: 'Julia Martins', age: 34, gender: 'F', diagnosis: 'Pielonefrite Aguda', origin: 'Ambulatório',
    requestedBedType: 'Enfermaria Clínica', priorityScore: 55, riskLevel: 'yellow', requestTime: '2024-05-11T07:30:00', waitTimeHours: 4,
    requester: 'Dra. Carla Dias', status: 'aguardando', comorbidities: []
  },
  {
    id: 'H3', name: 'Pedro Alves', age: 22, gender: 'M', diagnosis: 'Fratura Fêmur', origin: 'Emergência',
    requestedBedType: 'Enfermaria Cirúrgica', priorityScore: 68, riskLevel: 'orange', requestTime: '2024-05-10T22:00:00', waitTimeHours: 13,
    requester: 'Dr. Roberto', status: 'aguardando', comorbidities: ['Obesidade'], notes: 'Aguardando cirurgia ortopédica.'
  },
  {
    id: 'H4', name: 'Maria do Carmo', age: 81, gender: 'F', diagnosis: 'AVC Isquêmico', origin: 'Emergência',
    requestedBedType: 'UTI Geral', priorityScore: 88, riskLevel: 'red', requestTime: '2024-05-11T10:00:00', waitTimeHours: 1,
    requester: 'Dr. João Medeiros', status: 'reservado', comorbidities: ['HAS', 'Cardiopatia'], notes: 'Janela terapêutica.'
  }
];

export const MOCK_BED_AVAILABILITY: BedAvailability[] = [
  { sector: 'UTI Geral', total: 20, occupied: 19, cleaning: 0, maintenance: 1, reserved: 0 },
  { sector: 'UTI Cardio', total: 10, occupied: 8, cleaning: 1, maintenance: 0, reserved: 0 },
  { sector: 'Enf. Clínica', total: 40, occupied: 35, cleaning: 3, maintenance: 0, reserved: 2 },
  { sector: 'Enf. Cirúrgica', total: 30, occupied: 20, cleaning: 2, maintenance: 1, reserved: 0 },
  { sector: 'Isolamento', total: 5, occupied: 5, cleaning: 0, maintenance: 0, reserved: 0 },
];

export const MOCK_AMBULANCES: Ambulance[] = [
  { id: '1', plate: 'BRA-2E19', type: 'USA', model: 'Mercedes Sprinter', status: 'disponivel', location: 'Base Central', fuelLevel: 85, lastMaintenance: '10/04/2024', equipmentStatus: 'ok', crew: 'Dr. Pedro, Enf. Ana, Cond. Carlos' },
  { id: '2', plate: 'RJX-9921', type: 'USB', model: 'Renault Master', status: 'em_atendimento', location: 'Av. Principal, 500', fuelLevel: 45, lastMaintenance: '02/05/2024', equipmentStatus: 'ok', crew: 'Cond. João, Tec. Maria' },
  { id: '3', plate: 'KLL-1234', type: 'Resgate', model: 'Ford Transit', status: 'em_manutencao', location: 'Oficina Autorizada', fuelLevel: 20, lastMaintenance: '12/05/2024', equipmentStatus: 'incompleto', crew: '-' },
  { id: '4', plate: 'NEO-5566', type: 'Neonatal', model: 'Fiat Ducato', status: 'disponivel', location: 'Base Hospital', fuelLevel: 92, lastMaintenance: '20/04/2024', equipmentStatus: 'ok', crew: 'Dr. Silva, Enf. Joana, Cond. Marcos' },
];

export const MOCK_MISSIONS: AmbulanceMission[] = [
  { id: '101', type: 'Acidente', priority: 'high', address: 'Rodovia RJ-106, Km 22', patientInfo: 'Colisão moto x carro, 1 vítima grave', status: 'despachada', ambulanceId: '2', startTime: '10:30', etaMinutes: 12 },
  { id: '102', type: 'Emergência', priority: 'high', address: 'Rua das Flores, 123 - Centro', patientInfo: 'PCR em idoso (82 anos)', status: 'pendente', startTime: '10:42' },
  { id: '103', type: 'Remoção', priority: 'low', address: 'UPA Inoã -> Hospital Conde', patientInfo: 'Transferência pct estável', status: 'pendente', startTime: '10:15' },
];

// Detailed Bed Mocks for the Map Module
export const MOCK_BEDS_DETAILED: Bed[] = [
  // UTI 1
  { id: 'B1', code: 'UTI-01', sector: 'UTI Adulto', type: 'UTI', status: 'ocupado', isIsolation: false, equipment: ['Ventilador', 'Monitor'], patient: { id: 'P1', name: 'José Silva', age: 65, diagnosis: 'Pneumonia Grave', admissionDate: '10/05/2024', doctor: 'Dr. Pedro', predictionDischarge: '15/05/2024' } },
  { id: 'B2', code: 'UTI-02', sector: 'UTI Adulto', type: 'UTI', status: 'ocupado', isIsolation: true, isolationType: 'Contato', equipment: ['Ventilador', 'Diálise'], patient: { id: 'P2', name: 'Maria Oliveira', age: 72, diagnosis: 'Sepse', admissionDate: '08/05/2024', doctor: 'Dr. Pedro' } },
  { id: 'B3', code: 'UTI-03', sector: 'UTI Adulto', type: 'UTI', status: 'disponivel', isIsolation: false, equipment: ['Monitor'] },
  { id: 'B4', code: 'UTI-04', sector: 'UTI Adulto', type: 'UTI', status: 'higienizacao', isIsolation: false, equipment: ['Monitor'], cleaningStatus: { assignedTo: 'Marta (Hotelaria)', startTime: '10:00' } },
  { id: 'B5', code: 'UTI-05', sector: 'UTI Adulto', type: 'UTI', status: 'manutencao', isIsolation: false, equipment: [], cleaningStatus: { assignedTo: 'Eng. Clínica' } },

  // Enfermaria A
  { id: 'B6', code: 'ENF-101A', sector: 'Enfermaria Clínica', type: 'Enfermaria', status: 'ocupado', gender: 'F', isIsolation: false, equipment: [], patient: { id: 'P3', name: 'Ana Costa', age: 45, diagnosis: 'Dengue', admissionDate: '11/05/2024', doctor: 'Dra. Carla' } },
  { id: 'B7', code: 'ENF-101B', sector: 'Enfermaria Clínica', type: 'Enfermaria', status: 'disponivel', gender: 'F', isIsolation: false, equipment: [] },
  { id: 'B8', code: 'ENF-102A', sector: 'Enfermaria Clínica', type: 'Enfermaria', status: 'reservado', gender: 'M', isIsolation: false, equipment: [] },
  { id: 'B9', code: 'ENF-102B', sector: 'Enfermaria Clínica', type: 'Enfermaria', status: 'ocupado', gender: 'M', isIsolation: false, equipment: [], patient: { id: 'P4', name: 'Bruno Santos', age: 30, diagnosis: 'Pós-Op Apêndice', admissionDate: '11/05/2024', doctor: 'Dr. Roberto' } },

  // Isolamento
  { id: 'B10', code: 'ISO-01', sector: 'Ala de Isolamento', type: 'Isolamento', status: 'ocupado', isIsolation: true, isolationType: 'Aerossol', equipment: ['Ventilador'], patient: { id: 'P5', name: 'Carlos Souza', age: 50, diagnosis: 'Tuberculose', admissionDate: '05/05/2024', doctor: 'Dra. Ana' } },
];

export const MOCK_BED_REQUESTS: BedRequest[] = [
  { id: 'R1', patientName: 'Lucia Lima', priority: 'Alta', requiredType: 'UTI', requesterUnit: 'Emergência', requestTime: '10:00' },
  { id: 'R2', patientName: 'Marcos Paulo', priority: 'Média', requiredType: 'Enfermaria', requesterUnit: 'Centro Cirúrgico', requestTime: '10:30' },
];

export const MOCK_AUTH_REQUESTS: AuthorizationRequest[] = [
  {
    id: 'AUTH-001', protocol: '202405150001', patientName: 'Ricardo Mendes', insurance: 'Unimed', insuranceId: '0032.1122.3344',
    procedureCode: '40813071', procedureName: 'Angioplastia Coronariana', cid: 'I20.0', doctorName: 'Dr. Roberto',
    requestDate: '2024-05-12', type: 'Eletiva', status: 'pendente', documents: 2, lastUpdate: '10 min atrás', daysRequested: 3
  },
  {
    id: 'AUTH-002', protocol: '202405150002', patientName: 'Fernanda Souza', insurance: 'Amil', insuranceId: '9988.7766.5544',
    procedureCode: '31003079', procedureName: 'Apendicectomia por Videolaparoscopia', cid: 'K35.8', doctorName: 'Dra. Carla',
    requestDate: '2024-05-14', type: 'Urgência', status: 'autorizado', documents: 4, lastUpdate: '1 dia atrás', daysRequested: 2
  },
  {
    id: 'AUTH-003', protocol: '202405150003', patientName: 'José Antunes', insurance: 'Bradesco Saúde', insuranceId: '1234.5678.9012',
    procedureCode: '40304361', procedureName: 'Ressonância Magnética de Crânio', cid: 'R51', doctorName: 'Dr. Pedro',
    requestDate: '2024-05-14', type: 'Eletiva', status: 'negado', documents: 1, lastUpdate: '2 horas atrás', denialReason: 'Carência Contratual'
  },
  {
    id: 'AUTH-004', protocol: '202405150004', patientName: 'Amanda Lima', insurance: 'SulAmérica', insuranceId: '5555.4444.3333',
    procedureCode: '30202014', procedureName: 'Parto Cesariana', cid: 'O80', doctorName: 'Dra. Ana',
    requestDate: '2024-05-13', type: 'Eletiva', status: 'analise_medica', documents: 5, lastUpdate: '30 min atrás', daysRequested: 3
  }
];

// Census Mocks
export const MOCK_CENSUS_SECTORS: CensusSectorStat[] = [
  { id: '1', name: 'UTI Geral', totalBeds: 20, occupiedBeds: 19, blockedBeds: 0, occupancyRate: 95, avgStayDays: 12.5, turnoverRate: 0.8 },
  { id: '2', name: 'UTI Cardiológica', totalBeds: 10, occupiedBeds: 8, blockedBeds: 1, occupancyRate: 80, avgStayDays: 5.2, turnoverRate: 1.2 },
  { id: '3', name: 'Enfermaria Clínica', totalBeds: 40, occupiedBeds: 35, blockedBeds: 2, occupancyRate: 87.5, avgStayDays: 4.8, turnoverRate: 2.5 },
  { id: '4', name: 'Enfermaria Cirúrgica', totalBeds: 30, occupiedBeds: 20, blockedBeds: 0, occupancyRate: 66.6, avgStayDays: 3.1, turnoverRate: 3.0 },
  { id: '5', name: 'Maternidade', totalBeds: 15, occupiedBeds: 12, blockedBeds: 0, occupancyRate: 80, avgStayDays: 2.5, turnoverRate: 4.1 },
];

export const MOCK_CENSUS_MOVEMENTS: CensusMovement[] = [
  { id: '1', type: 'Internação', patientName: 'Carlos Andrade', sector: 'Emergência -> UTI Cardio', time: '10:15', details: 'IAM c/ Supra' },
  { id: '2', type: 'Alta', patientName: 'Joana Silva', sector: 'Enfermaria Clínica', time: '09:30', details: 'Melhora Clínica' },
  { id: '3', type: 'Transferência', patientName: 'Pedro Alves', sector: 'UTI Geral -> Enf. Cirúrgica', time: '11:00', details: 'Estabilização pós-sepse' },
  { id: '4', type: 'Óbito', patientName: 'Mariana Costa', sector: 'UTI Geral', time: '04:20', details: 'Falência Múltipla de Órgãos' },
  { id: '5', type: 'Internação', patientName: 'Lucas Pereira', sector: 'Bloco Cirúrgico -> UTI Geral', time: '12:45', details: 'Pós-op Neurocirurgia' },
];

export const MOCK_CENSUS_HISTORY: CensusDailyHistory[] = [
  { date: '10/05', occupancyRate: 82, admissions: 14, discharges: 12 },
  { date: '11/05', occupancyRate: 85, admissions: 18, discharges: 10 },
  { date: '12/05', occupancyRate: 84, admissions: 15, discharges: 16 },
  { date: '13/05', occupancyRate: 88, admissions: 20, discharges: 11 },
  { date: '14/05', occupancyRate: 91, admissions: 22, discharges: 9 }, // Peak
  { date: '15/05', occupancyRate: 89, admissions: 16, discharges: 18 },
  { date: 'Hoje', occupancyRate: 87, admissions: 12, discharges: 14 },
];

// Discharge Mocks
export const MOCK_DISCHARGES: DischargeRequest[] = [
  { id: 'D1', patientName: 'Maria Silva', unit: 'Enfermaria Clínica', date: '2024-05-15', reason: 'Melhora Clínica', destination: 'Casa', status: 'em_preparo', documentsReady: true, transportRequired: false },
  { id: 'D2', patientName: 'João Santos', unit: 'UTI Geral', date: '2024-05-15', reason: 'Transferência', destination: 'Transferência', status: 'pendente', documentsReady: false, transportRequired: true },
  { id: 'D3', patientName: 'Ana Oliveira', unit: 'Maternidade', date: '2024-05-14', reason: 'Alta Puerpério', destination: 'Casa', status: 'liberado', documentsReady: true, transportRequired: false },
];

// SINAN Mocks
export const MOCK_SINAN: SinanNumber[] = [
  { id: 'S1', number: '2024000125', year: 2024, status: 'utilizado', patientName: 'Lucas Pereira', disease: 'Dengue', generatedAt: '2024-05-10 14:00' },
  { id: 'S2', number: '2024000126', year: 2024, status: 'disponivel' },
  { id: 'S3', number: '2024000127', year: 2024, status: 'disponivel' },
  { id: 'S4', number: '2024000128', year: 2024, status: 'cancelado', generatedAt: '2024-05-11 09:00' },
];

// Notification Mocks
export const MOCK_NOTIFICATIONS: NotificationCase[] = [
  { id: 'N1', disease: 'Dengue Grave', patientName: 'Carlos Souza', notificationDate: '2024-05-14', status: 'confirmado', week: 20, investigationStatus: 'concluido' },
  { id: 'N2', disease: 'Tuberculose Pulmonar', patientName: 'Marcos Dias', notificationDate: '2024-05-12', status: 'suspeito', week: 20, investigationStatus: 'em_andamento' },
  { id: 'N3', disease: 'Sífilis Congênita', patientName: 'RN de Maria Silva', notificationDate: '2024-05-13', status: 'confirmado', week: 20, investigationStatus: 'em_andamento' },
];

// TB Mocks
export const MOCK_TB_CASES: TbCase[] = [
  { id: 'TB1', patientName: 'Marcos Dias', phase: 'Intensiva', treatmentMonth: 1, totalMonths: 6, lastExam: '15/04/2024', status: 'em_tratamento', tdoCompliance: 95 },
  { id: 'TB2', patientName: 'Fernanda Lima', phase: 'Manutenção', treatmentMonth: 4, totalMonths: 6, lastExam: '10/05/2024', status: 'em_tratamento', tdoCompliance: 80 },
  { id: 'TB3', patientName: 'Roberto Alves', phase: 'Intensiva', treatmentMonth: 2, totalMonths: 6, lastExam: '20/04/2024', status: 'abandono', tdoCompliance: 40 },
];

// Violence Mocks
export const MOCK_VIOLENCE_CASES: ViolenceCase[] = [
  { id: 'V1', patientName: 'A. B. C.', age: 24, gender: 'F', type: 'Física', date: '2024-05-15', riskLevel: 'Alto', status: 'Em Acompanhamento', referrals: ['Delegacia da Mulher', 'IML'], isConfidential: true },
  { id: 'V2', patientName: 'João Victor', age: 8, gender: 'M', type: 'Negligência', date: '2024-05-14', riskLevel: 'Médio', status: 'Encaminhado', referrals: ['Conselho Tutelar'], isConfidential: false, notificationId: '2024005' },
  { id: 'V3', patientName: 'M. L.', age: 35, gender: 'F', type: 'Psicológica', date: '2024-05-12', riskLevel: 'Baixo', status: 'Em Acompanhamento', referrals: ['Psicologia'], isConfidential: true },
  { id: 'V4', patientName: 'Pedro Santos', age: 19, gender: 'M', type: 'Autoprovocada', date: '2024-05-10', riskLevel: 'Alto', status: 'Em Acompanhamento', referrals: ['CAPS', 'Serviço Social'], isConfidential: false },
];

// Indicators Mocks
export const MOCK_GOALS: IndicatorGoal[] = [
  { id: 'G1', name: 'Taxa de Ocupação Global', currentValue: 87, targetValue: 85, unit: '%', status: 'warning', trend: 'up' },
  { id: 'G2', name: 'Tempo Médio Permanência', currentValue: 5.2, targetValue: 5.0, unit: 'dias', status: 'warning', trend: 'stable' },
  { id: 'G3', name: 'Taxa de Infecção Hospitalar', currentValue: 1.2, targetValue: 2.0, unit: '%', status: 'success', trend: 'down' },
  { id: 'G4', name: 'Tempo Espera Emergência', currentValue: 45, targetValue: 30, unit: 'min', status: 'danger', trend: 'up' },
  { id: 'G5', name: 'Satisfação do Paciente (NPS)', currentValue: 92, targetValue: 90, unit: 'pts', status: 'success', trend: 'up' },
  { id: 'G6', name: 'Giro de Leitos', currentValue: 4.2, targetValue: 4.5, unit: '/mês', status: 'warning', trend: 'up' },
  { id: 'G7', name: 'Cancelamento Cirúrgico', currentValue: 5, targetValue: 3, unit: '%', status: 'danger', trend: 'stable' },
  { id: 'G8', name: 'Adesão Protocolo Sepse', currentValue: 95, targetValue: 98, unit: '%', status: 'warning', trend: 'up' },
];

// Neonatal Mocks
export const MOCK_NEONATAL_PATIENTS: NeonatalPatient[] = [
  {
    id: 'RN1', name: 'RN de Maria Oliveira', motherName: 'Maria Oliveira', birthDate: '14/05/2024', birthTime: '08:30',
    gestationalAge: '39s 2d', weight: 3250,
    tests: {
      pezinho: { status: 'Pendente', notes: 'Coletado 16/05' },
      orelhinha: { status: 'Normal', date: '15/05/2024', value: 'EOA Presente Bilateral' },
      olhinho: { status: 'Normal', date: '14/05/2024' },
      coracaozinho: { status: 'Normal', date: '15/05/2024', value: 'Sat 98%/99%' },
      linguinha: { status: 'Normal', date: '14/05/2024' }
    }
  },
  {
    id: 'RN2', name: 'RN de Ana Costa', motherName: 'Ana Costa', birthDate: '13/05/2024', birthTime: '14:15',
    gestationalAge: '38s', weight: 2900,
    tests: {
      pezinho: { status: 'Normal', date: '15/05/2024' },
      orelhinha: { status: 'Alterado', date: '14/05/2024', notes: 'Falha à esquerda. Reconvocar.' },
      olhinho: { status: 'Normal', date: '13/05/2024' },
      coracaozinho: { status: 'Normal', date: '14/05/2024' },
      linguinha: { status: 'Normal', date: '13/05/2024' }
    }
  },
  {
    id: 'RN3', name: 'RN de Julia Silva', motherName: 'Julia Silva', birthDate: '12/05/2024', birthTime: '22:00',
    gestationalAge: '40s', weight: 3500,
    tests: {
      pezinho: { status: 'Alterado', date: '15/05/2024', notes: 'TSH alterado. Recoleta urgente.' },
      orelhinha: { status: 'Normal', date: '13/05/2024' },
      olhinho: { status: 'Normal', date: '13/05/2024' },
      coracaozinho: { status: 'Normal', date: '13/05/2024' },
      linguinha: { status: 'Alterado', date: '13/05/2024', notes: 'Frenotomia indicada' }
    }
  },
  {
    id: 'RN4', name: 'RN de Carla Dias', motherName: 'Carla Dias', birthDate: '15/05/2024', birthTime: '06:00',
    gestationalAge: '36s 5d', weight: 2600,
    tests: {
      pezinho: { status: 'Não Realizado', notes: 'Aguardando 48h' },
      orelhinha: { status: 'Pendente' },
      olhinho: { status: 'Pendente' },
      coracaozinho: { status: 'Normal', date: '15/05/2024' },
      linguinha: { status: 'Normal', date: '15/05/2024' }
    }
  }
];

// Maternity Visit Mocks
export const MOCK_MATERNITY_VISITS: MaternityVisit[] = [
  {
    id: 'MAT-001', motherName: 'Juliana Paes', babyName: 'RN de Juliana', room: '204-A', bed: '01',
    admissionDate: '2024-05-14', daysPostPartum: 1, type: 'Parto Normal', status: 'pendente', riskLevel: 'Baixo',
    alerts: [], teamResponsible: 'Equipe Azul'
  },
  {
    id: 'MAT-002', motherName: 'Fernanda Lima', babyName: 'RN de Fernanda', room: '205-B', bed: '02',
    admissionDate: '2024-05-13', daysPostPartum: 2, type: 'Cesariana', status: 'realizada', riskLevel: 'Médio',
    alerts: ['Dificuldade Pega'], teamResponsible: 'Equipe Azul'
  },
  {
    id: 'MAT-003', motherName: 'Roberta Silva', babyName: 'RN de Roberta', room: '206-A', bed: '01',
    admissionDate: '2024-05-12', daysPostPartum: 3, type: 'Cesariana', status: 'pendente', riskLevel: 'Alto',
    alerts: ['Hipertensão Materna', 'Icterícia RN'], teamResponsible: 'Equipe Vermelha'
  },
];

// Vaccination Mocks
export const MOCK_VACCINES: Vaccine[] = [
  { id: '1', name: 'BCG', dose: 'Dose Única', targetAge: 'Ao nascer', batch: '2234A', expirationDate: '12/2025', stockLevel: 45, status: 'Available' },
  { id: '2', name: 'Hepatite B', dose: 'Dose Única', targetAge: 'Ao nascer', batch: '8892B', expirationDate: '10/2024', stockLevel: 120, status: 'Available' },
  { id: '3', name: 'Penta (DTP+Hib+HepB)', dose: '1ª Dose', targetAge: '2 meses', batch: '9912C', expirationDate: '08/2024', stockLevel: 20, status: 'Low' },
  { id: '4', name: 'VIP (Poliomielite)', dose: '1ª Dose', targetAge: '2 meses', batch: '1123D', expirationDate: '01/2026', stockLevel: 80, status: 'Available' },
  { id: '5', name: 'Rotavírus', dose: '1ª Dose', targetAge: '2 meses', batch: '4455E', expirationDate: '06/2024', stockLevel: 10, status: 'Low' },
  { id: '6', name: 'Pneumocócica 10', dose: '1ª Dose', targetAge: '2 meses', batch: '6677F', expirationDate: '11/2025', stockLevel: 60, status: 'Available' },
];

export const MOCK_VACCINATION_PATIENTS: VaccinationPatient[] = [
  {
    id: 'VAC-001', name: 'Pedro Henrique Silva', age: '2 meses', birthDate: '15/03/2024', cns: '700.1234.5678.9000',
    complianceRate: 100, delayedVaccines: 0,
    records: [
      { vaccineName: 'BCG', dose: 'Dose Única', status: 'Applied', dateScheduled: '15/03/2024', dateApplied: '16/03/2024', vaccinator: 'Enf. Joana' },
      { vaccineName: 'Hepatite B', dose: 'Ao nascer', status: 'Applied', dateScheduled: '15/03/2024', dateApplied: '16/03/2024', vaccinator: 'Enf. Joana' },
      { vaccineName: 'Penta', dose: '1ª Dose', status: 'Scheduled', dateScheduled: '15/05/2024' },
      { vaccineName: 'VIP', dose: '1ª Dose', status: 'Scheduled', dateScheduled: '15/05/2024' },
    ]
  },
  {
    id: 'VAC-002', name: 'Maria Alice Costa', age: '4 meses', birthDate: '10/01/2024', cns: '700.9876.5432.1000',
    complianceRate: 75, delayedVaccines: 1,
    records: [
      { vaccineName: 'BCG', dose: 'Dose Única', status: 'Applied', dateScheduled: '10/01/2024', dateApplied: '11/01/2024', vaccinator: 'Tec. Ana' },
      { vaccineName: 'Penta', dose: '1ª Dose', status: 'Applied', dateScheduled: '10/03/2024', dateApplied: '12/03/2024', vaccinator: 'Enf. Carla' },
      { vaccineName: 'VIP', dose: '1ª Dose', status: 'Applied', dateScheduled: '10/03/2024', dateApplied: '12/03/2024', vaccinator: 'Enf. Carla' },
      { vaccineName: 'Rotavírus', dose: '1ª Dose', status: 'Late', dateScheduled: '10/03/2024' }, // Late
    ]
  }
];


export const MODULES_DATA: ModuleItem[] = [
  { id: '1', title: 'Administração de Usuários', count: 12, category: 'admin', iconName: 'Users' },
  // Module ID 2 'Segurança e Acesso' removed
  { id: '3', title: 'Gestão de Documentos', count: 128, category: 'admin', iconName: 'Folder' },
  { id: '4', title: 'Painel de Urgência', count: 15, category: 'emergency', iconName: 'Siren' },
  { id: '5', title: 'Registro de Urgência', count: 32, category: 'emergency', iconName: 'ClipboardList' },
  { id: '6', title: 'Priorização de Internação', count: 8, category: 'clinical', iconName: 'TrendingUp' },
  { id: '7', title: 'Controle de Frota', count: 6, category: 'emergency', iconName: 'Ambulance' },
  { id: '8', title: 'Despacho de Ambulâncias', count: 3, category: 'emergency', iconName: 'Map' },
  { id: '9', title: 'Mapa de Leitos', count: 45, category: 'clinical', iconName: 'Bed' },
  { id: '10', title: 'Autorização de Internação', count: 10, category: 'clinical', iconName: 'ShieldCheck' },
  { id: '11', title: 'Censo Hospitalar', count: 112, category: 'clinical', iconName: 'BarChart2' },
  { id: '12', title: 'Gestão de Altas', count: 18, category: 'clinical', iconName: 'LogOut' },
  { id: '13', title: 'Controle SINAN', count: 567, category: 'monitoring', iconName: 'ListOrdered' },
  { id: '14', title: 'Notificação de Agravos', count: 5, category: 'monitoring', iconName: 'ShieldAlert' },
  { id: '15', title: 'Acompanhamento Tuberculose', count: 12, category: 'monitoring', iconName: 'Activity' },
  { id: '16', title: 'Acompanhamento Violências', count: 2, category: 'monitoring', iconName: 'EyeOff' },
  { id: '17', title: 'Painel de Indicadores', count: 24, category: 'admin', iconName: 'BarChart2' },
  { id: '18', title: 'Triagem Neonatal', count: 9, category: 'clinical', iconName: 'Baby' },
  { id: '19', title: 'Vacinação Infantil', count: 64, category: 'clinical', iconName: 'Syringe' },
  { id: '20', title: 'Visita Maternidade', count: 7, category: 'clinical', iconName: 'Baby' },
  { id: '21', title: 'Agenda Multidisciplinar', count: 0, category: 'clinical', iconName: 'Calendar' },
  // Unit Analysis Modules (Master Only)
  { id: 'master_unit_1', title: 'Análise: H. Geral Central', count: 0, category: 'master_analysis', iconName: 'Building' },
  { id: 'master_unit_2', title: 'Análise: UPA Zona Norte', count: 0, category: 'master_analysis', iconName: 'Building' },
  { id: 'master_unit_3', title: 'Análise: Mat. Santa Clara', count: 0, category: 'master_analysis', iconName: 'Baby' },
  { id: 'master_unit_4', title: 'Análise: UBS Jardim', count: 0, category: 'master_analysis', iconName: 'Activity' },
  { id: 'master_unit_5', title: 'Análise: Lab. Central', count: 0, category: 'master_analysis', iconName: 'TestTube' },
];

export const MASTER_UNIT: HealthUnit = {
  id: 'master',
  name: 'Visão Geral (Master)',
  type: 'Administrativo'
};