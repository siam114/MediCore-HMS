"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Stethoscope,
  X,
  Loader2,
  Activity,
  HeartPulse,
  Thermometer,
  Scale,
  Calendar,
  AlertCircle,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { prescriptionService } from "@/services/api";
import type {
  Doctor,
  Appointment,
  Prescription,
  PrescriptionMedicine,
  PatientVitals,
} from "@/types";

interface CreatePrescriptionDialogProps {
  appointment: Appointment | null;
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (prescription: Prescription) => void;
}

const DEFAULT_MEDICINE: PrescriptionMedicine = {
  name: "",
  dosage: "1+0+1",
  duration: "7 Days",
  instruction: "After meal",
};

export function CreatePrescriptionDialog({
  appointment,
  doctor,
  isOpen,
  onClose,
  onSuccess,
}: CreatePrescriptionDialogProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">(30);
  const [patientGender, setPatientGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");

  // Vitals
  const [bp, setBp] = useState("120/80 mmHg");
  const [pulse, setPulse] = useState("76 bpm");
  const [temp, setTemp] = useState("98.4 °F");
  const [weight, setWeight] = useState("68 kg");

  // Clinical findings
  const [diagnosis, setDiagnosis] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    { name: "Tab. Paracetamol 500mg", dosage: "1+1+1", duration: "5 Days", instruction: "After meal (If fever/pain)" },
  ]);
  const [investigationsInput, setInvestigationsInput] = useState("");
  const [advice, setAdvice] = useState("Drink plenty of fluids and rest. Avoid spicy/oily food.");
  const [followUpDate, setFollowUpDate] = useState("After 7 days");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setPatientName(appointment.patientName);
      setPatientPhone(appointment.patientPhone);
      setPatientAge(appointment.patientAge);
      setPatientGender(appointment.patientGender);
      if (appointment.problemDescription) {
        setSymptomsInput(appointment.problemDescription);
      }
    }
  }, [appointment]);

  if (!isOpen) return null;

  const handleAddMedicine = () => {
    setMedicines((prev) => [...prev, { ...DEFAULT_MEDICINE }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length <= 1) {
      toast.error("At least one medicine is required");
      return;
    }
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctor?.id) {
      toast.error("Doctor profile is missing or invalid");
      return;
    }

    if (!diagnosis.trim()) {
      toast.error("Please enter a clinical diagnosis");
      return;
    }

    // Validate medicines
    const validMedicines = medicines.filter((m) => m.name.trim().length > 0);
    if (validMedicines.length === 0) {
      toast.error("Please add at least one valid medicine with a name");
      return;
    }

    const vitals: PatientVitals = {
      bloodPressure: bp.trim() || undefined,
      pulseRate: pulse.trim() || undefined,
      temperature: temp.trim() || undefined,
      weight: weight.trim() || undefined,
    };

    const symptoms = symptomsInput
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const investigations = investigationsInput
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      const res = await prescriptionService.create({
        appointmentId: appointment?.id,
        serialNumber: appointment?.serialNumber,
        doctorId: doctor.id,
        patientId: appointment?.patientId,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: Number(patientAge) || 30,
        patientGender,
        vitals,
        diagnosis: diagnosis.trim(),
        symptoms,
        medicines: validMedicines,
        investigations,
        advice: advice.trim(),
        followUpDate: followUpDate.trim(),
      });

      if (res.success && res.data) {
        toast.success(`Digital Prescription Generated!`, {
          description: `Rx #${res.data.prescription.prescriptionNumber} created successfully.`,
        });
        onSuccess?.(res.data.prescription);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create prescription";
      toast.error("Prescription Creation Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-3.5 sm:py-4 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 truncate">
                  E-Prescription Consultation Pad
                </h3>
                {appointment?.serialNumber && (
                  <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    Token #{appointment.serialNumber}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                Attending: <span className="font-semibold text-slate-700 dark:text-slate-300">{doctor?.name}</span> ({doctor?.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 shrink-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs sm:text-sm flex-1">
          {/* Patient Details Row */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              Patient Bio Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Patient Name *</Label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Full Name"
                  required
                />
              </div>
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs">Contact Phone *</Label>
                <Input
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="01567898506"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Age (Years) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="125"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Gender *</Label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 pr-8 py-1 text-sm shadow-sm cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clinical Vitals Row */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-3 flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4" />
              Patient Clinical Vitals
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <Activity className="h-3 w-3 text-red-500" />
                  Blood Pressure
                </Label>
                <Input
                  placeholder="120/80 mmHg"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <HeartPulse className="h-3 w-3 text-rose-500" />
                  Pulse Rate
                </Label>
                <Input
                  placeholder="76 bpm"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-amber-500" />
                  Temperature
                </Label>
                <Input
                  placeholder="98.4 °F"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <Scale className="h-3 w-3 text-blue-500" />
                  Body Weight
                </Label>
                <Input
                  placeholder="68 kg"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Diagnosis & Symptoms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="diagnosis" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Primary Diagnosis *
              </Label>
              <Input
                id="diagnosis"
                placeholder="e.g. Essential Hypertension & Grade-1 Fatty Liver"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="symptoms" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Presenting Symptoms (comma separated)
              </Label>
              <Input
                id="symptoms"
                placeholder="e.g. Occasional dizziness, Morning headache, Palpitation"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Rx / Medicines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-serif font-bold text-sm">
                  ℞
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  Prescribed Medications (Rx)
                </h4>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddMedicine}
                className="gap-1.5 text-xs text-teal-700 border-teal-300 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-2">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 sm:gap-2.5 items-center rounded-xl border border-slate-200 p-3 sm:p-3.5 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-xs"
                >
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Medicine & Strength *</Label>
                    <Input
                      placeholder="e.g. Tab. Amlodipine 5mg"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2 space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Dosage *</Label>
                    <Input
                      placeholder="e.g. 1+0+1"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2 space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Duration *</Label>
                    <Input
                      placeholder="e.g. 14 Days"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-10 sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Instructions</Label>
                    <Input
                      placeholder="e.g. After meal"
                      value={med.instruction}
                      onChange={(e) => handleMedicineChange(index, "instruction", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Investigations & Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="investigations" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Recommended Diagnostic Investigations (Tests)
              </Label>
              <textarea
                id="investigations"
                rows={3}
                placeholder="e.g. ECG (12-Lead), Lipid Profile, Serum Creatinine, RBS"
                value={investigationsInput}
                onChange={(e) => setInvestigationsInput(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="advice" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Special Advice & Lifestyle Directions
              </Label>
              <textarea
                id="advice"
                rows={3}
                placeholder="e.g. Low salt diet, 30 mins brisk walking daily, maintain blood pressure diary"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Follow up */}
          <div className="space-y-1.5 max-w-xs">
            <Label htmlFor="followUp" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Follow-up Review Date
            </Label>
            <Input
              id="followUp"
              placeholder="e.g. After 7 days / with test reports"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold w-full sm:w-auto h-10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 sm:h-11 px-7 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Rx...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Issue Prescription
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
