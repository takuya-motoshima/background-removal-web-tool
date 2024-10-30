import '~/index.css';

/**
  * Check for errors in uploaded files.
  */
const hasErrors = (allFiles, addedFile = undefined) => {
  let uploadErrors = allFiles.filter(file => file.status === Dropzone.ERROR).length;
  if (addedFile) {
    if (addedFile.size > DOCUMENT_MAX_BYTE_SIZE)
      ++uploadErrors;
    // else if (addedFile.name.length > 40)
    //   ++uploadErrors;
    // else if (INVALID_FILE_NAME_PATTERN.test(addedFile.name))
    //   ++uploadErrors;
  }
  return uploadErrors > 0;
}

// Maximum size.
const MAX_BYTE_SIZE = 1 * 1024 * 1024;

// Invalid filename pattern.
const INVALID_FILE_NAME_PATTERN = /[^0-9a-zA-Z\-\._]/;

// HTML Elements.
const dropzoneEl = document.getElementById('dropzone');
const uploadAllButtonEl = document.getElementById('uploadAllButton');
const removeAllButtonEl = document.getElementById('removeAllButton');

// Set the preview element template.
const previewEl = dropzoneEl.querySelector('.dropzone-item');
const previewTemplate = previewEl.parentNode.innerHTML;
previewEl.parentNode.removeChild(previewEl);

// Initialize drop zone.
const dropzone = new Dropzone(dropzoneEl, { // Make the whole body a dropzone
  url: '/background-removal', // Set the url for your upload script location.
  method: 'post',
  paramName: 'files',
  parallelUploads: 10,// How many file uploads to process in parallel.
  previewTemplate,
  maxFilesize: MAX_BYTE_SIZE / 1024 / 1024, // Max filesize in MB.
  maxFiles: 100,
  // autoProcessQueue: false, // Stop auto upload
  autoQueue: false,// Make sure the files aren't queued until manually added.
  previewsContainer: '.dropzone-items',// Define the container to display the previews.
  clickable: '.dropzone-select',// Define the element that should be used as click trigger to select files.
  acceptedFiles: 'image/jpeg,image/png',
  createImageThumbnails: true,
  thumbnailWidth: 100,
  thumbnailMethod: 'contain',
  // dictFileTooBig: 'File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.',
  // dictMaxFilesExceeded: 'Too many files selected. You may upload up to {{maxFiles}} files at a time.',
  // accept: (file, done) => {
  //   if (file.name.length > 40)
  //     done('File names are limited to 40 characters.');
  //   else if (INVALID_FILE_NAME_PATTERN.test(file.name))
  //     done('File names may only contain alphanumeric characters, symbols (-. _) only.');
  //   else
  //     done();
  // },
});

// Add upload file.
dropzone.on('addedfile', file => {
  dropzoneEl.querySelectorAll('.dropzone-item').forEach(dropzoneItem => {
    dropzoneItem.style.display = '';
  });
  uploadAllButtonEl.style.display = hasErrors(dropzone.files, file) ? 'none' : 'inline-block';
  removeAllButtonEl.style.display = 'inline-block';
});

// Update the total progress bar.
dropzone.on('totaluploadprogress', progress => {
  dropzoneEl.querySelectorAll('.progress-bar').forEach(progressBar => {
    progressBar.style.width = progress + '%';
  });
});

// Send uploaded files.
dropzone.on('sending', (file, xhr, formData) => {
  // Show the total progress bar when upload starts.
  dropzoneEl.querySelectorAll('.progress-bar').forEach(progressBar => {
    progressBar.style.opacity = '1';
  });

  // Can send own parameters if needed.
  // formData.append('extra', 'value');
});

// Completion of file-by-file transmission.
dropzone.on('complete', file => {
  // Hide the total progress bar when nothing's uploading anymore.
  setTimeout(() => {
    file.previewElement.querySelector('.progress-bar').style.opacity = '0';
    file.previewElement.querySelector('.progress').style.opacity = '0';
  }, 300);
});

// On all files completed upload.
dropzone.on('queuecomplete', () => {
  // If there is at least one file that has been successfully sent, the upload is considered complete.
  // Note that this event will be called even if all files are in error when selecting files.
  const uploadSuccesses = dropzone.files.filter(file => file.status === Dropzone.SUCCESS).length;
  if (uploadSuccesses > 0) {
    // Disable upload and delete buttons.
    uploadAllButtonEl.style.display = 'none';
    removeAllButtonEl.style.display = 'none';

    // Success message.
    alert(`${uploadSuccesses} files uploaded.`);
  }
});

// On all files removed.
dropzone.on('removedfile', () => {
  uploadAllButtonEl.style.display = dropzone.files.length === 0 || hasErrors(dropzone.files) ? 'none' : 'inline-block';
  if (dropzone.files.length === 0)
    removeAllButtonEl.style.display = 'none';
});

// Once the maximum number of files that can be uploaded is exceeded, the upload button should be disabled.
dropzone.on('maxfilesexceeded', () => {
  uploadAllButtonEl.style.display = 'none';
});

// Setup the buttons for all transfers.
uploadAllButtonEl.addEventListener('click', () => {
  dropzone.enqueueFiles(dropzone.getFilesWithStatus(Dropzone.ADDED));
});

// Setup the button for remove all files.
removeAllButtonEl.addEventListener('click', () => {
  uploadAllButtonEl.style.display = "none";
  removeAllButtonEl.style.display = "none";
  dropzone.removeAllFiles(true);
});