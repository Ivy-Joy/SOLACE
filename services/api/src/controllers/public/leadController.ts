//services/api/controllers/public/leadController.ts
import type { Request, Response } from "express";
import LeadApplication from "../../models/LeadApplication";

export async function submitLeadApplication(req: Request, res: Response) {
  try {
    const { 
      name, 
      email, 
      category, 
      serviceArea, 
      otherServiceArea, 
      needsSupport, 
      otherNeedsSupport,
      message 
    } = req.body;

    // 1. Basic Validation
    if (!name || !email || !serviceArea) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // 2. Create the record
    // We map frontend 'category' to backend 'preferredClass' 
    // and 'needsSupport' to 'churchSupport'
    const newApplication = new LeadApplication({
      fullName: name,
      email: email,
      preferredClass: category, 
      serviceArea: serviceArea === "other" ? otherServiceArea : serviceArea,
      churchSupport: needsSupport === "other" ? otherNeedsSupport : needsSupport,
      testimony: message,
      status: "submitted", // Force default status for safety
      createdAt: new Date()
  
    });

    await newApplication.save();

    return res.status(201).json({ 
      success: true, 
      message: "Your application has been received successfully." 
    });
  } catch (err) {
    console.error("Public Lead Submission Error:", err);
    return res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}