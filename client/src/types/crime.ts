export enum ChargeType {
  IPC = "IPC",
  OTHERS = "OTHERS",
}

export interface Crime {
  id: number;
  marker: string;
  district: string;
  thana: string;
  io: string;
  section: string;
  incidentDate: Date;
  firDate: Date;
  totalAccused: number;
  totalArrested: number;
  totalLeft: number;
  dateOfArrest: Date;
  stage: string;
  chargeSheetReadyDate: Date;
  chargeSheetFileDate: Date;
  primarySection: number;
  chargeType: ChargeType;
  act: string;
  crimeNumber: string;
}

export interface Stage {
  name: string;
}

export interface CrimeState {
  crimeList: Crime[];
  stages: Stage[];
  loading: boolean;
  error: string | null;
  fetchCrimeList: () => Promise<void>;
  fetchStages: () => Promise<void>;
}
