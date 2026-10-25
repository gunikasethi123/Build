
import { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Search,
} from 'lucide-react';

import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';

const sizeLabel = (n) => {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;

  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Files({
  files = [],
  projects = [],
  addFile,
  deleteFile,
  search = '',
}) {
  const input = useRef(null);

  const [projectId, setProjectId] = useState('');
  const [query, setQuery] = useState('');

  const onFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    try {
      for (const file of selectedFiles) {
        await addFile(file, projectId);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      e.target.value = '';
    }
  };

  const searchText = (query || search || '').toLowerCase();

  const visible = files.filter((file) =>
    (file.original_name || '')
      .toLowerCase()
      .includes(searchText)
  );

  const download = (file) => {
    if (file.local && file.object_url) {
      const a = document.createElement('a');

      a.href = file.object_url;
      a.download = file.original_name || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (file.download_url) {
      window.open(
        `http://localhost:4000${file.download_url}`,
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      alert(
        'This file cannot be downloaded right now. Please check the backend connection.'
      );
    }
  };

  const handleDelete = (id) => {
    if (confirm('Remove this file?')) {
      deleteFile(id);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="SHARED RESOURCES"
        title="Files & resources"
        description="Keep the important project files easy to find."
      />

      <div className="upload-panel">
        <div className="upload-art">
          <Upload size={26} />
        </div>

        <div className="upload-copy">
          <h2>Drop your work here</h2>

          <p>
            Upload documents, presentations, images and project assets.
            Maximum file size: 15 MB when using the backend.
          </p>

          <div className="upload-controls">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Workspace files (no project)</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              onClick={() => input.current?.click()}
            >
              <Upload size={16} />
              Choose files
            </button>

            <input
              ref={input}
              hidden
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
              onChange={onFiles}
            />
          </div>
        </div>

        <div className="upload-side-note">
          PDF · DOCX · PPTX · PNG · JPG
        </div>
      </div>

      <div className="toolbar">
        <div>
          <h2 className="section-title">
            All files <span>{visible.length}</span>
          </h2>
        </div>

        <label className="search-box">
          <Search size={16} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="panel table-panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>File name</th>
                  <th>Project</th>
                  <th>File size</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <div className="file-name-cell">
                        <div className="file-type-icon">
                          <FileText size={19} />
                        </div>

                        <div>
                          <b>{file.original_name}</b>
                          <small>
                            {file.mime_type || 'File attachment'}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {projects.find(
                        (project) => project.id === file.project_id
                      )?.name || 'Workspace'}
                    </td>

                    <td>{sizeLabel(file.size_bytes)}</td>

                    <td>
                      {file.uploaded_at
                        ? new Date(file.uploaded_at).toLocaleDateString(
                            'en-IN'
                          )
                        : '—'}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button small"
                          title="Download"
                          aria-label={`Download ${file.original_name}`}
                          onClick={() => download(file)}
                        >
                          <Download size={16} />
                        </button>

                        <button
                          className="danger-icon"
                          title="Delete"
                          aria-label={`Delete ${file.original_name}`}
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={query ? 'No matching files found' : 'Your resources live here'}
          description={
            query
              ? 'Try another search term.'
              : 'Upload your first file and attach it to a project.'
          }
        />
      )}
    </>
  );
}