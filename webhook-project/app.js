const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const crypto = require("crypto")

const app = express()
const PORT = process.env.PORT || 8888
const endpointSecret = "128475629183028472837501839281" // Min hemliga nyckel här

// Middleware för att läsa JSON-data
app.use(bodyParser.json())

// Signaturverifiering
const verifySignature = (req, res, next) => {
  const sig = req.headers["x-signature"] // Ta emot signaturen från headern
  const payload = req.body

  // Generera signaturen baserat på den mottagna datan (payload)
  const computedSig = crypto
    .createHmac("sha256", endpointSecret)
    .update(JSON.stringify(payload)) // Serialisera payload exakt samma som i klienten
    .digest("hex")

  console.log("Received signature:", sig)
  console.log("Computed signature:", computedSig)

  if (sig !== computedSig) {
    return res.status(400).send("Signatur matchar inte")
  }
  next()
}

// Nytt endpoint utan signaturverifiering för vidarebefordran
app.post("/forward", async (req, res) => {
  try {
    const incomingData = req.body
    console.log("Vidarebefordrad data:", incomingData)

    // Kontrollera att datan är korrekt
    if (!incomingData || Object.keys(incomingData).length === 0) {
      console.error("Ingen data mottagen eller felaktig data")
      return res.status(400).send("Ingen data mottagen eller felaktig data")
    }

    // Skicka vidare data till webhook-test.com
    const webhookResponse = await axios.post(
      "https://webhook-test.com/ce29422ccfcc9702264fb9cad36b56c7",
      incomingData
    )

    console.log("Data skickad till webhook-test.com:", webhookResponse.data)
    res.status(200).send("Data vidarebefordrad till webhook-test.com")
  } catch (error) {
    console.error("Fel vid vidarebefordran", error)
    res.status(500).send("Något gick fel vid vidarebefordran")
  }
})

// Webhook-endpoint som tar emot data och skickar den vidare
app.post("/webhook", verifySignature, async (req, res) => {
  try {
    const incomingData = req.body
    console.log("Mottagen data:", incomingData)

    // Vidarebefordra datan till /forward
    const response = await axios.post(
      "http://localhost:8888/forward",
      incomingData
    )

    console.log("Data skickad vidare till /forward:", response.data)
    res.status(200).send("Data mottagen och skickad vidare")
  } catch (error) {
    console.error("Fel vid mottagning av data", error)
    res.status(500).send("Något gick fel vid mottagning")
  }
})

// Starta servern
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// ___________________________________________________________________________________________
// ___________________________________________________________________________________________
// Om man vill visa api på HTML sida

// Route för att visa hundbilden på en HTML-sida
app.get("/", async (req, res) => {
  try {
    // Hämta en ny hundbild från API:et
    const response = await axios.get("https://dog.ceo/api/breeds/image/random")
    const imageUrl = response.data.message

    // Skicka hundbildens data vidare till /forward
    const forwardResponse = await axios.post("http://localhost:8888/forward", {
      message: imageUrl,
      status: "success",
    })

    console.log("Data skickad vidare till /forward:", forwardResponse.data)

    // Skicka HTML-sidan med hundbilden
    res.send(`
        <html>
          <head>
            <title>Hundbild</title>
          </head>
          <body>
            <h1>Här är din nya hundbild!</h1>
            <img src="${imageUrl}" alt="Hundbild">
            <br>
            <button onclick="window.location.reload();">Hämta en ny bild</button>
          </body>
        </html>
      `)
  } catch (error) {
    console.error("Fel vid hämtning av bild eller vidarebefordran:", error)
    res
      .status(500)
      .send("Något gick fel vid hämtning av bild eller vidarebefordran")
  }
})
