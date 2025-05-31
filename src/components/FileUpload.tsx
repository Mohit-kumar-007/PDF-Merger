import { SignedIn } from '@clerk/clerk-react';
import { FaFileUpload, FaFilePdf, FaTimes, FaGripVertical } from 'react-icons/fa';
import { useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import PDFMerger from 'pdf-merger-js';
import './FileUpload.css';

interface PDFFile extends File {}

export const FileUpload = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === uploadAreaRef.current) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    ) as PDFFile[];
    
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as PDFFile[];
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const reorderedFiles = Array.from(files);
    const [removed] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, removed);
    
    setFiles(reorderedFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    try {
      setIsLoading(true);
      const merger = new PDFMerger();

      // Add all PDF files to merger in the current order
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        await merger.add(arrayBuffer);
      }

      // Generate the merged PDF as a Blob
      const mergedPdfData = await merger.saveAsBuffer();
      const blob = new Blob([mergedPdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
      setFiles([]);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignedIn>
      <section className="file-upload">
        <div className="upload-container">
          <div 
            ref={uploadAreaRef}
            className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <FaFileUpload size={48} color="#1a73e8" />
            </div>
            <h2>Upload PDF Files</h2>
            <p>Drag & drop your PDF files here or click to browse</p>
            <input 
              type="file" 
              accept=".pdf" 
              multiple 
              className="file-input"
              onChange={handleFileSelect}
            />
          </div>

          {files.length > 0 && (
            <>
              <div className="file-list-header">
                <h3>Arrange PDFs in Any Order</h3>
                <p className="reorder-hint">↕ Grab and drag files to rearrange them in your preferred order</p>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="pdf-list">
                  {(provided, snapshot) => (
                    <div 
                      className={`file-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {files.map((file, index) => (
                        <Draggable 
                          key={`${file.name}-${index}`}
                          draggableId={`${file.name}-${index}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`file-item ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div 
                                className="file-item-drag"
                                {...provided.dragHandleProps}
                                title="Drag to reorder"
                              >
                                <FaGripVertical size={20} color="#718096" />
                              </div>
                              <div className="file-item-info">
                                <FaFilePdf size={20} color="#1a73e8" />
                                <span className="file-item-name">
                                  {index + 1}. {file.name}
                                </span>
                              </div>
                              <div className="file-item-actions">
                                <button 
                                  className="file-item-remove"
                                  onClick={() => removeFile(index)}
                                  title="Remove file"
                                >
                                  <FaTimes size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          <button 
            className="merge-button" 
            disabled={files.length < 2 || isLoading}
            onClick={mergePDFs}
          >
            {isLoading ? 'Merging...' : 'Merge PDFs'}
          </button>

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}
        </div>
      </section>
    </SignedIn>
  );
};
