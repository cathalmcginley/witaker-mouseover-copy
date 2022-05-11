export interface CopyRequest {
  id: string;
  text: string;
}
export interface CopySuccess {
  id: string;
  text: string;
}
export interface CopyFailure {
  id: string;
  text: string;
  errorMessage: string;
}
