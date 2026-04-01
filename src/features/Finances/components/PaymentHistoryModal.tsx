import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@mui/material";

interface Payment {
  id: string;
  amount: number;
  date: string;
}

interface Props {
  open: boolean;
  payments: Payment[];
  itemName: string;
  onClose: () => void;
}

export default function PaymentHistoryModal({
  open,
  payments,
  itemName,
  onClose
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography component="div" variant="h6">
          Payment History
        </Typography>
        {itemName && (
          <Typography component="div" variant="body2" color="text.secondary">
            {itemName}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {payments.length === 0 ? (
          <Typography>No payments registered.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    {new Date(p.date).toLocaleString("pt-PT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell align="right">
                    {p.amount.toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR"
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}