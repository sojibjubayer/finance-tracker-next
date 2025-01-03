"use client";

import { useAddTransactionMutation } from "@/redux/features/transactionApi";
import { useCurrencyConverter } from "@/utils/CurrencyConvertion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const TransactionForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { convertCurrency, isLoading, error } = useCurrencyConverter();

  const [formData, setFormData] = useState({
    type: "income",
    amount: 0,
    currency: "USD",
    category: "salary",
    email: session?.user?.email || "",
  });

  const convertedAmount =
    formData.currency !== "USD"
      ? convertCurrency(parseFloat(formData.amount), formData.currency, "USD")
      : parseFloat(formData.amount);

  const [addTransaction] = useAddTransactionMutation();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.currency) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: convertedAmount.toFixed(2), // Send only the converted amount
      };
      await addTransaction(transactionData);
      toast.success("Transaction added successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error("Failed to add transaction. Please try again.");
    }
  };

  return (
    <div className="md:w-[50%] mx-auto px-2">
      <h2 className="text-center border-b-2 text-xl mt-4 mb-6 md:mb-10 text-[#58dede] font-semibold">
        Transaction Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label htmlFor="type" className="block text-gray-700 mb-2">
            Type
          </label>
          <select
            name="type"
            id="type"
            className="border rounded-md p-2 w-full focus:border-[#58dede] focus:outline-none"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            className="border rounded-md p-2 w-full focus:border-[#58dede] focus:outline-none"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="currency"
            id="currency"
            className="border rounded-md p-2 w-full focus:border-[#58dede] focus:outline-none"
            value={formData.currency}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BDT">BDT</option>
            <option value="INR">INR</option>
            {/* Add more currencies as needed */}
          </select>
        </div>

        {/* Amount in USD */}
        <div>
          <p className="text-gray-700 mb-3 ">
            Amount in USD: <span className="bg-white shadow-md px-1">${convertedAmount.toFixed(2)}</span> 
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="border rounded-md p-2 w-full focus:border-[#58dede] focus:outline-none"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="salary">Salary</option>
            <option value="food">Food</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 my-5 bg-[#58dede] text-white rounded-md hover:bg-[#45b6b6] transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default TransactionForm;
