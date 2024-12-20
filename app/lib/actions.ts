'use server';
import { sql } from '@vercel/postgres';
import { CreateInvoiceValidation, UpdateInvoiceValidation } from './form-validation/Index';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InvoiceState, LoginState } from '../types/Index';
import { SignupSchema } from "@/app/lib/form-validation/Index"
import { User } from './definitions';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './session';

// *** Start invoice actions ***

// ===> Add Invoice Action
export async function createInvoice(prevState: InvoiceState, formData: FormData) {

    const validatedFields = CreateInvoiceValidation.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

// ===> Edit Invoice Action
export async function updateInvoice(id: string, prevState: InvoiceState, formData: FormData) {

    const validatedFields = UpdateInvoiceValidation.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { amount, customerId, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

// ===> Remove Invoice Action 
export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
};

// *** End invoice actions ***


// *** Satrt Auth actions ***

// ===> autentication(Login)
export async function loginAction(prevState: LoginState, formData: FormData) {
    const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message:"Missing Fields. Failed to Login."
        };
    }

    const { email, password } = validatedFields.data;

    let userId = null;
    try {
        const data = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        if (!data.rowCount) {
            return {
                errors: {
                    email: ["Inavlid Your Email"]
                }
            }
        } else {
            const passwordMatch = await bcrypt.compare(password, data.rows[0].password);

            if (!passwordMatch) {
                return {
                    errors: {
                        password: ["Invalid Your Password"]
                    }
                }
            } else {
                userId = data.rows[0].id;
            }
        }
    } catch {
        throw new Error('Failed to fetch user.');
    }

    await createSession(userId);
    redirect("/dashboard");

};

// ===> Logout
export async function logout() {
    await deleteSession();
    redirect("/");
}
// *** End Auth actions ***