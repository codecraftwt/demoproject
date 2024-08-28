import { SnackbarOrigin } from "@mui/material/Snackbar";

export interface SnackbarState extends SnackbarOrigin {
  open: boolean,
  message: string,
  severity: ('success' | 'error' | 'warning' | 'info'),
}