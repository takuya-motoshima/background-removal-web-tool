import '~/index.css';

// Set the dropzone container id.
const dropzoneEl = document.getElementById('dropzone');
const uploadButtonEl = document.getElementById('uploadButton');
const removeAllButtonEl = document.getElementById('removeAllButton');

// Set the preview element template.
const previewEl = dropzoneEl.querySelector('.dropzone-item');
previewEl.id = '';
const previewTemplate = previewEl.parentNode.innerHTML;
previewEl.parentNode.removeChild(previewEl);

const dropzone = new Dropzone(dropzoneEl, { // Make the whole body a dropzone
  url: '/background-removal', // Set the url for your upload script location.
  method: 'post',
  paramName: 'files',
  parallelUploads: 20,// How many file uploads to process in parallel.
  previewTemplate: previewTemplate,
  maxFilesize: 1,// Max filesize in MB.
  autoQueue: false,// Make sure the files aren't queued until manually added.
  previewsContainer: '.dropzone-items',// Define the container to display the previews.
  clickable: '.dropzone-select',// Define the element that should be used as click trigger to select files.
  acceptedFiles: 'image/*',
  createImageThumbnails: true,
  thumbnailWidth: null,
  thumbnailHeight: null,
});

dropzone.on('addedfile', file => {
  // Hookup the start button.
  file.previewElement.querySelector('.dropzone-start').onclick = () => {
    dropzone.enqueueFile(file);
  };
  const dropzoneItems = dropzoneEl.querySelectorAll('.dropzone-item');
  dropzoneItems.forEach(dropzoneItem => {
    dropzoneItem.style.display = '';
  });
  uploadButtonEl.disabled = false;
  removeAllButtonEl.disabled = false;
});

// Update the total progress bar.
dropzone.on('totaluploadprogress', progress => {
  console.log('totaluploadprogress progress=', progress);
  const progressBars = dropzoneEl.querySelectorAll('.progress-bar');
  progressBars.forEach(progressBar => {
    progressBar.style.width = progress + '%';
  });
});

dropzone.on('sending', file => {
  // Show the total progress bar when upload starts
  const progressBars = dropzoneEl.querySelectorAll('.progress-bar');
  progressBars.forEach(progressBar => {
    progressBar.style.opacity = '1';
  });
  // And disable the start button
  file.previewElement.querySelector('.dropzone-start').setAttribute('disabled', 'disabled');
});

// Hide the total progress bar when nothing's uploading anymore
dropzone.on('complete', progress => {
  const progressBars = dropzoneEl.querySelectorAll('.dz-complete');
  setTimeout(() => {
    progressBars.forEach(progressBar => {
      progressBar.querySelector('.progress-bar').style.opacity = '0';
      progressBar.querySelector('.progress').style.opacity = '0';
      progressBar.querySelector('.dropzone-start').style.opacity = '0';
    });
  }, 300);
});

// Setup the buttons for all transfers
uploadButtonEl.addEventListener('click', () => {
  dropzone.enqueueFiles(dropzone.getFilesWithStatus(Dropzone.ADDED));
});

// Setup the button for remove all files
removeAllButtonEl.addEventListener('click', () => {
  uploadButtonEl.disabled = true;
  removeAllButtonEl.disabled = true;
  dropzone.removeAllFiles(true);
});

// On all files completed upload
dropzone.on('queuecomplete', progress => {
  uploadButtonEl.disabled = true;
});

// On all files removed
dropzone.on('removedfile', file => {
  if (dropzone.files.length < 1) {
    uploadButtonEl.disabled = true;
    removeAllButtonEl.disabled = true;
  }
});

dropzone.on('sending', (file, xhr, formData) => {
  console.log('file=', file);
  console.log('xhr=', xhr);
  console.log('formD ata=', formData);
  formData.append('foo', 1);
});