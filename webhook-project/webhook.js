const axios = require("axios")
const crypto = require("crypto")

const endpointSecret = "128475629183028472837501839281" // Din hemliga nyckel här

// Hämta en slumpmässig hundbild från Dog CEO's API
axios
  .get("https://dog.ceo/api/breeds/image/random")
  .then(response => {
    const apiData = response.data // Vi får data från API:t
    console.log("Data mottagen från API:", apiData)

    // Skapa signatur baserat på payloaden
    const signature = crypto
      .createHmac("sha256", endpointSecret)
      .update(JSON.stringify(apiData)) // Serialisera data korrekt
      .digest("hex")

    // Skicka den mottagna datan till din webhook-server med signatur-headern
    return axios.post("http://localhost:8888/webhook", apiData, {
      headers: {
        "x-signature": signature, // Skicka signaturen här
      },
    })
  })
  .then(response => {
    console.log("Webhook-svar:", response.data) // Logga svaret från servern
  })
  .catch(error => {
    console.error(
      "Fel vid hämtning eller sändning av data:",
      error.response ? error.response.data : error.message
    )
    if (error.response) {
      console.log("Status:", error.response.status) // Logga status om vi får ett svar från servern
      console.log("Headers:", error.response.headers) // Logga headers för mer info
    }
  })
