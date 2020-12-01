const express = require('express');
const axios = require('axios');
const router = express.Router();

const regions = ['africa', 'americas', 'asia', 'europe', 'oceania'];

router.get('/', function (req, res, next) {
  // fetch region and breeds
  async function fetchData() {
    const response = {};

    if (req.query.region) {
      await axios(
        `https://restcountries.eu/rest/v2/region/${req.query.region}`
      ).then(({ data }) => {
        response.countries = data;
      });
    }

    await axios('https://api.thecatapi.com/v1/breeds').then(({ data }) => {
      response.breeds = data;
    });

    return response;
  }

  fetchData()
    .then(({ countries, breeds }) => {
      const breedsByRegion = breeds.filter((b) =>
        countries?.some((c) => c.alpha2Code === b.country_code)
      );

      // remove duplication for countries
      const removedCountryDuplication = [
        ...new Set(breedsByRegion.map(({ origin }) => origin))
      ].map((countryName) =>
        breedsByRegion.find(({ origin }) => origin === countryName)
      );

      // fetch a lot of images
      const fetchImages = async () => {
        let ps = await breeds
          .filter((b) => b.country_code === req.query.country_code)
          .map((breed) =>
            axios(
              `https://api.thecatapi.com/v1/images/search?breed_id=${breed.id}`
            )
          );

        return Promise.all(ps);
      };

      fetchImages().then((data) => {
        const images = {};

        // create arr images
        data.map(({ data }) => {
          images[data[0].breeds[0].id] = data[0].url;
        });

        // add props to a breed object
        // sorry for recursive
        Object.keys(images).forEach((image) => {
          breeds.some((b) => {
            if (image === b.id) {
              // add image
              b.image = images[image];

              countries.some((c) => {
                if (c.alpha2Code === b.country_code) {
                  // add flag
                  b.flag = c.flag;
                  return true;
                }
              });

              return true;
            }
          });
        });

        // render
        const breedFilterByCountries = breeds.filter(
          (b) => b.country_code === req.query.country_code
        );
        res.render('index', {
          regions,
          currentRegion: req.query.region,
          countries: removedCountryDuplication,
          currentCountryCode: req.query.country_code,
          breeds: breedFilterByCountries
        });
      });
    })
    .catch((e) => console.log(e));
});

module.exports = router;
