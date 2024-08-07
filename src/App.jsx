import { useState } from "react";
import { Toaster, toast } from "sonner";
import { PDFDocument } from "pdf-lib";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg") {
      toast.error("Please select a jpg/jpeg or png file.");
      return;
    }

    try {
      setLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc.embedPng(arrayBuffer);
      const { width, height } = image;

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      setDownloadUrl(pdfUrl);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while converting the image to PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="App flex flex-col">
      <h1 className="font-bold text-6xl mb-3 bg-gradient-to-r bg-opacity-5 from-[#bbeeff] to-[#77aaff] text-transparent bg-clip-text">IMG to PDF</h1>
      <p className="mb-10 font-medium">Convert your images to PDF files with ease.</p>

      <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} className="p-10 border border-dashed rounded-xl mb-5" />
      <button onClick={handleConvert} disabled={loading} className="border-none bg-gradient-to-r bg-opacity-5 from-[#bbeeff] to-[#77aaff]">
        {loading ? "Loading.." : "Convert to PDF"}
      </button>

      {loading && <div className="mt-4">Converting image to PDF...</div>}
      {downloadUrl && (
        <div className="mt-4">
          <a href={downloadUrl} download={`${file.name}.pdf`} onClick={handleDownload}>
            <button type="button" className="bg-[#bbeeff] text-[#000d6f] border-none hover:bg-[#bbeeff]/80" disabled={downloading}>
              {downloading ? "Downloading.." : "Download PDF"}
            </button>
          </a>
        </div>
      )}
      <Toaster richColors />
    </div>
  );
}

export default App;
