import { z } from 'zod';

// *** Start Invoice Validation ***
// ===> Scheama
const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer",
    }),
    amount: z.coerce.number()
        .gt(0, { message: "Please enter an amount greater than $0." }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: "Please select an invoice status."
    }),
    date: z.string(),
});
// ===> Craete Validation
export const CreateInvoiceValidation = InvoiceSchema.omit({ id: true, date: true });
// ===> Update Validation
export const UpdateInvoiceValidation = InvoiceSchema.omit({ id: true, date: true });
// *** End  Invoice Validation ***
