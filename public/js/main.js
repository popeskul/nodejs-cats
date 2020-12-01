// REGION
const handleRegion = document.querySelector('#handle-region');
handleRegion.addEventListener('change', (event) => {
  document.location.replace(`/?region=${event.target.value}`);
});

// COUNTRY
const handleCountry = document.querySelector('#handle-country');
handleCountry.addEventListener('change', (event) => {
  const correctQuery = document.location.search.split('&country_code=')[0];

  document.location.replace(
    `${correctQuery}&country_code=${event.target.value}`
  );
});

// // BREED
// const handleBreed = document.querySelector('#handle-breed');
// handleBreed.addEventListener('change', (event) => {
//   const correctQuery = document.location.search.split('&breed=')[0];
//   document.location.replace(`/${correctQuery}&breed=${event.target.value}`);
// });
