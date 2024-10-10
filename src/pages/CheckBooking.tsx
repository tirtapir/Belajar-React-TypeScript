import { useState } from "react";
import Navbar from "../components/navbar";
import * as z from "zod";
import { BookingDetails } from "../types/type";
import axios from "axios";
import { viewBookingScheme } from "../types/validationBooking";

export default function CheckBooking() {

    const [formData, setFormData] = useState({
        booking_trx_id: "",
        phone_number: "",
    });

    const [formError, setFormError] = useState<z.ZodIssue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [err, setError] = useState<string | null>(null);
    const baseURL = "http://localhost:8000/storage/";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Validating form Data...");
        const validation = viewBookingScheme.safeParse(formData);

        console.log("Form Data is valid, Submiting ...");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/check-booking",
                {
                    ...formData,
                },
                {
                    headers: {
                        "X-API-KEY": "adkukgi28262eih98209"
                    },
                }
            );

            if (!validation.success) {
                setFormError(validation.error.errors);
                console.log("Form Data is not valid");
                return;
            }

            console.log("We are checking your Booking: ", response.data.data);
            setBookingDetails(response.data.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log("Booking Transaction Error: ", err.message);
                if (err.response) {
                    console.log("Server Response: ", err.response.data); // Melihat response error dari server
                }
                setError(err.message);
            } else {
                console.log("unexpected error", err);
                setError("An unexpected error occured");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div
                id="Banner"
                className="relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]"
            >
                <h1 className="text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20">
                    View Your Booking Details
                </h1>
                <div className="absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10" />
                <img
                    src="/assets/images/thumbnails/thumbnail-details-5.png"
                    className="absolute w-full h-full object-cover object-top"
                    alt=""
                />
            </div>
            <section
                id="Check-Booking"
                className="relative flex flex-col w-[930px] shrink-0 gap-[30px] mx-auto mb-[100px] z-20"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex items-end rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[16px] bg-white"
                >
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-semibold">
                            Booking TRX ID
                        </label>
                        <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                            <img
                                src="/assets/images/icons/receipt-text-black.svg"
                                className="w-6 h-6"
                                alt="icon"
                            />
                            <input
                                type="text"
                                name="booking_trx_id"
                                onChange={handleChange}
                                value={formData.booking_trx_id}
                                id="name"
                                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                                placeholder="Write your booking trx id"
                            />
                        </div>
                        {formError.find((err) => err.path.includes("booking_trx_id")) && (
                            <p className="text-[#FF2D2D] font-semibold">Booking transaction ID is requred</p>
                        )}
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-semibold">
                            Phone Number
                        </label>
                        <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                            <img
                                src="/assets/images/icons/call-black.svg"
                                className="w-6 h-6"
                                alt="icon"
                            />
                            <input
                                type="tel"
                                name="phone_number"
                                onChange={handleChange}
                                value={formData.phone_number}
                                id="phone"
                                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                                placeholder="Write your valid number"
                            />
                        </div>
                        {formError.find((err) => err.path.includes("phone_number")) && (
                            <p className="text-[#FF2D2D] font-semibold">Phone number is requred</p>
                        )}
                    </div>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="flex items-center justify-center rounded-full p-[12px_30px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
                    >
                        <span className="text-nowrap">{isLoading ? "Loading.." : "Check Booking"}</span>
                    </button>
                </form>

                {bookingDetails && (
                    <div id="Result" className="grid grid-cols-2 gap-[30px]">
                        <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                            <div className="flex items-center gap-4">
                                <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden">
                                    <img
                                        src={`${baseURL}/${bookingDetails.office.thumbnail}`}
                                        className="w-full h-full object-cover"
                                        alt="thumbnail"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold text-xl leading-[30px]">
                                        {bookingDetails.office.name}
                                    </p>
                                    <div className="flex items-center gap-[6px]">
                                        <img
                                            src="/assets/images/icons/location.svg"
                                            className="w-6 h-6"
                                            alt="icon"
                                        />
                                        <p className="font-semibold">{bookingDetails.office.city.name}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-[#F6F5FD]" />
                            <div className="flex flex-col gap-4">
                                <h2 className="font-bold">Customer Details</h2>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">Full Name</h3>
                                    <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                                        <img
                                            src="/assets/images/icons/security-user-black.svg"
                                            className="w-6 h-6"
                                            alt="icon"
                                        />
                                        <p className="font-semibold">{bookingDetails.name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">
                                        Phone Number
                                    </h3>
                                    <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                                        <img
                                            src="/assets/images/icons/call-black.svg"
                                            className="w-6 h-6"
                                            alt="icon"
                                        />
                                        <p className="font-semibold">{bookingDetails.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">
                                        Started At
                                    </h3>
                                    <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                                        <img
                                            src="/assets/images/icons/calendar-black.svg"
                                            className="w-6 h-6"
                                            alt="icon"
                                        />
                                        <p className="font-semibold">{bookingDetails.started_at}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold">
                                        Ended At
                                    </h3>
                                    <div className="flex items-center rounded-full px-5 py-3 gap-[10px] bg-[#F7F7FD]">
                                        <img
                                            src="/assets/images/icons/calendar-black.svg"
                                            className="w-6 h-6"
                                            alt="icon"
                                        />
                                        <p className="font-semibold">{bookingDetails.ended_at}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-[#F6F5FD]" />
                            <div className="flex items-center gap-3">
                                <img
                                    src="/assets/images/icons/shield-tick.svg"
                                    className="w-[30px] h-[30px]"
                                    alt="icon"
                                />
                                <p className="font-semibold leading-[28px]">
                                    Privasi Anda aman bersama kami.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col h-fit shrink-0 rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                            <h2 className="font-bold">Order Details</h2>


                            <div className="flex flex-col gap-5">
                                {bookingDetails.is_paid ? (
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">Status Pembayaran</p>
                                        <p className="rounded-full w-fit p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]">
                                            SUCCESS
                                        </p>
                                    </div>

                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">Status Pembayaran</p>
                                        <p className="rounded-full w-fit p-[6px_16px] bg-[#FF852D] font-bold text-sm leading-[21px] text-[#F7F7FD]">
                                            PENDING
                                        </p>
                                    </div>
                                )
                                }


                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Booking TRX ID</p>
                                    <p className="font-bold">{bookingDetails.booking_trx_id}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Duration</p>
                                    <p className="font-bold">{bookingDetails.duration} Days Working</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Total Amount</p>
                                    <p className="font-bold text-[22px] leading-[33px] text-[#0D903A]">
                                        {bookingDetails.total_amount.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
                            <hr className="border-[#F6F5FD]" />
                            <h2 className="font-bold">Bonus Packages For You</h2>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/assets/images/icons/coffee.svg"
                                        className="w-[34px] h-[34px]"
                                        alt="icon"
                                    />
                                    <div className="flex flex-col gap-[2px]">
                                        <p className="font-bold">Extra Snacks</p>
                                        <p className="text-sm leading-[21px]">Work-Life Balance</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        src="/assets/images/icons/group.svg"
                                        className="w-[34px] h-[34px]"
                                        alt="icon"
                                    />
                                    <div className="flex flex-col gap-[2px]">
                                        <p className="font-bold">Free Move</p>
                                        <p className="text-sm leading-[21px]">Anytime 24/7</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="border-[#F6F5FD]" />
                            <a
                                href=""
                                className="flex items-center justify-center w-full rounded-full border border-[#000929] p-[12px_20px] gap-3 bg-white font-semibold"
                            >
                                <img
                                    src="/assets/images/icons/call-black.svg"
                                    className="w-6 h-6"
                                    alt="icon"
                                />
                                <span>Call Customer Service</span>
                            </a>
                        </div>
                    </div>
                )}
            </section>
        </>

    );
}