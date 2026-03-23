interface FileDropzoneProps {
  onFileSelected: (file: File) => void
  selectedFileName?: string | null
}

export function FileDropzone({ onFileSelected, selectedFileName = null }: FileDropzoneProps) {
  return (
    <section className="card">
      <h2>Drop Zone</h2>
      <label className={selectedFileName ? 'dropzone hasFile' : 'dropzone'} htmlFor="fileInput">
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
        <strong>{selectedFileName ? 'File loaded successfully' : 'Drop media or choose a file'}</strong>
        <span>{selectedFileName ? selectedFileName : 'Audio/Video, max 250MB. Processed locally.'}</span>
      </label>
    </section>
  )
}
