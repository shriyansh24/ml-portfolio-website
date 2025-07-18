import { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import Contact from "@/components/contact/Contact";
import { generateMetadata } from "@/components/SEOHead";

export const metadata: Metadata = generateMetadata({
  title: "Contact | ML Portfolio",
  description: "Get in touch with me for collaborations, questions, or opportunities in machine learning and AI.",
  keywords: ["contact", "machine learning", "AI", "collaboration", "hire"],
});

export default function ContactPage() {
  return (
    <Layout>
      <Contact 
        title="Contact Me"
        subtitle="Have a question or want to work together? Feel free to reach out using the form below or through my social media profiles."
      />
    </Layout>
  );
}