import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schema
const cvUploadSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s()-]+$/, "Please enter a valid phone number"),
  consentGiven: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy to continue",
    }),
});

type CVUploadFormData = z.infer<typeof cvUploadSchema>;

interface CVUploadFormProps {
  onSuccess?: (submissionId: string) => void;
  onError?: (error: Error) => void;
  variant?: "hero" | "inline" | "modal";
  showBenefits?: boolean;
}

export default function CVUploadForm({
  onSuccess,
  onError,
  variant = "hero",
  showBenefits = true,
}: CVUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<CVUploadFormData>({
    resolver: zodResolver(cvUploadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      consentGiven: false,
    },
  });

  // File upload configuration
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setFileError("File size exceeds 10MB limit");
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setFileError("Only PDF, DOC, and DOCX files are accepted");
      } else {
        setFileError("Invalid file. Please try again.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Additional client-side validation
      if (selectedFile.size > maxFileSize) {
        setFileError("File size exceeds 10MB limit");
        return;
      }

      setFile(selectedFile);
      setFileError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setFileError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const onSubmit = async (data: CVUploadFormData) => {
    if (!file) {
      setFileError("Please select a CV file to upload");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("consentGiven", String(data.consentGiven));

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed. Please try again.");
      }

      setSubmitSuccess(true);
      
      if (onSuccess && result.submissionId) {
        onSuccess(result.submissionId);
      }

      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        setFile(null);
        setUploadProgress(0);
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      setUploadProgress(0);
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="font-semibold mb-2">Success! Your CV has been submitted.</div>
          <p className="text-sm">
            Thank you for submitting your CV. We'll analyze it and send you detailed feedback
            via email within 24-48 hours. Check your inbox for our comprehensive analysis
            with personalized improvement suggestions.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full ${variant === "inline" ? "max-w-2xl" : "max-w-3xl"} mx-auto`}>
      {showBenefits && variant === "hero" && (
        <div className="mb-6 md:mb-8 text-center px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Get Your Free CV Analysis</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6">
            Upload your CV and receive professional feedback on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="p-4 md:p-4 bg-primary/5 rounded-lg text-left">
              <div className="font-semibold mb-2 text-base">ATS Optimization</div>
              <p className="text-sm text-muted-foreground">
                Ensure your CV passes automated screening systems
              </p>
            </div>
            <div className="p-4 md:p-4 bg-primary/5 rounded-lg text-left">
              <div className="font-semibold mb-2 text-base">Professional Feedback</div>
              <p className="text-sm text-muted-foreground">
                Get expert insights on content and structure
              </p>
            </div>
            <div className="p-4 md:p-4 bg-primary/5 rounded-lg text-left sm:col-span-2 md:col-span-1">
              <div className="font-semibold mb-2 text-base">Actionable Tips</div>
              <p className="text-sm text-muted-foreground">
                Receive specific suggestions to improve your CV
              </p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <FormLabel className="text-base">Upload Your CV *</FormLabel>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer
                transition-colors duration-200 min-h-[160px] flex flex-col items-center justify-center
                ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}
                ${fileError ? "border-red-500" : ""}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              {isDragActive ? (
                <p className="text-base sm:text-lg font-medium">Drop your CV here...</p>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-medium mb-2 px-4">
                    Drag & drop your CV here, or click to browse
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground px-4">
                    Accepted formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </>
              )}
            </div>
            {fileError && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {fileError}
              </p>
            )}
          </div>

          {/* Selected File Display */}
          {file && (
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">{file.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={isSubmitting}
                className="flex-shrink-0 h-9 w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">First Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John" 
                      {...field} 
                      disabled={isSubmitting}
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Last Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Doe" 
                      {...field} 
                      disabled={isSubmitting}
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={isSubmitting}
                    className="h-11 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Phone Number *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    disabled={isSubmitting}
                    className="h-11 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Privacy Consent */}
          <FormField
            control={form.control}
            name="consentGiven"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 sm:p-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="mt-1 h-5 w-5"
                  />
                </FormControl>
                <div className="space-y-1 leading-none flex-1">
                  <FormLabel className="text-sm sm:text-base font-normal leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>{" "}
                    and consent to the processing of my personal data for CV analysis purposes. *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
            size="lg"
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Submit CV for Free Analysis"
            )}
          </Button>

          <p className="text-xs sm:text-sm text-center text-muted-foreground px-4">
            * Required fields. Your information will be kept confidential and used only for CV analysis purposes.
          </p>
        </form>
      </Form>
    </div>
  );
}
