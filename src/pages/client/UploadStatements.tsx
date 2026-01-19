import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/StatusBadge';
import { mockBankStatements } from '@/lib/mock-data';
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

export default function UploadStatements() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress: 100, status: 'processing' } : f
          )
        );
        // Simulate processing
        setTimeout(() => {
          setFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, status: 'complete' } : f
            )
          );
        }, 2000);
      } else {
        setFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Upload Bank Statements</h1>
          <p className="mt-1 text-muted-foreground">
            Upload your bank statements for processing and bookkeeping
          </p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <input
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            multiple
            onChange={e => {
              if (e.target.files) {
                handleFiles(Array.from(e.target.files));
              }
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Drop your files here
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Supports PDF, CSV, Excel (.xlsx, .xls) • Max 25MB per file
            </p>
          </div>
        </div>

        {/* Upload queue */}
        {files.length > 0 && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="section-title">Upload Queue</h2>
            </div>
            <div className="divide-y divide-border">
              {files.map(file => (
                <div key={file.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <div className="flex items-center gap-2">
                        {file.status === 'uploading' && (
                          <span className="text-xs text-muted-foreground">
                            {Math.round(file.progress)}%
                          </span>
                        )}
                        {file.status === 'processing' && (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Processing
                          </span>
                        )}
                        {file.status === 'complete' && (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <Check className="h-3 w-3" />
                            Complete
                          </span>
                        )}
                        {file.status === 'error' && (
                          <span className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            Error
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previously uploaded */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="section-title">Previously Uploaded</h2>
          </div>
          <div className="divide-y divide-border">
            {mockBankStatements.map(statement => (
              <div key={statement.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {statement.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {statement.bank} • {statement.period} • {statement.transactionCount} transactions
                    </p>
                  </div>
                </div>
                <StatusBadge status={statement.status === 'processed' ? 'complete' : statement.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
