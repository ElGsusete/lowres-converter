interface FileDropzoneProps {
  onFileSelected: (file: File) => void
}

export function FileDropzone({ onFileSelected }: FileDropzoneProps) {
  return (
    <section className="card">
      <h2>Drop Zone</h2>
      <label className="dropzone" htmlFor="fileInput">
        <input
          id="fileInput"
          type="file"
          accept="audio/*,video/*"
          onChange={(event) => {
            const selectedFile = event.currentTarget.files?.item(0)
            if (selectedFile) {
              onFileSelected(selectedFile)
            }
          }}
        />
        <strong>Drop media or choose a file</strong>
        <span>Audio/Video, max 250MB. Processed locally.</span>
      </label>
    </section>
  )
}
