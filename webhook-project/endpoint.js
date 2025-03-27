// Nytt endpoint utan signaturverifiering för vidarebefordran
// app.post("/forward", async (req, res) => {
//   try {
//     const incomingData = req.body
//     console.log("Vidarebefordrad data:", incomingData)
//     res.status(200).send("Data vidarebefordrad")
//   } catch (error) {
//     console.error("Fel vid vidarebefordran", error)
//     res.status(500).send("Något gick fel")
//   }
// })

// // Ändra webhook-endpointet att vidarebefordra till /forward istället
// app.post("/webhook", verifySignature, async (req, res) => {
//   try {
//     const incomingData = req.body
//     console.log("Mottagen data:", incomingData)

//     // Vidarebefordra datan till /forward
//     const response = await axios.post(
//       "http://localhost:3000/forward",
//       incomingData
//     )

//     res.status(200).send("Data mottagen och skickad vidare")
//   } catch (error) {
//     console.error("Fel vid mottagning av data", error)
//     res.status(500).send("Något gick fel")
//   }
// })
