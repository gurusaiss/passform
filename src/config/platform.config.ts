// Centralized Platform Configuration
// Allows changing branding, event information, WhatsApp onboarding links, and form fields
// without modifying core application code.

export interface CustomFieldConfig {
  id: string;
  label: string;
  type: "text" | "select" | "radio" | "checkbox" | "textarea" | "number";
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface PlatformConfig {
  branding: {
    platformName: string;
    organizationName: string;
    tagline: string;
    logoUrl?: string;
    primaryColor?: string;
    supportEmail: string;
    contactPhone?: string;
  };
  event: {
    title: string;
    subtitle: string;
    description: string;
    badgeText: string;
    date: string;
    time: string;
    venue: string;
    isVirtual: boolean;
    virtualPlatform?: string;
    calendarSummary: string;
    calendarDescription: string;
    targetAudience: string[];
    highlights: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  onboarding: {
    whatsappGroupUrl: string;
    whatsappGroupName: string;
    whatsappInstructions: string;
    whatsappSecurityNotice: string;
  };
  registration: {
    isOpen: boolean;
    maxRegistrations?: number;
    requireConsent: boolean;
    consentText: string;
    privacyPolicyUrl: string;
    termsUrl: string;
    customFields: CustomFieldConfig[];
  };
}

export const defaultPlatformConfig: PlatformConfig = {
  branding: {
    platformName: "Community Connect",
    organizationName: "Global Tech Initiatives",
    tagline: "Empowering Next-Generation Innovators & Leaders",
    supportEmail: "connect@community.example.com",
    contactPhone: "+91 98765 43210",
  },
  event: {
    title: "National Innovation & Leadership Summit 2026",
    subtitle: "A Premier Gathering for Future Technologists & Changemakers",
    description:
      "Join 500+ aspiring technologists, innovators, and industry mentors for an immersive one-day summit featuring hands-on masterclasses, peer networking, and direct community mentorship.",
    badgeText: "Registrations Now Open • Limited Seats",
    date: "Saturday, December 12, 2026",
    time: "09:30 AM – 05:00 PM IST",
    venue: "Main Auditorium & Virtual Hybrid Stream",
    isVirtual: false,
    calendarSummary: "National Innovation & Leadership Summit 2026",
    calendarDescription:
      "Official registration confirmed. Please present your reference pass at the entrance or log in online. Official community updates on WhatsApp.",
    targetAudience: [
      "Engineering, Technology & Science Students (All Years)",
      "Early-Career Developers, Designers & Product Specialists",
      "Community Organizers, Researchers & Startup Enthusiasts",
      "Anyone passionate about digital transformation and leadership",
    ],
    highlights: [
      {
        title: "Industry Keynotes & Panels",
        description:
          "Hear directly from senior technology executives, engineering directors, and pioneering researchers on emerging trends.",
        icon: "Sparkles",
      },
      {
        title: "Interactive Masterclasses",
        description:
          "Practical deep-dive sessions on AI applications, modern cloud architecture, and product leadership.",
        icon: "Cpu",
      },
      {
        title: "Exclusive WhatsApp Community",
        description:
          "Instant access to curated speaker slides, collaborative projects, peer networking, and post-summit initiatives.",
        icon: "MessageSquare",
      },
      {
        title: "Verified Attendee Certificate",
        description:
          "Receive a digitally verifiable credential to showcase your participation and newly acquired skills.",
        icon: "Award",
      },
    ],
    faqs: [
      {
        question: "Is there any registration fee for the summit?",
        answer:
          "No, Phase 1 registrations are completely free of charge. However, seats are limited and allocations are confirmed on a first-come, first-served basis.",
      },
      {
        question: "How do I join the official WhatsApp community?",
        answer:
          "Immediately upon submitting the registration form, you will receive a unique reference pass and a direct 'Join WhatsApp Group' button. You will also receive a confirmation email with the link.",
      },
      {
        question: "Can I attend virtually if I cannot travel to the venue?",
        answer:
          "Yes! The keynote and primary track sessions will be live-streamed with interactive Q&A available via the WhatsApp community.",
      },
      {
        question: "What if I did not receive my confirmation email?",
        answer:
          "Check your spam or promotions tab. You can also save or screenshot your digital reference pass displayed on the confirmation page.",
      },
      {
        question: "Can I update my registration details after submitting?",
        answer:
          "If you need to make changes, please contact the organizing team at our support email with your reference ID.",
      },
    ],
  },
  onboarding: {
    whatsappGroupUrl:
      process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_URL ||
      "https://chat.whatsapp.com/sampleInviteCode123",
    whatsappGroupName: "Innovation Summit 2026 Attendees",
    whatsappInstructions:
      "Tap below to join the official WhatsApp group. This group is reserved for registered attendees for session updates, networking, and speaker materials.",
    whatsappSecurityNotice:
      "Please note: For security and spam prevention, unauthorized solicitations and spam in the community will result in immediate removal.",
  },
  registration: {
    isOpen: true,
    maxRegistrations: 500,
    requireConsent: true,
    consentText:
      "I agree to receive event updates, pass details, and community access communications via email and WhatsApp. I understand my information will be handled according to the privacy policy.",
    privacyPolicyUrl: "/privacy",
    termsUrl: "/terms",
    customFields: [
      {
        id: "organization",
        label: "College / Company / Organization",
        type: "text",
        required: true,
        placeholder: "e.g. ABC Institute of Technology or TechCorp",
        helperText: "Your current university or employer name",
      },
      {
        id: "role",
        label: "Primary Role / Current Year",
        type: "select",
        required: true,
        options: [
          "Student (1st / 2nd Year)",
          "Student (3rd / 4th Year)",
          "Recent Graduate (Class of 2025/2026)",
          "Working Professional (1-3 Years Experience)",
          "Senior Professional / Manager (4+ Years)",
          "Academic Faculty / Researcher",
          "Founder / Freelancer",
        ],
      },
      {
        id: "primaryInterest",
        label: "Primary Track of Interest",
        type: "select",
        required: false,
        options: [
          "Artificial Intelligence & Machine Learning",
          "Cloud Infrastructure & Distributed Systems",
          "Full-Stack Web & Mobile Engineering",
          "Cybersecurity & Data Privacy",
          "Product Management & UX Innovation",
        ],
      },
      {
        id: "referralSource",
        label: "How did you discover this event?",
        type: "select",
        required: false,
        options: [
          "Promotional Poster / Standee QR Code",
          "WhatsApp Group / Friend Forward",
          "Instagram / Social Media",
          "LinkedIn",
          "College Notice Board / Faculty",
          "Other",
        ],
      },
    ],
  },
};
