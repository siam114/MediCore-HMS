"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FlaskConical, X } from "lucide-react";
import { toast } from "sonner";
import { labReportService } from "@/services/api";
import type { LabTestCategory, LabTestParameter } from "@/types/labReport";

interface CreateLabReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultDoctorName?: string;
  defaultPatientPhone?: string;
}

const TEST_TEMPLATES = [
  {
    name: "Complete Blood Count (CBC) with ESR",
    category: "HEMATOLOGY" as LabTestCategory,
    sampleType: "Whole Blood (EDTA)",
    parameters: [
      { name: "Hemoglobin (Hb)", value: "14.2", unit: "g/dL", referenceRange: "13.0 - 17.5", isAbnormal: false },
      { name: "Total RBC Count", value: "4.8", unit: "x10^12/L", referenceRange: "4.5 - 5.9", isAbnormal: false },
      { name: "Total WBC Count", value: "6,900", unit: "/cumm", referenceRange: "4,000 - 11,000", isAbnormal: false },
      { name: "Platelet Count", value: "260,000", unit: "/cumm", referenceRange: "150,000 - 450,000", isAbnormal: false },
      { name: "ESR (Westergren)", value: "10", unit: "mm/1st hr", referenceRange: "0 - 15", isAbnormal: false },
    ],
  },
  {
    name: "Lipid Profile (Fasting)",
    category: "BIOCHEMISTRY" as LabTestCategory,
    sampleType: "Blood Serum",
    parameters: [
      { name: "Total Cholesterol", value: "190", unit: "mg/dL", referenceRange: "< 200", isAbnormal: false },
      { name: "HDL Cholesterol", value: "45", unit: "mg/dL", referenceRange: "> 40", isAbnormal: false },
      { name: "LDL Cholesterol", value: "115", unit: "mg/dL", referenceRange: "< 100", isAbnormal: true },
      { name: "Serum Triglycerides", value: "145", unit: "mg/dL", referenceRange: "< 150", isAbnormal: false },
    ],
  },
  {
    name: "Kidney Function Test (KFT)",
    category: "BIOCHEMISTRY" as LabTestCategory,
    sampleType: "Blood Serum",
    parameters: [
      { name: "Serum Creatinine", value: "0.95", unit: "mg/dL", referenceRange: "0.7 - 1.3", isAbnormal: false },
      { name: "Blood Urea", value: "28", unit: "mg/dL", referenceRange: "15 - 45", isAbnormal: false },
      { name: "Serum Uric Acid", value: "5.4", unit: "mg/dL", referenceRange: "3.5 - 7.2", isAbnormal: false },
      { name: "eGFR (Estimated GFR)", value: "98", unit: "mL/min/1.73m²", referenceRange: "> 90", isAbnormal: false },
    ],
  },
  {
    name: "High Sensitivity Cardiac Troponin-I (hs-cTnI)",
    category: "CARDIOLOGY" as LabTestCategory,
    sampleType: "Heparinized Plasma",
    parameters: [
      { name: "hs-cTnI Quantitative", value: "3.8", unit: "pg/mL", referenceRange: "< 19.8", isAbnormal: false },
      { name: "Serum CK-MB", value: "15", unit: "U/L", referenceRange: "< 25", isAbnormal: false },
    ],
  },
];

export function CreateLabReportDialog({
  isOpen,
  onClose,
  onSuccess,
  defaultDoctorName = "Dr. SM Siam",
  defaultPatientPhone = "",
}: CreateLabReportDialogProps) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState(defaultPatientPhone);
  const [patientAge, setPatientAge] = useState("30");
  const [patientGender, setPatientGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [testName, setTestName] = useState("Complete Blood Count (CBC) with ESR");
  const [category, setCategory] = useState<LabTestCategory>("HEMATOLOGY");
  const [sampleType, setSampleType] = useState("Whole Blood (EDTA)");
  const [referredDoctorName, setReferredDoctorName] = useState(defaultDoctorName);
  const [parameters, setParameters] = useState<LabTestParameter[]>(TEST_TEMPLATES[0].parameters);
  const [clinicalImpression, setClinicalImpression] = useState(
    "All tested biomarkers are within physiological reference intervals."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Template change
  const handleTemplateSelect = (selectedName: string) => {
    const tmpl = TEST_TEMPLATES.find((t) => t.name === selectedName);
    if (tmpl) {
      setTestName(tmpl.name);
      setCategory(tmpl.category);
      setSampleType(tmpl.sampleType);
      setParameters([...tmpl.parameters]);
    }
  };

  // Add parameter row
  const addParameter = () => {
    setParameters([
      ...parameters,
      { name: "", value: "", unit: "", referenceRange: "", isAbnormal: false },
    ]);
  };

  // Remove parameter
  const removeParameter = (index: number) => {
    if (parameters.length <= 1) {
      toast.error("At least one parameter is required.");
      return;
    }
    setParameters(parameters.filter((_, i) => i !== index));
  };

  // Update parameter
  const updateParameter = (index: number, field: keyof LabTestParameter, val: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: val };
    setParameters(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error("Please enter patient name.");
      return;
    }

    if (!patientPhone.trim()) {
      toast.error("Please enter patient contact number.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await labReportService.create({
        testName,
        category,
        sampleType,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: Number(patientAge) || 30,
        patientGender,
        referredDoctorName,
        parameters,
        clinicalImpression,
        status: "COMPLETED",
      });

      if (res.success) {
        toast.success(`Lab Report ${res.data.report.reportNumber} generated successfully!`);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || "Failed to create lab report.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create lab report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <FlaskConical className="h-5 w-5 text-teal-600 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              Issue Official Diagnostic Lab Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
          {/* Quick Preset Selector */}
          <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3.5 space-y-1.5 dark:bg-teal-950/40 dark:border-teal-900">
            <Label className="text-xs font-bold text-teal-900 dark:text-teal-200">
              Quick Test Template Preset
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEST_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.name}
                  onClick={() => handleTemplateSelect(tmpl.name)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all cursor-pointer ${
                    testName === tmpl.name
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                  }`}
                >
                  {tmpl.name.split(" ")[0]} ({tmpl.category.slice(0, 5)})
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Patient & Doctor Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="e.g. SM Siam"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientPhone">Contact Phone</Label>
                <Input
                  id="patientPhone"
                  placeholder="01567898506"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="patientAge">Age (Years)</Label>
                <Input
                  id="patientAge"
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="genderSelect">Gender</Label>
                <select
                  id="genderSelect"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full h-10 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sampleType">Specimen / Sample</Label>
                <Input
                  id="sampleType"
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="doctorName">Referring Physician</Label>
                <Input
                  id="doctorName"
                  value={referredDoctorName}
                  onChange={(e) => setReferredDoctorName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Test Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Test Parameters & Reference Ranges
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParameter}
                className="gap-1 text-xs h-8 px-3 rounded-lg cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Row
              </Button>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
              {parameters.map((param, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-1.5 sm:gap-2 items-center bg-white dark:bg-slate-800 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <Input
                      placeholder="Parameter (e.g. Hemoglobin)"
                      value={param.name}
                      onChange={(e) => updateParameter(idx, "name", e.target.value)}
                      className="h-8 text-xs"
                      required
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <Input
                      placeholder="Result"
                      value={param.value}
                      onChange={(e) => updateParameter(idx, "value", e.target.value)}
                      className="h-8 text-xs font-bold"
                      required
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <Input
                      placeholder="Unit (g/dL)"
                      value={param.unit}
                      onChange={(e) => updateParameter(idx, "unit", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-3">
                    <Input
                      placeholder="Ref Range (13.0 - 17.5)"
                      value={param.referenceRange}
                      onChange={(e) => updateParameter(idx, "referenceRange", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeParameter(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Impression */}
          <div className="space-y-1.5">
            <Label htmlFor="impression">Clinical Impression & Pathologist Notes</Label>
            <textarea
              id="impression"
              rows={2}
              value={clinicalImpression}
              onChange={(e) => setClinicalImpression(e.target.value)}
              placeholder="e.g. Test results are within physiological biological limits."
              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-5 rounded-xl font-semibold cursor-pointer w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10.5 px-6 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 cursor-pointer w-full sm:w-auto"
            >
              {isSubmitting ? "Generating..." : "Save & Generate Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
