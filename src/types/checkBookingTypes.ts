import React from "react";
import { BookingDetails } from "./type";
import * as z from "zod";

export interface CheckBookingProps {
    formData: { booking_trx_id: string; phone_number: string };
    formError: z.ZodIssue[];
    isLoading: boolean;
    bookingDetails: BookingDetails | null;
    error: string | null;
    editingData: BookingDetails | null;
    isEditing: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveUpdate: () => Promise<void>;
    handleDelete: ()=> Promise <void>;
}

export interface CheckBookingContextProviderProps {
    children: React.ReactNode;
}