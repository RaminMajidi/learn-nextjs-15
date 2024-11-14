'use server';
import { sql } from '@vercel/postgres';
import { CreateInvoiceValidation, UpdateInvoiceValidation } from './form-validation/Index';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// *** Start invoice actions ***

// ===> Add Invoice Action
export async function createInvoice(formData: FormData) {
    try {
        const { customerId, amount, status } = CreateInvoiceValidation.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        });
        const amountInCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];

        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (e) {
        console.log(e);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

// ===> Edit Invoice Action
export async function updateInvoice(id: string, formData: FormData) {
    try {
        const { customerId, amount, status } = UpdateInvoiceValidation.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        });

        const amountInCents = amount * 100;

        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (e) {
        console.log(e);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

// ===> Remove Invoice Action 
export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
};

// *** End invoice actions ***