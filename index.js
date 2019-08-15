/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const Inicio = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'inicio');
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (accessToken == undefined){
      return handlerInput.responseBuilder
      .speak(REGISTRO)
      .withSimpleCard(REGISTRO)
      .withShouldEndSession(false)
      .getResponse();
    } else {
      let options = {
        "method": "GET",
        "hostname": "213.27.216.171",
        "port": "8081",
        "path": "/getUserName",
        "headers": {
          "Authorization": accessToken,
          "Authorization-Type": "jwt"
        }
      };
      const response = await httpGet(options);
      console.log(accessToken);
      console.log(response);
      return handlerInput.responseBuilder
      .speak("Hola, " + response.fullName)
      .withSimpleCard("Hola, " + response.fullName)
      .withShouldEndSession(false)
      .getResponse();
    }
    
  },
};

const Balance = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'balance';
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
    const cuenta = handlerInput.requestEnvelope.request.intent.slots.cuenta.value;
    
    if (accessToken == undefined){
      return handlerInput.responseBuilder
      .speak(REGISTRO)
      .withSimpleCard(REGISTRO)
      .withShouldEndSession(false)
      .getResponse();
    } else {
      if (cuenta == undefined) {
        let options = {
          "method": "GET",
          "hostname": "213.27.216.171",
          "port": "8081",
          "path": "/balance/",
          "headers": {
            "Authorization": accessToken,
            "Authorization-Type": "jwt"
          }
        };
        const response = await httpGet(options);
        texto = "";
        for(let cuenta of response.data.accounts) {
          patron = /x/gi;
          let alias = cuenta.id.replace(patron, "");
          texto += "la cuenta " + alias.substr(-4) + " tiene " + cuenta.balance + " " + cuenta.currency + ". ";
        }

        return handlerInput.responseBuilder
        .speak(texto)
        .withSimpleCard(texto)
        .withShouldEndSession(false)
        .getResponse();
      }
      else {
        let options = {
          "method": "GET",
          "hostname": "213.27.216.171",
          "port": "8081",
          "path": "/balance/" + cuenta,
          "headers": {
            "Authorization": accessToken,
            "Authorization-Type": "jwt"
          }
        };
        const response = await httpGet(options);
        texto = "la cuenta " + cuenta + " tiene " + response.balance + " " + response.currency + ". ";
        return handlerInput.responseBuilder
        .speak(texto)
        .withSimpleCard(texto)
        .withShouldEndSession(false)
        .getResponse();
      }
      
    }
  },
 };

 const Prestamos = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'prestamos';
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
    
    if (accessToken == undefined){
      return handlerInput.responseBuilder
      .speak(REGISTRO)
      .withSimpleCard(REGISTRO)
      .withShouldEndSession(false)
      .getResponse();
    } else {
      
      var options = {
        "method": "GET",
        "hostname": "213.27.216.171",
        "port": "8081",
        "path": "/getPreLoans",
        "headers": {
          "Authorization": accessToken,
          "Authorization-Type": "jwt"
        }
      };
      const response = await httpGet(options);
      texto = "tienes un préstamo de ";
      for(let prestamo in response) {
        texto += "" + response[prestamo].maxAmount + " a pagar hasta en " + response[prestamo].maxPeriod + " meses. ";
      }
      return handlerInput.responseBuilder
        .speak(texto)
        .withSimpleCard(texto)
        .withShouldEndSession(false)
        .getResponse();
    }
  },
 };
 const Gastos = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'gastos';
  },
  async handle(handlerInput) {
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;
    const categoria = handlerInput.requestEnvelope.request.intent.slots.categoria.value;
    if (accessToken == undefined){
      return handlerInput.responseBuilder
      .speak(REGISTRO)
      .withSimpleCard(REGISTRO)
      .withShouldEndSession(false)
      .getResponse();
    } else {
      var options = {
        "method": "GET",
        "hostname": "213.27.216.171",
        "port": "8081",
        "path": "/reducedExpenses/0/0",
        "headers": {
          "Authorization": accessToken,
          "Authorization-Type": "jwt"
        }
      };
    const response = await httpGet(options);
    console.log(response);
    texto = "";
    if(categoria == undefined) {
      let max = 0;
      for (r in response){
        if(response[r] !== 0) {
          if(response[r] >= max) {
            max = response[r];
            texto = "En la categoría " + r +" has gastado " + response[r] + " euros. ";
          }
        }
      }
      if(texto === "") {
        texto = "No has tenido ningun gasto este mes";
      }
    }else {
      console.log(categoria)
      texto = "En la categoría " + categoria +" has gastado " + response[categoria] + " euros. ";
    }

    return handlerInput.responseBuilder
      .speak(texto)
      .withSimpleCard(texto)
      .withShouldEndSession(false)
      .reprompt('cualo?')
      .getResponse();
    }
  },
 };
const Consejo = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'consejo';
  },
  async handle(handlerInput) {
      var options = {
        "method": "GET",
        "hostname": "213.27.216.171",
        "port": "8081",
        "path": "/getAdvice",
        "headers": {
          "cache-control": "no-cache"
        }
      };
    const response = await httpGet(options);
   speechOutput =  response.description;
 
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(speechOutput)
      .withShouldEndSession(false)
      .reprompt('¿puedes repetirlo?')
      .getResponse();
  },
 };
 
 function httpGet(options) {
    return new Promise(((resolve, reject) => {
        var https = require('http');
      const request = https.request(options, (response) => {
        response.setEncoding('utf8');
        let returnData = '';
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
        }
        response.on('data', (chunk) => {
          returnData += chunk;
        });
        response.on('end', () => {
          resolve(JSON.parse(returnData));
        });
        response.on('error', (error) => {
          reject(error);
        });
      });
      console.log()
      request.end();
    }));
  }



const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Fincancial Advisor';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const REGISTRO = 'registrate en bbva desde la app de alexa';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    Inicio,
    Consejo,
    Balance,
    Gastos,
    Prestamos,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
