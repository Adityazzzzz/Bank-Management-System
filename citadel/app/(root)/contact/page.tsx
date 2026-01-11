"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Github, Linkedin, Twitter, Mail, Send, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import HeaderBox from "@/components/HeaderBox";

// --- Form Schema ---
const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Message sent successfully!");
    form.reset();
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="flex w-full flex-col gap-8 bg-gray-50 p-8 min-h-screen">
      <HeaderBox title="About the Founder" subtext="Let's connect and build something great." />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col xl:flex-row gap-8 mt-4"
      >
        {/* LEFT: FOUNDER CARD */}
        <motion.div variants={itemVariants} className="xl:w-[40%]">
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
                {/* Decorative Background Blob */}
                <div className="absolute -top-24 -right-24 size-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* PROFILE IMAGE */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative size-40 rounded-full border-4 border-white shadow-2xl mb-6 overflow-hidden"
                    >
                        {/* REPLACE WITH YOUR PHOTO */}
                        <Image 
                           src="/icons/aditya.png"
                           alt="Aditya Singh"
                           fill
                           className="object-cover"
                        />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900">Adityazzzz</h2>
                    <p className="text-blue-600 font-medium mb-4">Software Developer Student</p>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <MapPin size={14} />
                        <span>IIIT Bhopal, India</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        Hi! I'm the creator of Citadel. I'm passionate about building fintech solutions, 
                        compiler design, and high-performance web applications. I love turning complex 
                        problems into simple, beautiful interfaces.
                    </p>

                    {/* SOCIAL LINKS */}
                    <div className="flex gap-4">
                        {[
                            { icon: Github, href: "https://github.com/Adityazzzzz", color: "hover:text-black" },
                            { icon: Linkedin, href: "https://www.linkedin.com/in/adityasingh0109/", color: "hover:text-blue-700" },
                            { icon: Twitter, href: "https://x.com/_Adityazzzzz", color: "hover:text-sky-500" },
                        ].map((social, idx) => (
                            <motion.a 
                                key={idx}
                                href={social.href}
                                target="_blank"
                                whileHover={{ y: -3 }}
                                className={`p-3 rounded-xl bg-gray-50 text-gray-600 transition-colors ${social.color}`}
                            >
                                <social.icon size={20} />
                            </motion.a>
                        ))}
                        <motion.a 
                            href="mailto:adityasinghrajawat2004@gmail.com"
                            whileHover={{ y: -3 }}
                            className="p-3 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                        >
                            <Mail size={20} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* RIGHT: CONTACT FORM */}
        <motion.div variants={itemVariants} className="xl:w-[60%]">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 h-full">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Get in Touch</h3>
                    <p className="text-gray-500 mt-1">Have a project in mind or just want to say hi?</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="bg-gray-50 border-gray-200 h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} className="bg-gray-50 border-gray-200 h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Tell me about your project..." 
                                        {...field} 
                                        className="bg-gray-50 border-gray-200 min-h-[150px] resize-none" 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base rounded-xl transition-all shadow-md hover:shadow-lg">
                                Send Message <Send size={18} className="ml-2" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </motion.div>
      </motion.div>

      {/* FOOTER SECTION */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-400">
            Designed & Built by <span className="font-semibold text-blue-600">Aditya Singh</span>
        </p>
      </motion.div>
    </section>
  );
};

export default ContactPage;