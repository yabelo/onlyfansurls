// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyARUb4YUoLQp31SdzpTb22NKN9jqDot9Xk",
  authDomain: "onlyfansurls.firebaseapp.com",
  databaseURL: "https://onlyfansurls-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "onlyfansurls",
  storageBucket: "onlyfansurls.appspot.com",
  messagingSenderId: "1037473744824",
  appId: "1:1037473744824:web:880e9acd73bf1b3ca8314d",
  measurementId: "G-67Z1DVVL29"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Reference to the text file
const textFileRef = ref(storage, 'URLs.txt');

const loadingContentText = document.querySelector('h1[id="loadingContentText"]');
const selectName = document.querySelector('select[id="selectName"]');
const linksBox = document.querySelector('textarea[id="linksBox"]');
const numOfCreators = document.querySelector('h2[id="numOfCreators"]');
const numOfLinks = document.querySelector('h2[id="numOfLinks"]');
var namesLinks = new Map();
var names = [];

// Get the download URL
getDownloadURL(textFileRef)
  .then((url) => {
    // Use the URL to fetch the contents of the file
    return fetch(url);
  })
  .then((response) => {
    if (response.ok) {
      // Read the response as text
      return response.text();
    }
    throw new Error('Failed to fetch the file');
  })
  .then((fileContents) => {
    var entries = fileContents.split('\n');
    var currentName = null;

    for (let i = 0; i < entries.length; i++) {
      let str = entries[i].trim();

      if (str.endsWith(":")) {
        currentName = str.substring(0, str.length - 1);
        names.push(currentName);
        namesLinks.set(currentName, []);
      } else if (str !== "") {
        namesLinks.get(currentName).push(str);
      }
    }

    names.forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      selectName.appendChild(option);
    });

    loadingContentText.style.visibility = 'hidden';
    selectName.style.visibility = 'visible';
    numOfCreators.style.visibility = 'visible';
    numOfLinks.style.visibility = 'visible';

    let num = 0;
    names.forEach(element => {
      num += namesLinks.get(element).length;
    });

    numOfCreators.innerHTML = "Number of creators: " + names.length;
    numOfLinks.innerHTML = "Number of links: " + num;
  })
  .catch((error) => {
    console.error('Error:', error);
  });

selectName.addEventListener('change', (event) => {
  const selectedName = event.target.value;
  const selectedLinks = namesLinks.get(selectedName);

  linksBox.value = selectedLinks.join('\n');
  linksBox.style.visibility = 'visible';
});



