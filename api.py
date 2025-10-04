import os
import tempfile
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from werkzeug.utils import secure_filename
from watermark_detector import WatermarkDetector
from watermark_remover import WatermarkRemover

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'pdf'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = FastAPI(title="Gamma AI Watermark Remover API", version="2.0.0")

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = WatermarkDetector()
remover = WatermarkRemover()

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Gamma AI Watermark Remover API is running"}

@app.post("/api/remove-watermark")
async def remove_watermark(pdf_file: UploadFile = File(...)):
    
    if not pdf_file.filename:
        raise HTTPException(status_code=400, detail="No file selected. Please choose a PDF file.")

    if not allowed_file(pdf_file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    filename = secure_filename(pdf_file.filename)

    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
        upload_path = temp_input.name

        try:
            content = await pdf_file.read()
            temp_input.write(content)
            temp_input.flush()

            print(f"Analyzing file: {filename}")
            elements_to_remove, error = detector.identify_watermarks(upload_path)

            if error:
                raise HTTPException(status_code=500, detail=error)

            if elements_to_remove:
                output_filename = f'processed_{filename}'
                output_path = os.path.join(OUTPUT_FOLDER, output_filename)

                print(f"Removing watermarks...")
                images_removed, links_removed = remover.clean_pdf_from_target_domain(upload_path, output_path)

                total_removed = images_removed + links_removed
                
                return {
                    "success": True,
                    "message": f"Watermarks successfully removed!",
                    "details": {
                        "total_removed": total_removed,
                        "images_removed": images_removed,
                        "links_removed": links_removed,
                        "output_filename": output_filename
                    },
                    "download_url": f"/api/download/{output_filename}"
                }
            else:
                return {
                    "success": True,
                    "message": "Gamma.app watermarks not found in PDF.",
                    "details": {
                        "total_removed": 0,
                        "images_removed": 0,
                        "links_removed": 0
                    }
                }

        except Exception as e:
            error_message = f'Error processing file: {str(e)}'
            print(f"Error: {error_message}")
            raise HTTPException(status_code=500, detail=error_message)
        finally:
            try:
                os.unlink(upload_path)
            except:
                pass

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        media_type='application/pdf',
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

if __name__ == '__main__':
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)