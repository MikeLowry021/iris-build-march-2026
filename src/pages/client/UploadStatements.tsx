import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/StatusBadge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockClientDocuments, mockClientInfo, availableMonths } from '@/lib/client-mock-data';
import { 
  Upload, 
  FileText, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  File,
  FileSpreadsheet,
  Receipt,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  type: 'bank-statement' | 'invoice' | 'receipt' | 'other';
  period: string;
}

const fileTypeOptions = [
  { value: 'bank-statement', label: 'Bank Statement', icon: FileSpreadsheet },
  { value: 'invoice', label: 'Invoice', icon: FileText },
  { value: 'receipt', label: 'Receipt', icon: Receipt },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

export default function UploadStatements() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('bank-statement');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(availableMonths[0]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [selectedType, selectedPeriod]);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      type: selectedType as UploadedFile['type'],
      period: selectedPeriod,
    }));

    setFiles(prev => [...prev, ...newFiles]);

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

  const getFileTypeIcon = (type: string) => {
    const option = fileTypeOptions.find(o => o.value === type);
    return option?.icon || File;
  };

  const getFileTypeLabel = (type: string) => {
    const option = fileTypeOptions.find(o => o.value === type);
    return option?.label || type;
  };

  const recentUploads = mockClientDocuments.slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="page-title">Upload Documents</h1>
          <p className="mt-1 text-muted-foreground">
            Upload your bank statements, invoices, and receipts for processing
          </p>
        </div>

        {/* Upload Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label className="text-sm text-muted-foreground">Client</Label>
                <p className="mt-1 font-medium">{mockClientInfo.company}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-type">Document Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="file-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period (Month/Year)</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map(month => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {files.map(file => {
                  const FileIcon = getFileTypeIcon(file.type);
                  return (
                    <div key={file.id} className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {getFileTypeLabel(file.type)} • {file.period}
                            </p>
                          </div>
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
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Uploads List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Uploads (Last 10)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentUploads.map(doc => {
                const FileIcon = getFileTypeIcon(doc.type);
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getFileTypeLabel(doc.type)} • {doc.period} • {formatFileSize(doc.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-ZA', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge 
                      status={doc.status === 'processed' ? 'complete' : 
                              doc.status === 'error' ? 'error' : 'pending'} 
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
