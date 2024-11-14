import { z } from 'zod';

// *** Start Invoice Validation ***
// ===> Scheama
const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
// ===> Craete Validation
export const CreateInvoiceValidation = InvoiceSchema.omit({ id: true, date: true });
// ===> Update Validation
export const UpdateInvoiceValidation = InvoiceSchema.omit({ id: true, date: true });
// *** End  Invoice Validation ***
