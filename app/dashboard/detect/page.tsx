"use client"

import * as React from "react"
import { toast } from "sonner"
import { RotateCcwIcon, ScanSearchIcon } from "lucide-react"

import { DetectionReview } from "@/components/detect/detection-review"
import { ProcessingSteps } from "@/components/detect/processing-steps"
import { UploadZone } from "@/components/detect/upload-zone"
import { FormField } from "@/components/shared/form-dialog"
import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import type { Detection } from "@/lib/types"

export default function DetectPage() {
  const [file, setFile] = React.useState<File | null>(null)
  const [location, setLocation] = React.useState("")
  const [processing, setProcessing] = React.useState(false)
  const [detection, setDetection] = React.useState<Detection | null>(null)

  const reset = () => {
    setFile(null)
    setLocation("")
    setDetection(null)
  }

  const analyse = async () => {
    if (!file) return
    const body = new FormData()
    body.append("media", file)
    body.append("location", location)

    setProcessing(true)
    try {
      const result = await api.post<Detection>("/detections/", body)
      setDetection(result)
      if (result.status === "failed") toast.error(result.error || "Detection failed.")
    } catch (err) {
      toast.error(err instanceof ApiError ? (err.fieldErrors.media ?? err.message) : "Upload failed.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Detect & issue challan"
        description="Upload a traffic image or video. The system finds the vehicle and plate, reads it, and flags violations."
        actions={
          detection && (
            <Button variant="outline" onClick={reset}>
              <RotateCcwIcon /> New detection
            </Button>
          )
        }
      />

      {detection ? (
        <Card>
          <CardContent>
            <DetectionReview
              key={`${detection.id}-${detection.plate_number}`}
              detection={detection}
              onChange={setDetection}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Source media</CardTitle>
            <CardDescription>Clear, front or rear shots of the plate give the best OCR accuracy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadZone file={file} onFile={setFile} disabled={processing} />
            <FormField label="Location (optional)" htmlFor="upload-location">
              <Input
                id="upload-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Shahrah-e-Faisal, Karachi"
                disabled={processing}
              />
            </FormField>
            {processing ? (
              <ProcessingSteps />
            ) : (
              <Button size="lg" className="w-full" disabled={!file} onClick={analyse}>
                <ScanSearchIcon /> Analyse
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
