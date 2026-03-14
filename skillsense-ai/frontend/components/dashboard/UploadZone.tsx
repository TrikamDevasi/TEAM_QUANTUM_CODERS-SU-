'use client';

import React, { useCallback, useState } from 'react';
import type { UploadJob } from '../../types/charts';
import { useDashboardStore } from '../../store/dashboardStore';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const ACCEPTED_TYPES = ['.csv', '.xlsx', '.json'];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone() {
    const { uploadJobs, addUploadJob, updateUploadJob } = useDashboardStore();
    const [dragging, setDragging] = useState(false);

    const processFile = useCallback(
        (file: File) => {
            const job: UploadJob = {
                id: `UPL-${Date.now()}`,
                fileName: file.name,
                fileSize: file.size,
                status: 'processing',
                progress: 0,
                uploadedAt: new Date().toISOString(),
            };
            addUploadJob(job);

            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 18 + 8;
                if (progress >= 100) {
                    clearInterval(interval);
                    updateUploadJob(job.id, {
                        status: 'complete',
                        progress: 100,
                        recordsProcessed: Math.floor(Math.random() * 200) + 50,
                        errorsFound: Math.floor(Math.random() * 4),
                    });
                } else {
                    updateUploadJob(job.id, { progress: Math.min(Math.round(progress), 99) });
                }
            }, 250);
        },
        [addUploadJob, updateUploadJob]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            Array.from(e.dataTransfer.files).forEach(processFile);
        },
        [processFile]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            Array.from(e.target.files ?? []).forEach(processFile);
            e.target.value = '';
        },
        [processFile]
    );

    return (
        <div>
            {/* Drop zone */}
            <label
                htmlFor="upload-input"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '36px 24px',
                    borderRadius: 14,
                    border: `2px dashed ${dragging ? GOLD : 'rgba(212,168,67,0.3)'}`,
                    background: dragging ? 'rgba(212,168,67,0.06)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                }}
            >
                <span style={{ fontSize: 36 }}>📂</span>
                <div>
                    <p style={{ margin: 0, color: WHITE, fontSize: 14, fontWeight: 600 }}>
                        {dragging ? 'Drop files here' : 'Drag & drop files'}
                    </p>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 12 }}>
                        or click to browse • {ACCEPTED_TYPES.join(', ')}
                    </p>
                </div>
                <input
                    id="upload-input"
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </label>

            {/* Job list */}
            {uploadJobs.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
                        Upload Queue
                    </p>
                    {uploadJobs.map((job) => (
                        <div
                            key={job.id}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${job.status === 'complete'
                                    ? 'rgba(34,197,94,0.3)'
                                    : job.status === 'error'
                                        ? 'rgba(239,68,68,0.3)'
                                        : 'rgba(255,255,255,0.1)'
                                    }`,
                                borderRadius: 10,
                                padding: '12px 14px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 13, color: WHITE, fontWeight: 500 }}>
                                        {job.fileName}
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>
                                        {formatSize(job.fileSize)}
                                        {job.status === 'complete' && (
                                            <>
                                                {' '}• {job.recordsProcessed} records
                                                {job.errorsFound ? ` • ${job.errorsFound} errors` : ' • clean'}
                                            </>
                                        )}
                                    </p>
                                </div>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: 20,
                                        textTransform: 'uppercase',
                                        color:
                                            job.status === 'complete'
                                                ? '#22c55e'
                                                : job.status === 'error'
                                                    ? '#ef4444'
                                                    : GOLD,
                                        background:
                                            job.status === 'complete'
                                                ? 'rgba(34,197,94,0.12)'
                                                : job.status === 'error'
                                                    ? 'rgba(239,68,68,0.12)'
                                                    : 'rgba(212,168,67,0.12)',
                                        border: `1px solid ${job.status === 'complete'
                                            ? 'rgba(34,197,94,0.3)'
                                            : job.status === 'error'
                                                ? 'rgba(239,68,68,0.3)'
                                                : 'rgba(212,168,67,0.3)'
                                            }`,
                                    }}
                                >
                                    {job.status}
                                </span>
                            </div>

                            {/* Progress bar */}
                            {job.status === 'processing' && (
                                <div
                                    style={{
                                        height: 3,
                                        background: 'rgba(255,255,255,0.08)',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${job.progress}%`,
                                            background: `linear-gradient(90deg, ${GOLD}, rgba(212,168,67,0.5))`,
                                            transition: 'width 0.2s',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
