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
  [districtKey: string]: string | number | Date | ChargeType | undefined; // Add this line to allow dynamic properties
}

export interface CrimeState {
  crimeList: Crime[];
  loading: boolean;
  error: string | null;
  fetchCrimeList: () => Promise<void>;
}
