import { PageContainer, PageHeader } from "@/components/shared/page-header"
import { VideoUploadForm } from "@/components/video/video-upload-form"

export default function NewVideoAnalysisPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Analyse a video"
        description="Track every vehicle, read its plate and flag violations. You review each finding before any challan is issued."
      />
      <VideoUploadForm />
    </PageContainer>
  )
}
