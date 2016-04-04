import ipc from 'ipc';

function addUpdateListener(elementId, isUpdatePermitted) {
  document.getElementById(elementId).addEventListener('click', () => {
    document.getElementById('update').className = 'loading';
    ipc.send('update-permitted', isUpdatePermitted);
  });
}

const options = {
  'update-yes': true,
  'update-no': false
};

for (const option in options) {
  if (options.hasOwnProperty(option)) {
    addUpdateListener(option, options[option]);
  }
}
