require('dotenv').config()
const express = require('express');
const path = require("path")


const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());

const configuration = new Configuration({
     apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const productInformation = `
Ardex A 38
Ardex B 16
Ardex B 12
Ardex AM 100
Ardex A 828
Ardex K 75 NEW
Ardex X 77
Ardex X 78
ardex A 46
Ardex A 45
Ardex A 950
Ardex A 31
Weber 3100
Weber 3300
Weber 4100
Weber 4400
Weber 5000
Weber 5400
Weber 6000
Weber LR+
Weber V+
Weber LR
Weber L
Weber TT+
Weber TT
Weber MT
Weber PTM
Weber MTL
Weber Rep 45
Weber Rep 25
Weber KK
Weber KL
Fescon LT 4000
Fescon Rappauuslaasti
Fescon S30
Fescon S100
Fescon K45 
Fescon Juotosbetoni 600/3
Fescon Juotosbetoni 1000/3
Fescon Talvijuotosbetoni
Fescon Muurauslaasti 100/600
Fescon Rappauslaasti KS 35/65
Fescon Rappauslaasti KS 50/50
Fescon Rappauslaasti KS 65/35
Fescon Tiilitasoite
Fescon LM 6000
Fescon Sokkeli ja oikaisulaasti SOL
Fescon Pikabetoni
Fescon S06
Fescon Antiikkilaasti
Kiilto TopPlan DF
Kiilto TasoFlex
Kiilto TM DF
Kiilto Floorheat
Kiilto Hardplan
Kiilto Flexfix
Kiilto Rex Fix
Kiilto Superfix
Kiilto Maxirapid
Kiilto Kerapid
Kiilto 60
Kiilto 70
Kiilto 80
Mapei PLAN R35 PLUS
Mapei Conplan Eco F
Mapei Ultralite S2 Quick
Mapei Topcem Pronto
Mapei Uniplan eco
Mapei Maxi S1
kipsilaasti
Knauf Käsikipsilaasti Goldband
Jos sinulta kysytään outo kysymys mikä ei liity ollenkaan laasteihin, sano että tuotteet eivät ole tehty siihen käyttötarkoitukseen, tai muuten ystävällisesti pyydä kysymään uusi kysymys joka liittyy laasteihin. Jos kysymys liittyy laastien käyttöön, vastaa kysymykseen yksi tai useampi näistä tuotteista, ja kerro miksi se olisi hyvä valinta, ja vähän lisätietoa laastista.
`

app.post("/api", async (req, res) => {
     const question = req.body.content;
     try {
          const response = await openai.createChatCompletion({
               model: "gpt-4",
               messages: [
                    {role: "system", content: `You are ChatGPT, a helpful assistant that knows about the following products: ${productInformation}`},
                    {role: "user", content: question },
               ],
               max_tokens: 200,
               temperature: 0,
               top_p: 1.0,
               frequency_penalty: 0.0,
               presence_penalty: 0.0,
               stop: ["\n"],
          })

          return res.status(200).json({
               success: true,
               data: response.data.choices[0].message.content
          });
     } catch (error) {
          return res.status(400).json({
               success: false,
               error: error.response 
                    ? error.response.data
                    : "There was an issue on the server",
          })
     }
});

if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/dist')))

     app.get('*', function(req, res) {
          res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
     })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));

