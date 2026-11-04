/**
 * 1. Crea un Google Sheets buit.
 * 2. Posa ací el seu identificador.
 * 3. Executa configurarProjectePDC() una sola vegada.
 * 4. Edita els noms a la pestanya Usuaris i la contrasenya a Contrasenya!A2.
 * 5. Posa ací la clau d'OpenAI. Este fitxer és privat i no es puja a GitHub.
 * 6. Guarda FIREBASE_SERVICE_ACCOUNT_EMAIL i FIREBASE_PRIVATE_KEY en
 *    Propietats del script per a l'autenticació invisible i el reinici anual.
 */
var SPREADSHEET_ID = "POSA_ACI_L_ID_DEL_GOOGLE_SHEETS";
var OPENAI_API_KEY = "POSA_ACI_LA_CLAU_OPENAI";
var OPENAI_ACTIU = true;
// Correccio academica amb rubrica i nota.
var OPENAI_MODEL = "gpt-6-luna";
// Comprovacio flexible posterior: no modifica la nota.
var OPENAI_CORRECTION_MODEL = "gpt-6-luna";
var OPENAI_MAX_OUTPUT_TOKENS = 1600;
var DOCENT_SESSION_SECONDS = 21600;
// Durant una classe iniciada pel docent, una sessió recent només es pot
// traslladar a un altre equip amb autorització. Després d'este temps
// d'inactivitat, el canvi és automàtic i queda anotat.
var CLASS_INACTIVITY_MINUTES = 30;
// Ha de coincidir amb public/firebase-config.js i public/config.js.
// No és una clau secreta: s'usa només perquè el reinici anual netege el grup PDC correcte.
var FIREBASE_DATABASE_URL = "https://POSA_ACI-default-rtdb.europe-west1.firebasedatabase.app";
var FIREBASE_ROOT = "GamificacioPDC";
