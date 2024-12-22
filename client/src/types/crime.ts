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

export interface CrimeState {
  crimeList: Crime[];
  loading: boolean;
  error: string | null;
  fetchCrimeList: () => Promise<void>;
}
