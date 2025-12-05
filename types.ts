
export interface ModuleItem {
  id: string;
  title: string;
  count: number; // Represents functionality counter or active items
  category: 'admin' | 'clinical' | 'emergency' | 'monitoring';
  iconName: string;
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  birthDate?: string;
  gender?: 'M' | 'F';
  cns?: string;
  motherName?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  lastAccess: string;
  avatarUrl?: string;
  department?: string;
  unitId?: string;
}

export interface SearchResult {
  text: string;
  relatedModuleId?: string;
}

export interface HealthUnit {
  id: string;
  name: string;
  type: string; // e.g., 'Hospital', 'UPA', 'UBS'
}

export type AdminPage =
  | 'users'
  | 'access'
  | 'hierarchy'
  | 'shifts'
  | 'params'
  | 'audit'
  | 'monitoring'
  | 'integrations'
  | 'licenses'
  | 'layout'
  | 'notifications'
  | 'backup'
  | 'reports';

export type DocumentPage =
  | 'repository'
  | 'upload'
  | 'signatures'
  | 'ocr'
  | 'config'
  | 'audit';

export type EmergencyPage =
  | 'dashboard'
  | 'registration'
  | 'triage'
  | 'map'
  | 'fleet'
  | 'dispatch';

export type BedPage = 'map' | 'cleaning' | 'requests' | 'indicators';

export type AuthorizationPage = 'dashboard' | 'new_request' | 'audit' | 'reports';

export type CensusPage = 'dashboard' | 'sectors' | 'movements' | 'history';

export type DischargePage = 'requests' | 'followup' | 'indicators';
export type MonitoringPage = 'sinan' | 'agravos' | 'tuberculose' | 'violencia';

export type IndicatorsPage = 'overview' | 'clinical' | 'epidemiological' | 'quality' | 'operational' | 'goals';

export type NeonatalPage = 'dashboard' | 'list' | 'recall' | 'indicators';

export type MaternityPage = 'dashboard' | 'visits' | 'schedule' | 'indicators';

export type VaccinationPage = 'dashboard' | 'patients' | 'stock' | 'campaigns';

export interface DocumentFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'DICOM' | 'JPG' | 'XLSX';
  category: string;
  size: string;
  uploadDate: string;
  author: string;
  patientName?: string;
  status: 'signed' | 'pending' | 'draft' | 'archived';
  version: string;
  tags: string[];
}

export type RiskLevel = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'white';

export interface EmergencyPatient {
  id: string;
  protocolNumber: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  riskLevel: RiskLevel;
  arrivalTime: string;
  waitTimeMinutes: number;
  status: 'triagem' | 'aguardando_medico' | 'em_atendimento' | 'exames' | 'aguardando_leito' | 'observacao' | 'alta';
  chiefComplaint: string; // Queixa principal
  location: string; // Sala de espera, Box 1, etc.
  assignedTeam?: {
    doctor?: string;
    nurse?: string;
  };
  exams?: {
    pending: number;
    completed: number;
    total: number;
  };
  alerts?: string[];
}

export interface EmergencyRoom {
  id: string;
  name: string;
  type: 'trauma' | 'box' | 'obs' | 'sutura';
  status: 'livre' | 'ocupado' | 'higienizacao' | 'manutencao';
  patientId?: string; // If occupied
  occupancyTime?: string;
}

// New Types for Prioritization Module
export interface HospitalizationPatient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  diagnosis: string;
  origin: 'Emergência' | 'Ambulatório' | 'Transferência' | 'Bloco Cirúrgico';
  requestedBedType: 'UTI Geral' | 'UTI Cardio' | 'Enfermaria Clínica' | 'Enfermaria Cirúrgica' | 'Isolamento';
  priorityScore: number; // 0 to 100 calculated score
  riskLevel: RiskLevel;
  requestTime: string;
  waitTimeHours: number;
  requester: string;
  status: 'aguardando' | 'reservado' | 'internado' | 'cancelado';
  notes?: string;
  comorbidities: string[];
}

export interface BedAvailability {
  sector: string;
  total: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  reserved: number;
}

// New Types for Ambulance Modules
export interface Ambulance {
  id: string;
  plate: string;
  type: 'USA' | 'USB' | 'Resgate' | 'Neonatal';
  model: string;
  status: 'disponivel' | 'em_atendimento' | 'em_manutencao' | 'higienizacao';
  location: string; // Mock address/coordinates
  fuelLevel: number; // 0-100
  lastMaintenance: string;
  equipmentStatus: 'ok' | 'incompleto';
  crew: string;
}

export interface AmbulanceMission {
  id: string;
  type: 'Emergência' | 'Remoção' | 'Evento' | 'Acidente';
  priority: 'high' | 'medium' | 'low';
  address: string;
  patientInfo: string;
  status: 'pendente' | 'despachada' | 'no_local' | 'finalizada';
  ambulanceId?: string;
  startTime: string;
  etaMinutes?: number;
}

// Bed Management Types
export type BedStatus = 'disponivel' | 'ocupado' | 'higienizacao' | 'manutencao' | 'reservado' | 'bloqueado';
export type BedType = 'UTI' | 'Enfermaria' | 'Apartamento' | 'Isolamento' | 'Berço';

export interface Bed {
  id: string;
  code: string; // e.g., 204-A
  sector: string; // e.g., Ala Sul, UTI 1
  type: BedType;
  status: BedStatus;
  gender?: 'M' | 'F' | 'Unisex';
  isIsolation: boolean;
  isolationType?: 'Contato' | 'Aerossol' | 'Reverso';
  equipment: string[]; // e.g., 'Ventilador', 'Monitor'

  // Occupant Info
  patient?: {
    id: string;
    name: string;
    age: number;
    diagnosis: string;
    admissionDate: string;
    doctor: string;
    predictionDischarge?: string;
  };

  // Maintenance/Cleaning Info
  cleaningStatus?: {
    assignedTo?: string;
    startTime?: string;
    estimatedFinish?: string;
  };
}

export interface BedRequest {
  id: string;
  patientName: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  requiredType: BedType;
  requesterUnit: string;
  requestTime: string;
}

// Authorization Types
export type AuthStatus = 'pendente' | 'analise_medica' | 'aguardando_operadora' | 'autorizado' | 'negado' | 'cancelado';

export interface AuthorizationRequest {
  id: string;
  protocol: string;
  patientName: string;
  insurance: string; // Convênio
  insuranceId: string; // Carteirinha
  procedureCode: string; // TUSS/CBHPM
  procedureName: string;
  cid: string;
  doctorName: string;
  requestDate: string;
  type: 'Eletiva' | 'Urgência' | 'Prorrogação';
  status: AuthStatus;
  documents: number;
  lastUpdate: string;
  daysRequested?: number;
  denialReason?: string;
}

// Census Types
export interface CensusSectorStat {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  blockedBeds: number;
  occupancyRate: number;
  avgStayDays: number;
  turnoverRate: number;
}

export interface CensusMovement {
  id: string;
  type: 'Internação' | 'Alta' | 'Transferência' | 'Óbito';
  patientName: string;
  sector: string;
  time: string;
  details: string;
}

export interface CensusDailyHistory {
  date: string;
  occupancyRate: number;
  admissions: number;
  discharges: number;
}

// Discharge & Monitoring Types
export interface DischargeRequest {
  id: string;
  patientName: string;
  unit: string;
  date: string;
  reason: string;
  destination: 'Casa' | 'Home Care' | 'Transferência' | 'Óbito';
  status: 'pendente' | 'em_preparo' | 'liberado';
  documentsReady: boolean;
  transportRequired: boolean;
}

export interface SinanNumber {
  id: string;
  number: string;
  year: number;
  status: 'disponivel' | 'utilizado' | 'cancelado';
  patientName?: string;
  generatedAt?: string;
  disease?: string;
}

export interface NotificationCase {
  id: string;
  disease: string;
  patientName: string;
  notificationDate: string;
  status: 'suspeito' | 'confirmado' | 'descartado';
  week: number;
  investigationStatus: 'em_andamento' | 'concluido';
}

export interface TbCase {
  id: string;
  patientName: string;
  phase: 'Intensiva' | 'Manutenção';
  treatmentMonth: number;
  totalMonths: number;
  lastExam: string;
  status: 'em_tratamento' | 'cura' | 'abandono';
  tdoCompliance: number; // percentage
}

export interface ViolenceCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  type: 'Física' | 'Psicológica' | 'Sexual' | 'Negligência' | 'Autoprovocada' | 'Outros';
  date: string;
  riskLevel: 'Alto' | 'Médio' | 'Baixo';
  status: 'Em Acompanhamento' | 'Encaminhado' | 'Arquivado';
  referrals: string[]; // e.g., 'Conselho Tutelar', 'Delegacia'
  isConfidential: boolean; // Sigilo
  notificationId?: string; // SINAN Number
}

// Indicators Module Types
export interface IndicatorGoal {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'success' | 'warning' | 'danger';
  trend: 'up' | 'down' | 'stable';
}

export interface IndicatorMetric {
  label: string;
  value: number;
}

// Neonatal Screening Types
export type TestStatus = 'Normal' | 'Alterado' | 'Inconclusivo' | 'Pendente' | 'Não Realizado';

export interface ScreeningResult {
  status: TestStatus;
  date?: string;
  value?: string; // e.g. "98%" or "Sem emissão"
  notes?: string;
}

export interface NeonatalPatient {
  id: string;
  name: string; // RN de Maria...
  motherName: string;
  birthDate: string;
  birthTime: string;
  gestationalAge: string; // e.g. 39s
  weight: number; // in grams

  tests: {
    pezinho: ScreeningResult;
    orelhinha: ScreeningResult;
    olhinho: ScreeningResult;
    coracaozinho: ScreeningResult;
    linguinha: ScreeningResult;
  };
}

// Maternity Visit Types
export interface MaternityVisit {
  id: string;
  motherName: string;
  babyName: string;
  room: string;
  bed: string;
  admissionDate: string;
  daysPostPartum: number;
  type: 'Parto Normal' | 'Cesariana';
  status: 'pendente' | 'realizada' | 'atrasada';
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  lastVisit?: string;
  alerts: string[]; // e.g. "Dificuldade Amamentação", "Depressão Pós-Parto?"
  teamResponsible: string; // e.g. "Equipe A"
}

// Vaccination Types
export interface Vaccine {
  id: string;
  name: string;
  dose: string; // e.g. "1ª Dose", "Reforço"
  targetAge: string; // e.g. "Ao nascer", "2 meses"
  batch: string;
  expirationDate: string;
  stockLevel: number;
  status: 'Available' | 'Low' | 'Expired';
}

export interface VaccinationRecord {
  vaccineName: string;
  dose: string;
  status: 'Applied' | 'Late' | 'Scheduled' | 'Pending';
  dateScheduled: string;
  dateApplied?: string;
  vaccinator?: string;
  batch?: string;
}

export interface VaccinationPatient {
  id: string;
  name: string;
  age: string; // e.g. "2 meses e 15 dias"
  birthDate: string;
  cns: string; // Cartão Nacional de Saúde
  complianceRate: number; // 0-100%
  delayedVaccines: number;
  records: VaccinationRecord[];
}