import { useState } from "react";
import {
  StaticButton,
  StaticLoader,
  SubmitButton,
  TextInput,
} from "../../../../../Components/Components";
import { useAuth } from "../../../../../Context/Auth";
import axios from "axios";

const AddEmailSection = ({ setUpdate }) => {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setEmail("");
    setName("");
  };

  const handleEmailAdd = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      auth.toastError("Please enter an email.");
      return;
    }

    if (!name.trim()) {
      auth.toastError("Please enter a name.");
      return;
    }

    const finalUrl = `https://sultanayubbcknd.food2go.online/admin/settings/business_setup/order_delay_notification/add?email=${encodeURIComponent(email.trim())}`;

    const bodyData = new URLSearchParams();
    bodyData.append("name", name.trim());

    try {
      setLoading(true);

      await axios.post(finalUrl, bodyData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // << اضفنا التوكن هنا
        },
      });

      auth.toastSuccess("Email Added Successfully");
      handleReset();
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Error adding email:", error);
      auth.toastError(
        error.response?.data?.message || "Failed to add email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-56 flex justify-center items-center">
          <StaticLoader />
        </div>
      ) : (
        <section>
          <form onSubmit={handleEmailAdd}>
            <div className="sm:py-3 lg:py-6">
              <div className="w-full flex flex-wrap gap-4">
                {/* Email Input */}
                <div className="w-[25%] flex flex-col gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Email:
                  </span>
                  <TextInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                  />
                </div>

                {/* Name Input */}
                <div className="w-[25%] flex flex-col gap-y-1">
                  <span className="text-xl font-TextFontRegular text-thirdColor">
                    Name:
                  </span>
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-[50%] m-auto flex justify-end gap-x-4 mt-4">
              <StaticButton
                text="Reset"
                handleClick={handleReset}
                bgColor="bg-transparent"
                Color="text-mainColor"
                border="border-2"
                borderColor="border-mainColor"
                rounded="rounded-full"
                className="px-4 py-2 text-base"
              />
              <SubmitButton
                text="Submit"
                rounded="rounded-full"
                handleClick={handleEmailAdd}
                className="px-4 py-2 text-base"
              />
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default AddEmailSection;
