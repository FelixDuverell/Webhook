// const express = require("express")
// const bodyParser = require("body-parser")
// const axios = require("axios")
// const crypto = require("crypto")

// const app = express()
// const PORT = process.env.PORT || 8888
// const endpointSecret = "128475629183028472837501839281"

// app.use(bodyParser.json())

// const verifySignature = (req, res, next) => {
//   const sig = req.headers["x-signature"]

//   const payload = req.body

//   const computedSig = crypto
//     .createHmac("sha256", endpointSecret)
//     .update(JSON.stringify(payload))
//     .digest("hex")

//   console.log("Received signature:", sig)
//   console.log("Computed signature:", computedSig)

//   if (sig !== computedSig) {
//     return res.status(400).send("Signatur matchar inte")
//   }
//   next()
// }

// app.post("/forward", async (req, res) => {
//   try {
//     const incomingData = req.body
//     console.log("Vidarebefordrad data:", incomingData)

//     if (!incomingData || Object.keys(incomingData).length === 0) {
//       console.error("Ingen data mottagen eller felaktig data")
//     }

//     const webhookResponse = await axios.post(
//       "https://webhook-test.com/bf93019fae35a1f4e4f3e38f18627eb0",
//       incomingData
//     )

//     console.log("Data skickad till webhook-test.com:", webhookResponse.data)
//     res.status(200).send("Data vidarebefordrad till webhook-test.com")
//   } catch (error) {
//     console.error("Fel vid vidarebefordran", error)
//     res.status(500).send("Något gick fel vid vidarebefordran")
//   }
// })

// app.post("/webhook", verifySignature, async (req, res) => {
//   try {
//     const incomingData = req.body
//     console.log("Mottagen data:", incomingData)

//     const response = await axios.post(
//       "http://localhost:8888/forward",
//       incomingData
//     )

//     console.log("Data skickad vidare till /forward:", response.data)
//     res.status(200).send("Data mottagen och skickad vidare")
//   } catch (error) {
//     console.error("Fel vid mottagning av data", error)
//     res.status(500).send("Något gick fel vid mottagning")
//   }
// })

// app.get("/", async (req, res) => {
//   try {
//     const respons = await axios.get("https://dog.ceo/api/breeds/image/random")
//     const imageUrl = response.data.message

//     const forwardResponse = await axios.post("http://localhost:8888/forward", {
//       message: imageUrl,
//       status: "success",
//     })

//     console.log("Data skickad vidare till /forward:", forwardResponse.data)

//     res.send(`
//             <html>
//                 <head>
//                     <title>Hundbild</title>
//                 </head>
//                 <body>
//                     <h1>Här är din nya hundbild</h1>
//                     <img src="${imageUrl}" alt="Hundbild">
//                     <br>
//                     <button onclick="window.location.reload()">Hämta en ny bild</button>
//                 </body>
//             </html>

//                 `)
//   } catch (error) {
//     console.error("Fel vid hämtning av data", error)
//     res.status(500).send("Något gick fel vid hämtning av data")
//   }
// })

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })
