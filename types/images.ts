export interface VercelBlob {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  name: string;
}

export interface ImageModalProps {
  onClose: () => void;
  setImage: (i: File) => void;
  onSave: (e?: React.SyntheticEvent) => Promise<void>;
  isLoading: boolean;
}
