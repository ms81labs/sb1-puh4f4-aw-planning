export interface AllianceMember {
  id: string;
  name: string;
  lineId: string;
  battleground?: 1 | 2 | 3;
  isActive: boolean;
}

export interface AllianceState {
  members: AllianceMember[];
  allianceName: string;
  isLoading: boolean;
  error: string | null;
  selectedBg: 1 | 2 | 3;
  addMember: (member: Omit<AllianceMember, 'id' | 'isActive'>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  assignToBg: (id: string, bg: 1 | 2 | 3 | undefined) => Promise<void>;
  setSelectedBg: (bg: 1 | 2 | 3) => void;
  toggleMemberStatus: (id: string) => Promise<void>;
  updateAllianceName: (name: string) => Promise<void>;
}