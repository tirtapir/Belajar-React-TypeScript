import React, { createContext, useState, useContext } from "react";
import { CheckBookingProps, CheckBookingContextProviderProps } from "../types/checkBookingTypes";
import * as z from "zod";
import axios from "axios";
import { BookingDetails } from "../types/type";
import { viewBookingScheme } from "../types/validationBooking";
import { useNavigate } from "react-router-dom";

const CheckBookingContext = createContext<CheckBookingProps | undefined>(
    undefined
);

export const CheckBookingProvider = ({ children }: CheckBookingContextProviderProps) => {

    const [formData, setFormData] = useState({
        booking_trx_id: "",
        phone_number: "",
    });
    const [formError, setFormError] = useState<z.ZodIssue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const [editingData, setEditingData] = useState<BookingDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const baseURL = "http://localhost:8000/storage/";
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = viewBookingScheme.safeParse(formData);
        if (!validation.success) return setFormError(validation.error.errors);

        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/check-booking",
                formData,
                {
                    headers: {
                        "X-API-KEY": "adkukgi28262eih98209",
                    },
                }
            );

            setBookingDetails(response.data.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = () => {
        if (!bookingDetails) return;
        setIsEditing(true);
        setEditingData(bookingDetails);
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingData) return;
        setEditingData({ ...editingData, [e.target.name]: e.target.value });
    };

    const handleSaveUpdate = async () => {
        if (!editingData) return;

        try {
            const response = await axios.patch(
                `http://localhost:8000/api/update-booking/${editingData.id}`,
                editingData,
                {
                    headers: {
                        "X-API-KEY": "adkukgi28262eih98209",
                    },
                }
            );
            setBookingDetails(response.data.data);
            setIsEditing(false);
            setEditingData(null);

            navigate("/");
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
            alert("Failed to update booking information, Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!bookingDetails) return;

        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await axios.delete(
                  `http://localhost:8000/api/cancel-booking/${bookingDetails.id}`,
                  {
                    headers: {
                      "X-API-KEY": "adkukgi28262eih98209",
                    },
                  }
                );
                setBookingDetails(null);
                alert("Booking has been successfully canceled");
              } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                  setError(error.message);
                } else {
                  setError("An unexpected error occurred");
                }
              }
        }
    };

    const contextValue : CheckBookingProps = {
        formData,
        formError,
        isLoading,
        bookingDetails,
        error,
        editingData,
        isEditing,
        handleChange,
        handleSubmit,
        handleEditChange,
        handleSaveUpdate,
        handleDelete,  
    };

    return (
        <CheckBookingContext.Provider value={contextValue}>
            {children}
        </CheckBookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(CheckBookingContext);
    if (!context) {
      throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
  };

