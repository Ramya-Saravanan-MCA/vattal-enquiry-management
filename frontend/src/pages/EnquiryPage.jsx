import { useEffect, useState } from "react";
import api from "../api/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  project_type: "",
  budget: "",
  message: "",
};

const services = [
  "Creative Film Promotions",
  "Professional Filming",
  "Movie Making Videos",
  "Social Media Management & Strategy",
  "Influencer Marketing",
  "AD Films",
  "Expert Editing",
  "Captivating Photoshoots",
];

const countries = [
  {
    code: "+91",
    country: "India",
    flag: "🇮🇳",
    min: 10,
    max: 10,
  },
  {
    code: "+1",
    country: "USA / Canada",
    flag: "🇺🇸",
    min: 10,
    max: 10,
  },
  {
    code: "+44",
    country: "United Kingdom",
    flag: "🇬🇧",
    min: 10,
    max: 10,
  },
  {
    code: "+971",
    country: "UAE",
    flag: "🇦🇪",
    min: 9,
    max: 9,
  },
  {
    code: "+966",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    min: 9,
    max: 9,
  },
  {
    code: "+65",
    country: "Singapore",
    flag: "🇸🇬",
    min: 8,
    max: 8,
  },
  {
    code: "+60",
    country: "Malaysia",
    flag: "🇲🇾",
    min: 9,
    max: 10,
  },
  {
    code: "+61",
    country: "Australia",
    flag: "🇦🇺",
    min: 9,
    max: 9,
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

function EnquiryPage() {
  const [form, setForm] = useState(initialForm);
  const [countryCode, setCountryCode] = useState("+91");
  const [attachment, setAttachment] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&display=swap";

    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
  if (!success) {
    return;
  }

  const timer = setTimeout(() => {
    setSuccess("");
  }, 10000);

  return () => clearTimeout(timer);
}, [success]);

  const validateField = (
    name,
    value,
    currentCountryCode = countryCode
  ) => {
    const trimmedValue =
      typeof value === "string"
        ? value.trim()
        : value;

    switch (name) {
      case "name":
        if (!trimmedValue) {
          return "Please enter your name.";
        }

        if (trimmedValue.length < 2) {
          return "Name must contain at least 2 characters.";
        }

        if (trimmedValue.length > 100) {
          return "Name cannot exceed 100 characters.";
        }

        if (
          !/^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F]+(?:[\s.'-][a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F]+)*$/.test(
            trimmedValue
          )
        ) {
          return "Please enter a valid name.";
        }

        return "";

      case "email":
        if (!trimmedValue) {
          return "Please enter your email address.";
        }

        if (trimmedValue.length > 254) {
          return "Email address is too long.";
        }

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
            trimmedValue
          )
        ) {
          return "Please enter a valid email address.";
        }

        return "";

      case "phone": {
        if (!trimmedValue) {
          return "";
        }

        if (!/^\d+$/.test(trimmedValue)) {
          return "Phone number can contain digits only.";
        }

        const selectedCountry = countries.find(
          (country) =>
            country.code === currentCountryCode
        );

        if (currentCountryCode === "+91") {
          if (trimmedValue.length !== 10) {
            return "Indian mobile number must contain exactly 10 digits.";
          }

          if (!/^[6-9]/.test(trimmedValue)) {
            return "Indian mobile number must start with 6, 7, 8 or 9.";
          }

          return "";
        }

        if (
          trimmedValue.length <
            (selectedCountry?.min || 7) ||
          trimmedValue.length >
            (selectedCountry?.max || 15)
        ) {
          if (
            selectedCountry?.min ===
            selectedCountry?.max
          ) {
            return `Phone number must contain exactly ${selectedCountry.min} digits.`;
          }

          return `Phone number must contain ${selectedCountry?.min} to ${selectedCountry?.max} digits.`;
        }

        return "";
      }

      case "company":
        if (trimmedValue.length > 150) {
          return "Brand or company name cannot exceed 150 characters.";
        }

        return "";

      case "project_type":
        if (!trimmedValue) {
          return "Please choose a service.";
        }

        return "";

      case "budget":
        if (!trimmedValue) {
          return "";
        }

        if (!/^\d+$/.test(trimmedValue)) {
          return "Budget can contain numbers only.";
        }

        if (
          !Number.isFinite(Number(trimmedValue)) ||
          Number(trimmedValue) <= 0
        ) {
          return "Budget must be greater than ₹0.";
        }

        return "";

      case "message":
        if (!trimmedValue) {
          return "Please tell us about your project.";
        }

        if (trimmedValue.length < 10) {
          return "Project details must contain at least 10 characters.";
        }

        if (trimmedValue.length > 5000) {
          return "Project details cannot exceed 5000 characters.";
        }

        return "";

      default:
        return "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "name") {
      nextValue = value.replace(
        /[^a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\s.'-]/g,
        ""
      );
    }

    if (name === "budget") {
      nextValue = value.replace(/\D/g, "");
    }

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    if (touched[name] || fieldErrors[name]) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: validateField(
          name,
          nextValue
        ),
      }));
    }

    setSuccess("");
    setError("");
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: validateField(name, value),
    }));
  };

  const handlePhoneChange = (event) => {
    const selectedCountry = countries.find(
      (country) => country.code === countryCode
    );

    const digits = event.target.value
      .replace(/\D/g, "")
      .slice(0, selectedCountry?.max || 15);

    setForm((previous) => ({
      ...previous,
      phone: digits,
    }));

    if (touched.phone || fieldErrors.phone) {
      setFieldErrors((previous) => ({
        ...previous,
        phone: validateField(
          "phone",
          digits,
          countryCode
        ),
      }));
    }

    setSuccess("");
    setError("");
  };

  const handlePhoneBlur = () => {
    setTouched((previous) => ({
      ...previous,
      phone: true,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      phone: validateField(
        "phone",
        form.phone,
        countryCode
      ),
    }));
  };

  const handleCountryChange = (event) => {
    const newCountryCode = event.target.value;

    setCountryCode(newCountryCode);

    setForm((previous) => ({
      ...previous,
      phone: "",
    }));

    setTouched((previous) => ({
      ...previous,
      phone: false,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      phone: "",
    }));

    setSuccess("");
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setTouched((previous) => ({
      ...previous,
      attachment: true,
    }));

    setSuccess("");
    setError("");

    if (!file) {
      setAttachment(null);

      setFieldErrors((previous) => ({
        ...previous,
        attachment: "",
      }));

      return;
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    const validExtension = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
    ].includes(extension);

    if (
      !validExtension ||
      !ALLOWED_FILE_TYPES.includes(file.type)
    ) {
      setAttachment(null);

      setFieldErrors((previous) => ({
        ...previous,
        attachment:
          "Only PDF, JPG, JPEG or PNG files are allowed.",
      }));

      event.target.value = "";

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setAttachment(null);

      setFieldErrors((previous) => ({
        ...previous,
        attachment:
          "File size must be 5 MB or less.",
      }));

      event.target.value = "";

      return;
    }

    setAttachment(file);

    setFieldErrors((previous) => ({
      ...previous,
      attachment: "",
    }));
  };

  const validateForm = () => {
    const errors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      phone: validateField(
        "phone",
        form.phone,
        countryCode
      ),
      company: validateField(
        "company",
        form.company
      ),
      project_type: validateField(
        "project_type",
        form.project_type
      ),
      budget: validateField(
        "budget",
        form.budget
      ),
      message: validateField(
        "message",
        form.message
      ),
    };

    if (attachment) {
      const extension = attachment.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (
        !["pdf", "jpg", "jpeg", "png"].includes(
          extension
        ) ||
        !ALLOWED_FILE_TYPES.includes(
          attachment.type
        )
      ) {
        errors.attachment =
          "Only PDF, JPG, JPEG or PNG files are allowed.";
      } else if (
        attachment.size > MAX_FILE_SIZE
      ) {
        errors.attachment =
          "File size must be 5 MB or less.";
      }
    }

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) {
        delete errors[key];
      }
    });

    setTouched({
      name: true,
      email: true,
      phone: true,
      company: true,
      project_type: true,
      budget: true,
      message: true,
      attachment: true,
    });

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
  const requiredFieldsValid =
    !validateField("name", form.name) &&
    !validateField("email", form.email) &&
    !validateField(
      "phone",
      form.phone,
      countryCode
    ) &&
    !validateField(
      "company",
      form.company
    ) &&
    !validateField(
      "project_type",
      form.project_type
    ) &&
    !validateField(
      "budget",
      form.budget
    ) &&
    !validateField(
      "message",
      form.message
    );

  const attachmentValid =
    !fieldErrors.attachment;

  return requiredFieldsValid && attachmentValid;
};

const canSubmit = isFormValid() && !loading;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append(
      "name",
      form.name.trim()
    );

    formData.append(
      "email",
      form.email.trim()
    );

    if (form.phone) {
      formData.append(
        "phone",
        `${countryCode}${form.phone}`
      );
    }

    if (form.company.trim()) {
      formData.append(
        "company",
        form.company.trim()
      );
    }

    formData.append(
      "project_type",
      form.project_type
    );

    if (form.budget) {
      formData.append(
        "budget",
        form.budget
      );
    }

    formData.append(
      "message",
      form.message.trim()
    );

    if (attachment) {
      formData.append(
        "attachment",
        attachment
      );
    }

    try {
      await api.post(
        "/enquiries",
        formData
      );

      setSuccess(
        "Thank you. Your project enquiry has been sent successfully."
      );

      setForm(initialForm);
      setCountryCode("+91");
      setAttachment(null);
      setFieldErrors({});
      setTouched({});

      const fileInput =
        document.getElementById(
          "attachment"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "We couldn't send your enquiry. Please check the details and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fontPrimary = {
    fontFamily: "'Montserrat', sans-serif",
  };

  const fontDisplay = {
    fontFamily: "'Raleway', sans-serif",
  };

  const inputStyle =
    "w-full rounded-xl border border-[#160B22]/15 bg-white/85 px-4 py-3.5 text-[13px] font-medium text-[#160B22] outline-none transition-all duration-300 placeholder:font-normal placeholder:text-[#160B22]/35 hover:border-[#160B22]/30 hover:bg-white focus:-translate-y-[1px] focus:border-[#E6B900] focus:bg-white focus:shadow-[0_8px_30px_rgba(230,185,0,0.10)] focus:ring-4 focus:ring-[#F2C500]/10";

  const errorInputStyle =
    "border-red-400 bg-red-50/20 focus:border-red-400 focus:ring-red-100";

  const validInputStyle =
    "border-emerald-500/40";

  const labelStyle =
    "mb-2 block text-[9px] font-semibold uppercase tracking-[0.17em] text-[#160B22]/70";

  const getInputState = (name) => {
    if (fieldErrors[name]) {
      return errorInputStyle;
    }

    if (
      touched[name] &&
      !fieldErrors[name] &&
      form[name]?.toString().trim()
    ) {
      return validInputStyle;
    }

    return "";
  };

  const FieldError = ({ message }) => {
    if (!message) {
      return null;
    }

    return (
      <div className="mt-2 flex items-start gap-1.5">
        <span className="mt-[2px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[8px] font-bold text-red-600">
          !
        </span>

        <p className="text-[9px] font-medium leading-4 text-red-600">
          {message}
        </p>
      </div>
    );
  };

  const selectedCountry =
    countries.find(
      (country) =>
        country.code === countryCode
    ) || countries[0];

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#F8F5EF] text-[#160B22]"
      style={fontPrimary}
    >
      <div className="pointer-events-none absolute -left-52 -top-52 h-[550px] w-[550px] rounded-full bg-[#F2C500]/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-52 top-[18%] h-[550px] w-[550px] rounded-full bg-[#160B22]/[0.055] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-280px] left-[30%] h-[550px] w-[550px] rounded-full bg-[#F2C500]/10 blur-[150px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#160B22 1px, transparent 1px), linear-gradient(90deg, #160B22 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute left-[7%] top-[23%] hidden h-2.5 w-2.5 animate-pulse rounded-full bg-[#F2C500] lg:block" />

      <div className="pointer-events-none absolute left-[10%] top-[28%] hidden h-1.5 w-1.5 rounded-full bg-[#160B22]/35 lg:block" />

      <div className="pointer-events-none absolute bottom-[12%] left-[44%] hidden h-2 w-2 animate-pulse rounded-full bg-[#F2C500]/70 lg:block" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col">
        <nav className="flex items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
          <div className="group flex cursor-default items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#160B22] text-sm font-semibold text-[#F2C500] shadow-sm transition-all duration-500 group-hover:-rotate-6 group-hover:shadow-[0_8px_25px_rgba(22,11,34,0.18)]">
              <span className="relative z-10">
                V
              </span>

              <span className="absolute inset-x-0 bottom-0 h-0 bg-[#F2C500] transition-all duration-500 group-hover:h-full" />

              <span className="absolute z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:text-[#160B22]">
                V
              </span>
            </div>

            <div>
              <p
                className="text-[13px] font-semibold tracking-[0.2em] text-[#160B22]"
                style={fontDisplay}
              >
                VATTAL
              </p>

              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#160B22]/60">
                Studios
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-[#160B22]/10 bg-white/70 px-4 py-2.5 text-[9px] font-medium tracking-wide text-[#160B22]/70 shadow-sm backdrop-blur-xl sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2C500] opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2C500]" />
            </span>

            Let's create something
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-14 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:pb-20 lg:pt-4">
          <section className="relative">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#F2C500]/50 bg-[#F2C500]/10 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2C500] opacity-50" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2C500]" />
              </span>

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#806600]">
                Start a project with us
              </span>
            </div>

            <h1
              className="max-w-[720px] text-[50px] font-normal leading-[1.02] tracking-[-0.045em] text-[#160B22] sm:text-[64px] lg:text-[68px] xl:text-[78px]"
              style={fontDisplay}
            >
              Stories deserve
              <span className="block">
                to be{" "}
                <span className="relative inline-block font-medium text-[#CDA500]">
                  remembered.
                  <span className="absolute -bottom-2 left-1 h-[2px] w-[96%] origin-left rounded-full bg-[#F2C500]/80" />
                </span>
              </span>
            </h1>

            <p className="mt-8 max-w-[550px] text-[14px] font-normal leading-7 text-[#160B22]/70 sm:text-[15px]">
              From film promotions and professional shoots to social campaigns
              and visual storytelling, share your idea with us and let's turn
              it into something people remember.
            </p>

            <div className="mt-10 flex max-w-[650px] flex-wrap gap-2.5">
              {services.map(
                (service, index) => (
                  <div
                    key={service}
                    className={`group cursor-default rounded-full border px-4 py-2.5 text-[10px] font-medium tracking-wide transition-all duration-500 hover:-translate-y-1 ${
                      index % 2 === 0
                        ? "border-[#F2C500]/45 bg-[#F2C500]/10 text-[#806600] hover:border-[#F2C500] hover:bg-[#F2C500] hover:text-[#160B22] hover:shadow-[0_10px_25px_rgba(242,197,0,0.18)]"
                        : "border-[#160B22]/15 bg-white/70 text-[#160B22]/75 hover:border-[#160B22] hover:bg-[#160B22] hover:text-[#F2C500] hover:shadow-[0_10px_25px_rgba(22,11,34,0.14)]"
                    }`}
                  >
                    {service}
                  </div>
                )
              )}
            </div>

            <div className="mt-12 max-w-[600px]">
              <div className="relative overflow-hidden rounded-[24px] border border-[#160B22]/10 bg-white/55 px-6 py-5 shadow-[0_12px_35px_rgba(22,11,34,0.05)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#F2C500]/50 hover:shadow-[0_18px_45px_rgba(22,11,34,0.08)]">
                <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#F2C500]" />

                <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#F2C500]/10 blur-2xl" />

                <div className="relative flex items-start gap-5">
                  <span
                    className="mt-1 text-[38px] font-medium leading-none text-[#F2C500]"
                    style={fontDisplay}
                  >
                    “
                  </span>

                  <div>
                    <p
                      className="max-w-[470px] text-[17px] font-medium leading-[1.65] tracking-[-0.015em] text-[#160B22]"
                      style={fontDisplay}
                    >
                      We shape ideas into visual experiences that people
                      notice, feel and remember.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-px w-8 bg-[#F2C500]" />

                      <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#160B22]/55">
                        Vattal Studios
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-1 top-[-45px] hidden h-28 w-28 rotate-12 items-center justify-center rounded-full border border-[#F2C500]/50 bg-[#F2C500]/[0.07] text-center text-[8px] font-semibold uppercase leading-4 tracking-[0.2em] text-[#8A6E00] xl:flex">
              Think
              <br />
              Create
              <br />
              Inspire
            </div>
          </section>

          <section className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rotate-6 rounded-[30px] bg-[#F2C500] opacity-90 shadow-[0_18px_50px_rgba(242,197,0,0.20)]" />

            <div className="absolute -bottom-7 -right-7 h-32 w-32 rounded-full bg-[#160B22]/10" />

            <div className="absolute -right-3 top-[29%] h-14 w-14 rotate-12 rounded-2xl border border-[#F2C500]/30 bg-[#F2C500]/15" />

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative z-10 rounded-[32px] border border-white/90 bg-white/[0.86] p-6 shadow-[0_35px_100px_rgba(22,11,34,0.11)] backdrop-blur-2xl sm:p-8 xl:p-10"
            >
              <div className="mb-9">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-[#F2C500]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8A6E00]">
                    Project Enquiry
                  </span>
                </div>

                <h2
                  className="text-3xl font-medium tracking-[-0.03em] text-[#160B22] sm:text-[38px]"
                  style={fontDisplay}
                >
                  Tell us your story.
                </h2>

                <p className="mt-2 text-[11px] font-normal leading-5 text-[#160B22]/60">
                  Give us a little context. We'll take it from there.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className={labelStyle}
                  >
                    Your name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    maxLength={100}
                    className={`${inputStyle} ${getInputState(
                      "name"
                    )}`}
                  />

                  <FieldError
                    message={
                      fieldErrors.name
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={labelStyle}
                  >
                    Email *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@company.com"
                    maxLength={254}
                    className={`${inputStyle} ${getInputState(
                      "email"
                    )}`}
                  />

                  <FieldError
                    message={
                      fieldErrors.email
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className={labelStyle}
                  >
                    Phone
                  </label>

                  <div
                    className={`flex rounded-xl border bg-white/85 transition-all duration-300 focus-within:ring-4 ${
                      fieldErrors.phone
                        ? "border-red-400 bg-red-50/20 focus-within:border-red-400 focus-within:ring-red-100"
                        : touched.phone &&
                            form.phone
                          ? "border-emerald-500/40 focus-within:border-[#E6B900] focus-within:ring-[#F2C500]/10"
                          : "border-[#160B22]/15 hover:border-[#160B22]/30 focus-within:border-[#E6B900] focus-within:ring-[#F2C500]/10"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <select
                        value={
                          countryCode
                        }
                        onChange={
                          handleCountryChange
                        }
                        aria-label="Country code"
                        className="h-full w-[108px] cursor-pointer appearance-none rounded-l-xl bg-[#FAF8F3] py-3.5 pl-3 pr-7 text-[11px] font-semibold text-[#160B22] outline-none"
                      >
                        {countries.map(
                          (country) => (
                            <option
                              key={`${country.country}-${country.code}`}
                              value={
                                country.code
                              }
                            >
                              {
                                country.flag
                              }{" "}
                              {
                                country.code
                              }
                            </option>
                          )
                        )}
                      </select>

                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#806600]"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="my-2.5 w-px shrink-0 bg-[#160B22]/10" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={
                        handlePhoneChange
                      }
                      onBlur={
                        handlePhoneBlur
                      }
                      placeholder={
                        countryCode ===
                        "+91"
                          ? "9876543210"
                          : `${selectedCountry.min}${
                              selectedCountry.min !==
                              selectedCountry.max
                                ? `-${selectedCountry.max}`
                                : ""
                            } digits`
                      }
                      className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3.5 py-3.5 text-[13px] font-medium text-[#160B22] outline-none placeholder:font-normal placeholder:text-[#160B22]/35"
                    />
                  </div>

                  <FieldError
                    message={
                      fieldErrors.phone
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className={labelStyle}
                  >
                    Brand / Company
                  </label>

                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your brand or company"
                    maxLength={150}
                    className={`${inputStyle} ${getInputState(
                      "company"
                    )}`}
                  />

                  <FieldError
                    message={
                      fieldErrors.company
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="project_type"
                    className={labelStyle}
                  >
                    I'm looking for *
                  </label>

                  <div className="relative">
                    <select
                      id="project_type"
                      name="project_type"
                      value={
                        form.project_type
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={handleBlur}
                      className={`${inputStyle} cursor-pointer appearance-none pr-12 ${getInputState(
                        "project_type"
                      )}`}
                    >
                      <option value="">
                        Choose a service
                      </option>

                      <option value="Creative Film Promotions">
                        Creative Film
                        Promotions
                      </option>

                      <option value="Professional Filming">
                        Professional
                        Filming
                      </option>

                      <option value="Movie Making Videos">
                        Movie Making
                        Videos
                      </option>

                      <option value="Social Media Management & Strategy">
                        Social Media
                        Management &
                        Strategy
                      </option>

                      <option value="Influencer Marketing">
                        Influencer
                        Marketing
                      </option>

                      <option value="Ad Films">
                        AD Films
                      </option>

                      <option value="Expert Editing">
                        Expert Editing
                      </option>

                      <option value="Photoshoots">
                        Captivating
                        Photoshoots
                      </option>

                      <option value="Other">
                        Something Else
                      </option>
                    </select>

                    <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#B08D00]"
                      >
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <FieldError
                    message={
                      fieldErrors.project_type
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className={labelStyle}
                  >
                    Estimated Budget
                    (₹)
                  </label>

                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    inputMode="numeric"
                    value={form.budget}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your estimated budget"
                    className={`${inputStyle} ${getInputState(
                      "budget"
                    )}`}
                  />

                  <FieldError
                    message={
                      fieldErrors.budget
                    }
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className={labelStyle}
                >
                  Tell us about the project
                  *
                </label>

                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={5000}
                    placeholder="What's the project about? What are you hoping to create?"
                    className={`${inputStyle} min-h-[125px] resize-none pb-8 leading-6 ${getInputState(
                      "message"
                    )}`}
                  />

                  <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-[#F8F5EF] px-2 py-1 text-[8px] font-medium text-[#160B22]/45">
                    {
                      form.message
                        .length
                    }
                    /5000
                  </span>
                </div>

                <FieldError
                  message={
                    fieldErrors.message
                  }
                />
              </div>

              <div className="mt-5">
                <input
                  id="attachment"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

                <label
                  htmlFor="attachment"
                  className={`group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed bg-[#FAF8F3] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#FFFCF0] hover:shadow-[0_10px_30px_rgba(242,197,0,0.08)] ${
                    fieldErrors.attachment
                      ? "border-red-400 bg-red-50/20"
                      : attachment
                        ? "border-emerald-500/40"
                        : "border-[#160B22]/20 hover:border-[#F2C500]"
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#160B22]/5 bg-white text-[#927500] shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-[#F2C500] group-hover:text-[#160B22]">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 16V4M12 4L7.5 8.5M12 4L16.5 8.5M5 15.5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V15.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-[#160B22]/75">
                      {attachment
                        ? attachment.name
                        : "Have a brief or reference?"}
                    </p>

                    <p className="mt-1 text-[9px] font-normal text-[#160B22]/50">
                      {attachment
                        ? `${(
                            attachment.size /
                            (1024 * 1024)
                          ).toFixed(
                            2
                          )} MB · Click to choose another file`
                        : "Attach PDF, JPG or PNG · Max 5 MB"}
                    </p>
                  </div>

                  <span className="rounded-full border border-[#160B22]/10 bg-white px-4 py-2 text-[9px] font-semibold text-[#160B22]/60 transition-all duration-300 group-hover:border-[#F2C500]/60 group-hover:text-[#806600]">
                    {attachment
                      ? "Change"
                      : "Browse"}
                  </span>
                </label>

                <FieldError
                  message={
                    fieldErrors.attachment
                  }
                />
              </div>

              {success && (
                <div
                  className="mt-5 flex items-center gap-3 rounded-xl border border-green-600/15 bg-green-50/80 p-4 text-[11px] font-medium text-green-700"
                  role="status"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-[9px] text-white">
                    ✓
                  </span>

                  {success}
                </div>
              )}

              {error && (
                <div
                  className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/15 bg-red-50/80 p-4 text-[11px] font-medium text-red-600"
                  role="alert"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                    !
                  </span>

                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="max-w-[250px] text-[9px] font-medium leading-[1.7] text-[#160B22]/55">
                    Share your idea with us and our team will get back to you.
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-[9px] font-medium text-[#160B22]/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F2C500]" />
                    Your information stays private
                  </div>
                </div>

                <button
                  type="submit"
                   disabled={!canSubmit}
                  className="group relative min-w-[175px] overflow-hidden rounded-full border border-[#160B22] bg-[#160B22] shadow-[0_10px_25px_rgba(22,11,34,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-[#F2C500] hover:shadow-[0_15px_35px_rgba(242,197,0,0.18)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                >
                  <span className="absolute inset-0 translate-y-full bg-[#F2C500] transition-transform duration-500 ease-out group-hover:translate-y-0" />

                  <span className="absolute -left-[80%] top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                  <span className="relative flex items-center justify-center gap-2.5 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors duration-500 group-hover:text-[#160B22]">
                    {loading && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-[#F2C500] group-hover:border-[#160B22]/20 group-hover:border-t-[#160B22]" />
                    )}

                    {loading
                      ? "Sending..."
                      : "Send enquiry"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default EnquiryPage;