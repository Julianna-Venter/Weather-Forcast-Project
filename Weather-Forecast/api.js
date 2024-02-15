export function populateData(lat, lon) {
  console.log("here they are: " + lat + " " + lon);
  fetch(
    "http://www.7timer.info/bin/api.pl?lon='${lat}'&lat='${lon}'&product=astro&output=json"
  )
    .then((response) => response.json()) //pass as json
    .then((jsonresponse) => {
      // if (jsonresponse?.dataseries) { //jsonresponse?.MRData?.Racetable?.Races?.[0]?.Results

      //     console.log(jsonresponse.dataseries);
      // }

      //guard clause, after this you can just assume it works
      if (!jsonresponse?.dataseries) {
        throw new Error("Test catch?"); //catch it before ever reaching the actual display code
      }
      // console.log(jsonresponse.dataseries);

      const results = jsonresponse.dataseries;

      console.log(results);

      /*
                  **Example of how you will wrie this in the html based on the F1 example
  
                      // 1. max verstappen - Red Bull (1:20:32.604) - Fastest Lap: 01:20.123 (avg 204kph) 
                      //This s the useful information you want to be able to bring to your html
  
                      //Don't use var, use let or const on principle
  
                      for (let result of results) {
                          let listItemContent = '';
                          if (result?.Driver?.familyName && result?.Driver?.givenName) {
                              listItemContent += '${result.Driver.givenName} ${result.Diver.familyName} - ';
                          }
                          if (result?.Constructor?.name) {
                              listItemContent += result.Constructor.name + '';
                          }
                          if (result?.Time?.time) {
                              listItemContent += '(${result.Time.time}) -';
                          } else if (result?.status) {
                              listItemContent += '(${result.status}) -';
                          }
                          //do the same for fastest lap time and speed and units
  
                          console.log(listItemContent);
                          const resulyListItem = document.createElement('li');
                          resultListItem.innerText = listItemContent;
                          listOfResults.appendChild(resultListItem);
                      }
  
                      //there was more here that I missed
  
                  */
    }) //console log the response, this is what is displayed in the console and can be manipulated into DOM elelemnts
    .catch((error) => console.error(error)) //handle errors if so happens
    .finally(() => console.log("The network call has been finalised"));
}
